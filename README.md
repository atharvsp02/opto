<div align="center">
  <h1>OPTO</h1>
</div>

<div align="center">
  <img src="public/Opto-Logo.png" alt="OPTO Logo" width="120" height="120" />
</div>

<div align="center">
  <h3>An Opinion-Based Prediction Platform Using Points Instead of Money</h3>
  <p><strong>Developed with React.js and Firebase</strong></p>
</div>

---

## Overview

**OPTO** is an opinion-based prediction web platform inspired by Probo.  
It allows users to express their opinions and make predictions using virtual points rather than money.  
Each question lets users vote "Yes" or "No," and the results evolve dynamically based on community insights.

The platform promotes engagement, reasoning, and community-driven forecasting — built with modern web technologies for scalability and performance.

---

## Key Features

### Core Functionality

- **Opinion-Based Polls** – Participate in "Yes" or "No" prediction questions.
- **Points System** – Users spend and earn points based on predictions.
- **Real-Time Interaction** – Firebase ensures instant updates across all users.
- **Authentication** – Secure user sign-in and session management.
- **Responsive Design** – Optimized for mobile, tablet, and desktop with Tailwind CSS.

### User Experience

- **Smooth Animations** – Clean transitions and hover effects.
- **Dynamic Question Feed** – Automatically updated with the latest predictions.
- **Modern UI Components** – Built with reusable and scalable React components.
- **Fast Deployment** – Hosted on Vercel for low-latency performance.

---

## Architecture

```
OPTO Platform
├── Frontend (React.js)
│   ├── Components          # UI and functional components
│   ├── Pages               # Page-level views (Home, Login, Polls, etc.)
│   ├── Context             # Global state and user data
│   ├── Assets              # Logos, images, icons
│   ├── App.jsx             # Root component
│   └── main.jsx            # React entry point
├── Backend (Firebase)
│   ├── Authentication      # User login and account handling
│   ├── Firestore DB        # Real-time question and vote storage
│   └── Hosting             # Backend hosting and configuration
└── Deployment
    └── Vercel              # Frontend hosting and continuous deployment
```

---

## Technology Stack

### Frontend

- **React.js** – Component-based UI framework
- **Vite** – Fast build tool and dev server
- **Tailwind CSS** – Utility-first responsive styling
- **JavaScript (ES6+)** – Core scripting language

### Backend

- **Firebase Authentication** – Secure user sign-in
- **Firebase Firestore** – Real-time NoSQL database
- **Firebase Hosting** – Reliable backend hosting

### Deployment

- **Vercel** – Frontend hosting and CI/CD deployment

---

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Steps

```bash
# 1. Clone Repository
git clone https://github.com/atharvsp02/opto.git
cd opto

# 2. Install Dependencies
npm install

# 3. Configure Firebase
# Create a Firebase project at https://console.firebase.google.com
# Enable Authentication and Firestore Database
# Add your Firebase configuration in a .env file
echo "VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id" > .env

# 4. Run Development Server
npm run dev

# Access the app at
# http://localhost:5173

# 5. Deploy to Vercel
npm run build
vercel deploy
```

---

## Project Structure

```
OPTO/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── Opto-Logo.png
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

---

<div align="center">
  <p><strong>Built with React, Firebase, and Tailwind CSS</strong></p>
  <p>
    <a href="https://opto-orpin.vercel.app/">Live Demo</a> •
    <a href="https://github.com/atharvsp02/opto">GitHub Repository</a>
  </p>
</div>
