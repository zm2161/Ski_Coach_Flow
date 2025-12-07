# Quick Start Guide

## Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## How to Use

1. **Landing Page**:
   - Select your sport (Skiing ⛷️ or Snowboarding 🏂)
   - Click or drag & drop a video file (MP4, MOV, AVI, WEBM, max 100MB)
   - Click "Upload Video"
   - Wait for analysis (uses Gemini AI)

2. **Analysis Page**:
   - Video plays automatically on the left
   - Coaching windows appear on the right as the video plays
   - **When a new coaching window appears, the video FREEZES at that moment**
   - Press the Play button to continue
   - **Click any coaching window** to jump to that specific frame for review
   - Scroll down to see older coaching windows

## Key Features

- ✅ Video freezes automatically when new coaching windows appear
- ✅ Click coaching windows to review specific frames
- ✅ AI-powered analysis using CSIA (skiing) and CASI (snowboarding) frameworks
- ✅ Constructive, encouraging feedback from certified instructor perspective

## Troubleshooting

- **Video won't load**: Check that the file format is supported (MP4, MOV, AVI, WEBM)
- **Server not starting**: Make sure port 3000 is available, or set a different PORT in `.env`
- **Analysis not appearing**: Check that your Gemini API key is correct in `.env` or server.js

