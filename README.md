# WhatsApp Bot - Stars MD

A simple WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys) that supports `/menu` (shows the bot menu) and `/tagall` (tags everyone in a group). This bot is **owner-only**, meaning only your WhatsApp number can use the commands.

---

## Project Structure

The project files should look like this:

whatsapp-bot/ ├── package.json ├── index.js ├── README.md └── auth_info/   # automatically created after QR pairing

---

## Features

- QR code pairing for login  
- Auto reconnect if session dies  
- Owner-only commands  
- Works in groups for `/tagall`  

---

## Installation & Running Locally

1. Clone this repository:

```bash
git clone https://github.com/YOUR-USERNAME/whatsapp-bot.git
cd whatsapp-bot

2. Install dependencies:



npm install

3. Start the bot:



npm start

4. Scan the QR code in the terminal with WhatsApp → Linked Devices.


5. After scanning, your session will be saved automatically in auth_info/.




---

Owner Setup

Open index.js and set your WhatsApp number:

const owner = "1234567890@s.whatsapp.net"

Only this number can use /menu and /tagall.


---

Commands

Command	Description	Notes

/menu	Shows the bot menu	Owner-only
/tagall	Mentions everyone in a group	Only works in groups



---

Deployment Options

You can deploy the bot on multiple platforms:

GitHub Codespaces:

Open repo in Codespaces

Terminal → npm install && npm start

Scan QR code in terminal


Render:

Go to Render.com

Create a new Web Service → connect GitHub repo

Build Command: npm install

Start Command: npm start


Railway:

Go to Railway

Deploy from GitHub → connect repo

Build Command: npm install

Start Command: npm start


Replit:

Create a new Node.js Repl → import GitHub repo

Run: npm install && npm start

Scan QR code in terminal


VPS / Server (Ubuntu / Debian):

git clone https://github.com/YOUR-USERNAME/whatsapp-bot.git
cd whatsapp-bot
npm install
npm start


---

Important Notes

Keep the auth_info/ folder safe — it contains your session.

If session expires, the bot will ask for a new QR scan.

Only the owner number can use commands.

/tagall only works in group chats.

Make sure Node.js v16+ is installed.



---

Customization

Add more commands by editing index.js inside the sock.ev.on("messages.upsert") block.

Change bot behavior, text, or add more features like auto-reply, welcome messages, etc.



---

License

This project is free to use for personal purposes. Do not sell or distribute as your own.


---

Useful Links

Baileys GitHub

GitHub Codespaces

Render

Railway

Replit


---

If you want, I can now **combine this README.md with the `index.js`, `package.json`, and an empty `auth_info/` folder into a ready-to-upload ZIP**, so you can push to GitHub or deploy instantly.  

Do you want me to create that ZIP?

