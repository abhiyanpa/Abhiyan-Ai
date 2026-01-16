# Abhiyan AI

A powerful, real-time AI chat application built with React, Vite, and Google Gemini.

## Live Demo
🚀 **[ai.abhiyanpa.in](https://ai.abhiyanpa.in/)**

## Features
- **Real-time AI Chat**: Powered by Google's Gemini models.
- **Smart History**: Chats are saved and synchronized across devices using Firebase.
- **Responsive Design**: Beautiful, modern UI that works on desktop and mobile.
- **Secure Authentication**: Firebase Authentication deeply integrated.
- **Markdown Support**: Code blocks and formatting in AI responses.

## Tech Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Backend/Services**: Firebase (Auth, Firestore), Google Gemini API
- **Animations**: Framer Motion

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhiyanpa/Abhiyan-Ai.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file with your API keys:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   # ... other firebase config
   GEMINI_API_KEY=...
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## License
MIT
