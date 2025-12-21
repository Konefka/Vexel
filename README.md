# Vexel
Vexel is a real-time chat app focused on fast messaging, user accounts, and group conversations. Built as a modern web app with scalability in mind.

<img width="1920" height="919" alt="obraz" src="https://github.com/user-attachments/assets/070de58f-9d2b-4bb7-a3bc-f01279d058cb" />

**The app is in early development, and far from a final release.**<br>
If you find any errors, please open a new `Issue`, describe the error, and explain when the error occurs.<br>
Thank you :)

## Planned Features
- Real-time messaging
- Group chats
- Message persistence
- Images as messages

## Requirements
- Node.js 18+
- npm (comes with Node.js)
- .NET 9.0+ (for backend development)

# Installation

### Frontend
- IDE: Visual Studio Code
- Stack: React + Vite + JavaSript + SCSS
- Requirements: Node.js 18+, npm

1. Install dependencies
``` bash
cd Vexel-frontend
npm install
```

2. Start the development server:
``` bash
npm run dev
```
3. Open your browser and go to http://localhost:5173/

### Backend
- IDE: Visual Studio 2022
- Stack: C# + SignalR + Supabase
- Requirements: .NET 9.0+

Backend features:
- Connects with the frontend
- Login and registration implemented
- Messaging features in development
- Frontend can run independently without the backend
