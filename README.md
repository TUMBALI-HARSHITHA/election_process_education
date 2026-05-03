# Election Process Education Platform

## Overview
This project is an accessible, voice-first web application designed to educate all citizens—especially illiterate individuals—on the democratic election process. It provides a simple, highly visual, and interactive experience to help everyone understand their voting rights and procedures.

## 1. Chosen Vertical
**Election Process Education** with a strict focus on **Accessibility for Illiterate People**.
The platform is designed to be understood and used without the need to read any complex text, relying heavily on voice interactions and clear visual cues.

## 2. Approach and Logic
Our approach was to eliminate the barrier of text-based information for illiterate voters. The logic dictates that if a user cannot read, they must be able to listen and speak to the platform. 
- **Visual Cues**: We used large, universally recognizable icons and vibrant, high-contrast colors to differentiate topics (e.g., Voting, Registration).
- **Voice-First Interaction**: Instead of traditional search bars or long articles, we implemented a Smart Voice Assistant that users can simply talk to.
- **Simplified AI**: The AI is strictly prompted to respond in short, basic English sentences suitable for spoken audio, avoiding jargon or complex structures.

## 3. How the Solution Works
The application is built using **Next.js** and **Vanilla CSS Modules**, ensuring a lightweight footprint (repository size well under 10 MB) without relying on heavy UI libraries like TailwindCSS.

- **Frontend Interface**: Features a dashboard of "Education Cards". When a user taps a card, the browser's native **Web Speech Synthesis API** reads the information aloud.
- **Smart Dynamic Assistant**: 
  - The user taps the large microphone icon to speak.
  - The **Web Speech Recognition API** transcribes the speech to text.
  - The text is securely sent to a Next.js API route (`/api/chat`).
  - The backend queries the **Google Gemini API** (`gemini-2.5-flash`), which generates a highly simplified response.
  - The response is sent back to the frontend and spoken aloud to the user.

## 4. Assumptions Made
- **Device Capabilities**: It is assumed that the user has access to a smartphone, tablet, or computer equipped with a working microphone and speakers/audio output.
- **Browser Support**: The solution relies on modern web browsers (like Google Chrome, Safari, or Edge) that support the native Web Speech API for both recognition and synthesis.
- **Basic Visual Recognition**: It is assumed that while the user may not be able to read text, they can recognize basic shapes, colors, and universal icons (like a microphone or a ballot box).
- **Network Access**: An active internet connection is required to communicate with the Google Gemini API for the dynamic voice assistant.

## Setup Instructions
To run this project locally:
1. Navigate into the `epe` directory: `cd epe`
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the `epe` directory and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000` in your browser.
