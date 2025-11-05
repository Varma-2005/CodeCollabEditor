const express = require('express');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');

const router = express.Router();

// JDoodle API configuration (Free & Unlimited)
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '6cc81567b0msh53b1b35e8c4242ep1a5c90jsne39f3dad1617';
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';

console.log('🔑 Compiler API Configuration:');
console.log('  API URL:', JUDGE0_API_URL);
console.log('  API Key:', RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 15) + '...' : 'NOT SET');
console.log('  API Host:', RAPIDAPI_HOST);

// Language ID mapping for Judge0
const languageIds = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++ 17
  c: 50,           // C
  csharp: 51,      // C#
  php: 68,         // PHP
  ruby: 72,        // Ruby
  go: 60,          // Go
  rust: 73,        // Rust
  kotlin: 78,      // Kotlin
  swift: 83,       // Swift
  typescript: 74,  // TypeScript
};

// Language names for display
const languageNames = {
  javascript: 'JavaScript (Node.js)',
  python: 'Python 3',
  java: 'Java',
  cpp: 'C++ 17',
  c: 'C',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  typescript: 'TypeScript',
};

// @route   POST /api/compiler/execute
// @desc    Execute code using Judge0 API
// @access  Private
router.post('/execute', protect, asyncHandler(async (req, res) => {
  const { code, language, stdin } = req.body;

  if (!code || !language) {
    res.status(400);
    throw new Error('Code and language are required');
  }

  // Get language ID
  const languageId = languageIds[language.toLowerCase()];
  
  if (!languageId) {
    res.status(400);
    throw new Error(`Unsupported language: ${language}`);
  }

  // Check if RapidAPI key is configured
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here' || RAPIDAPI_KEY === 'undefined') {
    console.error('❌ RapidAPI key not configured');
    console.error('Current RAPIDAPI_KEY value:', RAPIDAPI_KEY);
    console.error('Check your .env file and restart the server');
    return res.status(500).json({
      success: false,
      message: 'Compiler service not configured. Please add RAPIDAPI_KEY to .env file',
      error: 'MISSING_API_KEY',
      instructions: 'Get free API key from: https://rapidapi.com/judge0-official/api/judge0-ce'
    });
  }

  // Add debug log to confirm API key is loaded
  console.log('🔑 RapidAPI Key loaded:', RAPIDAPI_KEY.substring(0, 10) + '...');

  try {
    console.log('🔄 Submitting code to Judge0:', {
      language: languageNames[language.toLowerCase()],
      languageId,
      codeLength: code.length,
      user: req.user.username
    });

    // Step 1: Submit code for execution
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageId,
        stdin: stdin || '',
        cpu_time_limit: 5,      // 5 seconds
        memory_limit: 128000,    // 128 MB
        wall_time_limit: 10      // 10 seconds
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        },
        timeout: 15000
      }
    );

    const submission = submissionResponse.data;

    // Process the result
    let result = {
      output: '',
      statusCode: submission.status.id,
      statusDescription: submission.status.description,
      memory: submission.memory || '0',
      cpuTime: submission.time || '0',
      error: null
    };

    // Status codes: 1-2 = In Queue/Processing, 3 = Accepted, 4+ = Errors
    if (submission.status.id === 3) {
      // Successful execution
      result.output = submission.stdout || '';
    } else if (submission.status.id === 5) {
      // Time Limit Exceeded
      result.error = 'Time Limit Exceeded';
      result.output = submission.stdout || '';
    } else if (submission.status.id === 6) {
      // Compilation Error
      result.error = submission.compile_output || 'Compilation failed';
    } else if (submission.status.id >= 7 && submission.status.id <= 12) {
      // Runtime Errors
      result.error = submission.stderr || submission.status.description;
      result.output = submission.stdout || '';
    } else {
      // Other errors
      result.error = submission.stderr || submission.status.description;
    }

    console.log('✅ Code executed successfully:', {
      status: submission.status.description,
      statusId: submission.status.id,
      time: submission.time,
      memory: submission.memory
    });

    res.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('❌ Judge0 API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Invalid API key. Please check your RAPIDAPI_KEY in .env',
          error: 'INVALID_API_KEY'
        });
      } else if (status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Rate limit exceeded. Please wait a moment and try again.',
          error: 'RATE_LIMIT_EXCEEDED'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Code execution failed',
          error: errorData?.message || error.message
        });
      }
    } else if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Execution timeout - request took too long',
        error: 'TIMEOUT'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to execute code',
        error: error.message
      });
    }
  }
}));

// @route   GET /api/compiler/languages
// @desc    Get supported languages
// @access  Private
router.get('/languages', protect, asyncHandler(async (req, res) => {
  const languages = Object.keys(languageIds).map(key => ({
    id: key,
    name: languageNames[key],
    languageId: languageIds[key]
  }));

  res.json({
    success: true,
    languages
  });
}));

module.exports = router;
