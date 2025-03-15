## Prerequisites
Make sure to get these installed first

- [Node.js](https://nodejs.org/en) (LTS version recommended)
- [npm](https://www.npmjs.com/) (Comes installed with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (Use the **MongoDB Community Edition** for local use)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (GUI for MongoDB. In case it wasn't installed alongside the **MongoDB Community Edition**)
- [Git](https://git-scm.com/downloads) (Allows usage of Git commands in terminal. Choose based on your OS)
- [VScode](https://code.visualstudio.com/download) (Choose your preferred IDE. This project made use of VScode)

-------------------------------
Ensure that your local **MongoDB** is running at localhost:27017

Check the versions of **Node.js** and **npm** to ensure that they were installed correctly
In the terminal of your choice (this project used Powershell) type:
 - `node -v` and `npm -v` to get the installed versions.

Make sure that your terminal can run scripts, such as those used with `npm`

(FOR POWERSHELL USERS) If you're running into an issue where scripts aren't able to run, make sure to change the ExecutionPolicy.
- Run Powershell as an administrator and type in: `Set-ExecutionPolicy RemoteSigned`
  
Likewise, make sure that the **Git** commands work in your IDE. If not, then you may need to restart your IDE.

-------------------------------

## Installation

1. **Clone** the repository
   - Use `git clone https://github.com/RobertLauv023/chat-app.git` in the directory of your choice
2. **Navigate** to the newly cloned repository in your terminal
3. **Install** dependencies for both the front and backend

```bash
   cd frontend
   npm install
```
```bash
   cd backend
   npm install
```

## Usage

1. Start the server/backend
```bash
   cd backend
   node .\app.js
```
The server will run at http://localhost:8747

2. Start the client/frontend
```bash
   cd frontend
   npm run dev
```
The client will run at http://localhost:5173/

## Features
**Registration/Login**

**Profile Updating**

**User searching**

**Chatroom creation/deletion and message sending**

## Tests
1. Frontend tests
```bash
   cd frontend
   npm test
```

2. Backend tests
```bash
   cd backend
   npm test -- auth.test.js
   npm test -- authExtended.test.js
   npm test -- contacts.test.js
   npm test -- chatrooms_messages.test.js
```
  
