const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");

// ✅ Start the bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true, // Show QR for login
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log("Reconnecting...");
                startBot();
            } else {
                console.log("Logged out. Delete auth_info folder and scan again.");
            }
        } else if (connection === "open") {
            console.log("✅ Bot Connected!");
        }
    });

    // 📩 Handle incoming messages
    sock.ev.on("messages.upsert", async (msgUpdate) => {
        const msg = msgUpdate.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const text = (type === "conversation")
            ? msg.message.conversation
            : (type === "extendedTextMessage")
                ? msg.message.extendedTextMessage.text
                : "";

        if (!text.startsWith("/")) return;

        console.log("📩 Command:", text);

        // ✅ /menu
        if (text === "/menu") {
            await sock.sendMessage(from, { text: "📜 *Bot Menu*\n\n1. /menu - Show this menu\n2. /tagall - Tag everyone" });
        }

        // ✅ /tagall
        if (text === "/tagall") {
            if (!from.endsWith("@g.us")) {
                await sock.sendMessage(from, { text: "⚠️ This command only works in groups!" });
                return;
            }
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants.map(p => p.id);
            await sock.sendMessage(from, {
                text: "👥 *Tagging Everyone:*",
                mentions: participants
            });
        }
    });
}

startBot();