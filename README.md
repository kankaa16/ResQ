# 🚨 ResQ – Women's Safety App

ResQ is a full-stack mobile safety application designed to assist women during emergencies. With a single **Panic Button**, the app sends an SMS with the user's **live location** to pre-registered **emergency contacts**. 

---

## 🧠 Motto

> *Empowering safety with one tap. Help is just a second away.*

ResQ aims to provide quick, reliable, and discreet emergency assistance. It allows users to save trusted contacts, manage their emergency details, and instantly trigger alerts with location in real-time.

---

## ⚙️ How It Works

1. **User Registration/Login** – Secure login system with JWT authentication.
2. **Add Emergency Contacts** – Users can add/edit emergency contacts and set a primary contact.
3. **Panic Button** – Triggers:
   - A ripple animation for feedback.
   - Sends **SMS with live location** to emergency contacts.
   - Updates last known location in the backend.
4. **Profile Management** – Stores medical info, allergies, blood group, etc., for emergency access.

---

## 🛠️ Tech Stack

### 🔹 Frontend (React Native with Expo)
- React Native
- Axios
- AsyncStorage
- React Navigation
- Animated Ripple UI

### 🔹 Backend (Node.js + Express)
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for auth
- Twilio / Fast2SMS for SMS integration
- Location updates via coordinates

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kankaa16/ResQ.git
cd ResQ

cd backend
npm install
cd resq-mobile
npm install
npx expo start

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

npm start- frontend, nodemon index.js - backend


📱 Screens
 Splash + Login/Register

 Emergency Contact Management

 Panic Button with ripple animation

 SMS Alert System

 Profile + Medical Info View



Made with ❤️ by Kanka Oza
