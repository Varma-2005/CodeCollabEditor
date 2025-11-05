# CollabCodeEditor Server

## Setup Instructions

### 1. Get Free Judge0 API Key (For Code Compilation)

1. Visit: https://rapidapi.com/judge0-official/api/judge0-ce
2. Click "Subscribe to Test" button
3. Choose the **FREE Plan** (50 requests/day)
4. Copy your **X-RapidAPI-Key**
5. Add to `.env` file:

```properties
RAPIDAPI_KEY=your_copied_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Server

```bash
npm run dev
```

## Features

✅ Real code compilation and execution
✅ 13+ programming languages supported
✅ Free tier: 50 requests/day
✅ Fast execution (< 5 seconds)
✅ Secure sandboxed environment
✅ Memory and CPU time limits

## Supported Languages

- JavaScript (Node.js)
- Python 3
- Java
- C++ 17
- C
- C#
- PHP
- Ruby
- Go
- Rust
- Kotlin
- Swift
- TypeScript

## Environment Variables

Required in `.env`:
- `DB_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT secret for authentication
- `RAPIDAPI_KEY` - Judge0 API key from RapidAPI
