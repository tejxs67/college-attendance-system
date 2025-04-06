# 📡 WebSocket-Based College Attendance System

A real-time attendance system built using **Socket.io**, designed for **local network connectivity** via a cellular hotspot or Wi-Fi router. It allows students to mark their attendance seamlessly while preventing proxy attempts with security measures like device and IP verification.

---

## 🔧 Features

- ✅ **Real-time attendance** via WebSocket (Socket.io)
- 📡 **Local network-based** (Hotspot or Wi-Fi)
- 🔒 **Secure authentication** using tokens, IP tracking, and device attributes
- 🕒 **Auto-mark absent** for unresponsive students after lecture timeout
- 🚫 **Proxy prevention** using token + IP verification mechanism

---

## 🛠 Tech Stack

- **Frontend**: HTML5 / JavaScript
- **Backend**: Node.js + Express.js
- **WebSockets**: Socket.io
- **Security**: Token-based session tracking, IP monitoring
- **Network**: Local Wi-Fi / Hotspot only (no external internet dependency)

---

## 🚀 How It Works

1. **Start the Server** on local network (hotspot/router)
2. **Students Connect** to the same network via browser
3. **Mark Presence** by hitting the attendance button
4. **Server Verifies** IP, token, and timestamp
5. **Auto-absent** is triggered post session expiry for inactive students

---

## 📂 Project Structure

```
/server
  └── index.js (Socket server logic)
  └── auth.js (Token/IP verification)
  
/client
  └── index.html (Student UI)
  └── socket.js (Client-side WebSocket logic)
```

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/yourusername/college-attendance-system.git
cd college-attendance-system
npm install
node server/index.js
```

Students can access the client UI via:  
`http://<your-local-IP>:3000`

---

## 🔐 Security Model

- IP Address Locking
- Token-based Identification
- Session-based Logging

---

## 📌 Use Cases

- College Lectures
- Workshops
- Local Training Sessions

---
