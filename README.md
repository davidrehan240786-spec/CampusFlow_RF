# 🚀 CampusFlow

A modern, real-time campus platform for **buying, selling, donating items** and **recovering lost belongings** — built for students, by students.

🔗 **Live Demo:** https://campus-flow-rf.vercel.app/dashboard

---

## 🧠 Overview

CampusFlow is a full-stack web application designed to simplify campus life by:

- Providing a **trusted marketplace**
- Enabling a **Lost & Found recovery system**
- Supporting **real-time updates**
- Building a **trust-driven student network**

---

## 🎯 Key Features

### 🛒 Marketplace
- Post items for **sale or donation**
- Browse listings with real-time updates
- View item details with images and pricing

### 🔍 Lost & Found System
- Report **lost or found items**
- Centralized tracking system
- Real-time visibility across campus

### 🔐 Authentication
- Google Login (Firebase Auth)
- Phone Authentication support
- Secure user sessions

### 📸 Image Upload
- Supabase Storage integration
- Fast and reliable media handling

### ⚡ Real-Time Updates
- Firestore `onSnapshot` integration
- Instant UI updates without refresh

### 🏆 Trust System
- User profiles with trust score
- Badges and activity tracking
- Verified student identity

### 💬 Communication
- Built-in chat system
- Easy coordination between users

---

## 🧱 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion & GSAP

### Backend
- Firebase Authentication
- Firebase Firestore (Database)
- Supabase (Image Storage)

### Deployment
- Vercel

---

## ⚙️ Architecture

```
Frontend (React)
   ↓
Firebase Auth (User Identity)
   ↓
Firestore (Data Storage)
   ↓
Supabase Storage (Images)
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/campusflow.git
cd campusflow
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 4️⃣ Run the app

```
npm run dev
```

---

## 🔒 Security

- Firebase Authentication ensures secure login
- Firestore rules enforce user-level data access
- Supabase policies manage secure file uploads

---

## 📦 Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── services/
 │    ├── firebase/
 │    └── supabase/
 ├── contexts/
 ├── hooks/
 └── lib/
```

---

## 💡 Future Enhancements

- 🔥 Smart matching for Lost & Found
- 📍 Map-based location tracking
- 📅 Meetup scheduling system
- 📊 Advanced analytics dashboard
- 🤖 AI-based item recognition

---

## 👨‍💻 Author

**Faizan Khan**
**Rehan Ansari**

---

## ⭐ Contributing

Contributions are welcome!  
Feel free to fork this repo and submit a PR.

---

## 📜 License

This project is licensed under the MIT License.
