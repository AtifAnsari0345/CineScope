CineScope is a modern movie & web series tracking web application that allows users to discover, explore, and manage their entertainment seamlessly.

🌐 **Live Demo:** https://cinescope-mark1.vercel.app/

---

## 🚀 Features

- 🔍 **Live Movie & TV Search** (TMDB API)
- 🎬 **Trending & Popular Content**
- 📺 **Web Series Support**
- ⭐ **Ratings & Reviews System**
- ❤️ **Favorites & Watchlist**
- 👁️ **Mark as Watched**
- 👤 **User Authentication (JWT)**
- 🧠 **Personalized Profiles**
- 🖼️ **Profile Image Upload / Initials Avatar**
- 📱 **PWA Support (Install on Phone & Desktop)**
- 🌐 **Responsive UI (Mobile + Desktop)**

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB Atlas

### APIs
- TMDB (The Movie Database API)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📸 Screenshots

> Add your screenshots here

### Home Page
<img width="1406" height="874" alt="image" src="https://github.com/user-attachments/assets/4cd0495d-07ee-475d-ad53-c93817df8b8b" />

### Search Page
<img width="1373" height="868" alt="image" src="https://github.com/user-attachments/assets/a99adb28-e18d-4184-a034-5a0f13e3236a" />

### Movie Details
<img width="1334" height="711" alt="image" src="https://github.com/user-attachments/assets/f7796535-5e55-4ead-a2a4-3b7ca58d7cde" />
<img width="1308" height="739" alt="image" src="https://github.com/user-attachments/assets/d263bca6-d11f-4cf1-964b-beddea4cd842" />

### Profile Page
<img width="1393" height="814" alt="image" src="https://github.com/user-attachments/assets/ebbe467e-e96c-4196-ba28-28e3d3bce335" />

---

# ⚙️ Installation & Setup

## 1. Clone the Repository
```bash
git clone https://github.com/AtifAnsari0345/CineScope.git
cd CineScope
```

## 2. Frontend Setup
Create a `.env` file in the root directory with the following content:
```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_URL=http://localhost:5000/api
```
Run the following commands:
```bash
npm install
npm run dev
```

## 3. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file inside `/server` with these variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run the backend server:
```bash
npm run dev
```
🌍 **Deployment**
- **Frontend (Vercel):**
  - Connected to GitHub, auto deploy on push.
- **Backend (Render):**
  - Node server deployed.
  - MongoDB Atlas connected.

## 🎯 Key Highlights
the project features include:
- Clean UI/UX with cinematic theme.
- Real-time data using TMDB API.
- Secure authentication system.
- Persistent user data with MongoDB.
- PWA support for installable app.
- Fully responsive design.

## 👨‍💻 Author
Atif Ansari
