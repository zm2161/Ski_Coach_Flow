# How to Run the Project

## Quick Start Guide

### Step 1: Install Dependencies (First Time Only)

If you haven't installed dependencies yet:

```bash
npm install
```

This will install all required packages (Express, Multer, Google Generative AI SDK, etc.)

### Step 2: Start the Server

Open a terminal in the project directory and run:

```bash
npm start
```

Or for development mode with auto-reload (recommended):

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

### Step 3: Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

### Step 4: Use the Application

1. **Landing Page**: 
   - Select your sport (⛷️ Skiing or 🏂 Snowboarding)
   - Click or drag & drop a video file (MP4, MOV, AVI, WEBM, max 100MB)
   - Click "Upload Video"

2. **Analysis Page**:
   - Video plays automatically on the left
   - Coaching windows appear on the right as video plays
   - Video freezes when new coaching window appears
   - Click any coaching window to jump to that frame
   - Press Play to continue after a window appears

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it:

1. Create a `.env` file in the project root:
```
PORT=3001
GEMINI_API_KEY=AIzaSyDZWUEqfCe8ZA2jVulhioiNtgz1-yIGCL4
```

2. Then access the app at `http://localhost:3001`

### Dependencies Not Installed

If you see errors about missing modules:

```bash
npm install
```

### Server Won't Start

Check if Node.js is installed:
```bash
node --version
```

Should show v14 or higher. If not, install Node.js from https://nodejs.org/

### API Errors

If you see Gemini API errors in the console:
- Check your internet connection
- Verify the API key is correct (it's set by default in server.js)
- Check server console logs for detailed error messages

## Checking Server Status

To verify the server is running:

```bash
curl http://localhost:3000
```

Or just open `http://localhost:3000` in your browser.

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

