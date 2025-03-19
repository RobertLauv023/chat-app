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
## Project Structure
```bash
chat-app/
├── frontend
│   ├── __mocks__
│   │   ├── api-client.js       # Mock implementation of an API client
│   │   └── constants.js        # Mock the api routes
│   ├── __tests__
│   │   ├── auth.test.jsx       # Frontend tests for auth routes
│   │   ├── chatrooms.test.jsx  # Frontend tests for chatrooms routes
│   │   ├── contacts.test.jsx   # Frontend tests for contact routes
│   │   └── messages.test.jsx   # Frontend tests for messages routes
│   ├── coverage                # Coverage reports from Jest tests
│   ├── public
│   │   └── vite.svg            # Vite logo
│   ├── src
│   │   ├── assets/react.svg    # react logo
│   │   ├── components/ui       # buttons/input
│   │   ├── lib
│   │   │   ├── api-client.js   # API client via axios
│   │   │   ├── constants.js    # Stores route constants
│   │   │   └── utils.js        # Tailwind utilities
│   │   ├── pages
│   │   │   ├── auth/index.jsx           # Contains Auth routes logic
│   │   │   ├── chatrooms/chatrooms.jsx  # Contains Chatrooms routes logic
│   │   │   ├── contacts/index.jsx       # Contains contacts routes logic
│   │   │   └── messages/messages.jsx    # Contains messages routes logic            
│   │   ├── App.jsx             # Main React component (app-level logic)
│   │   ├── index.css           # Global CSS (Tailwind or custom styles)
│   │   └── main.jsx            # Entry point for the React application
│   ├── .env                    # Frontend environment variables
│   ├── babel.config.cjs        # Config file to set up Babel
│   ├── chatrooms.html          # Chatrooms page
│   ├── chatrooms.js            # Fetching chatrooms
│   ├── create_chatroom.js      # Creating chatrooms
│   ├── homepage.html           # Main page after login
│   ├── index.html              # Login/Registration page
│   ├── login.js                # Send login request to backend
│   ├── logout.js               # Send logout request to backend
│   ├── package-lock.json       # Locked dependancy versions
│   ├── package.json            # Project metadata, scripts, and dependencies
│   ├── search.js               # Send search request to backend
│   ├── search_page.html        # Page to search for users
│   ├── signup.js               # Send signup requests to backend
│   ├── tailwind.config.js      # Config file for Tailwind CSS
│   ├── updateProfile.js        # Send profile update requests to backend
│   ├── userinfo.js             # Send user info get request to backend
│   └── vite.config.js          # Vite configuration file
└── backend
    ├── __tests__
    │   ├── auth.test.jsx               # Backend auth routes tests
    │   ├── authExtended.test.js        # Backend auth routes tests extended
    │   ├── chatrooms_messages.test.js  # Backend chatrooms and messages routes tests
    │   └── contacts.test.js            # Backend contacts routes tests
    ├── coverage                # Coverage reports from Jest tests
    ├── node_modules            # Packages/Dependencies folder
    ├── .env                    # Backend environment variables
    ├── app.js                  # Main server file (Express app)
    ├── babel.config.cjs        # Config file to set up Babel
    ├── jest.config.cjs         # Jest config file
    ├── package-lock.json       # Locked dependency versions
    └── package.json            # Project metadata, scripts, and dependencies
```

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
  
