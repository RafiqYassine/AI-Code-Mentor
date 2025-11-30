# AI Code Mentor

An intelligent code analysis tool powered by **Google Gemini 2.0 Flash** and **Firebase**.
This application helps developers explain, debug, and improve their code through a clean, minimalist "VibeCoding" interface.

## 🚀 Features

- **Explain Code**: Get clear, human-readable explanations of complex logic.
- **Find Bugs**: Detect potential bugs, security issues, and logical errors.
- **Improve Code**: Automatically refactor code for performance and readability (AI writes the improvements directly into your editor).
- **History Tracking**: Save your analysis history to the cloud using Firestore.
- **Google Auth**: Secure login to access your personal history.

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Firebase Functions (Node.js) & Firestore
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Authentication**: Firebase Auth (Google Provider)

## 📋 Prerequisites

- Node.js (v18 or later)
- A Google Cloud / Firebase Project
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-code-mentor.git
cd ai-code-mentor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Gemini API Key:

```env
API_KEY=your_gemini_api_key_here
```

### 4. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** (Google Provider).
4. Enable **Firestore Database**.
5. Copy your web app configuration keys.
6. Open `firebase.ts` and replace the placeholder `firebaseConfig` object with your actual credentials.

## 🏃‍♂️ Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## ☁️ Deployment (Firebase Hosting)

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Hosting (if not already done):
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project".
   - Set public directory to `dist`.
   - Configure as a single-page app (Yes).

4. Build and Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🧠 Cloud Functions (Backend)

The `functions/` folder contains the backend logic. To deploy it:

```bash
cd functions
npm install
firebase deploy --only functions
```

## 📄 License

MIT
