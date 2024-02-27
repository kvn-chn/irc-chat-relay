# IRC Chat Relay

A seamless real-time communication chat app enabling users to create an account, log in, and join multiple rooms to start chatting with others. Users can utilize various commands:
- ```/msg <username>``` to send a private message to another user in the same room.
- ```/join <room name>```  to join or create a new chat room.
- ```/quit <room name>``` to leave a chat room (if no room name is provided, it will exit the current room).
- ```/nick <new username>``` to change your username to a new one.

## Technologies used

**Backend:**

<a href="https://nodejs.org/docs/latest/api/" target="_blank"><img src="https://img.icons8.com/fluency/48/node-js.png"/></a>
<a href="https://expressjs.com/en/5x/api.html" target="_blank"><img src="https://img.icons8.com/fluency/48/express-js.png"/></a>
<a href="https://www.mongodb.com/docs/" target="_blank"><img src="https://img.icons8.com/color/48/mongodb.png" alt="mongodb"/></a>
<a href="https://socket.io/docs/v4/" target="_blank"><img width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1024px-Socket-io.svg.png"/></a>

**Frontend:**

<a href="https://legacy.reactjs.org/docs/getting-started.html"><img width="auto" height="48" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="react"/></a>
<a href="https://www.typescriptlang.org/docs/"><img width="48" height="48" src="https://img.icons8.com/fluency/48/typescript--v1.png" alt="typescript"/></a>
<a href="https://socket.io/docs/v4/" target="_blank"><img width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1024px-Socket-io.svg.png"/></a>

## The necessary steps to configure and install the project on a new environment

### Installation of software

To make the application work, you need to install:

<a href="https://nodejs.org/en/download" target="_blank"><img src="https://img.icons8.com/fluency/48/node-js.png"/></a>

Download the project:
```cmd
git clone https://github.com/Githendra23/NextBuilder-Connect.git
```

### Launching the API and the website

To launch the web application, you must first start the API, and then the site.

To launch the API, open the terminal, then navigate to the folder "**backend**" with the command *cd*.
```cmd
cd <path inside the folder "backend">
```

Then, execute:
```cmd
node app.js
```

In another terminal, navigate to the folder "**frontend**" and execute:
```cmd
npm run dev
```

Click or copy-paste the provided link into your browser to access the website.

:fireworks: **You have successfully configured and installed the project in your environment** :tada:
