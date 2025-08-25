const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const readline = require("readline");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false // pairing code mode
    });

    sock.ev.on("creds.update", saveCreds);

    // If session not registered, request pairing code
    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("📱 Enter your WhatsApp number (with country code, e.g. 18761234567): ", async (number) => {
            const code = await sock.requestPairingCode(number);
            console.log("\n🔑 Your Star MD Pairing Code: " + code);
            console.log("➡️ Open WhatsApp > Linked Devices > Link with phone number > Enter this code.\n");
            rl.close();
        });
    }

    // Owner JID
    const owner = "18761234567@s.whatsapp.net"; // change to your WhatsApp number JID

    // Handle incoming messages
    sock.ev.on("messages.upsert", async (msgUpdate) => {
        const m = msgUpdate.messages[0];
        if (!m.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

        if (sender !== owner) return; // only owner can use commands

        if (text === "/menu") {
            await sock.sendMessage(from, {
                text: "🤖 *Star MD Menu*\n\n✅ /menu - Show this menu\n✅ /tagall - Tag everyone (groups only)"
            });
        }

        if (text === "/tagall") {
            if (!from.endsWith("@g.us")) {
                return sock.sendMessage(from, { text: "❌ This command only works in groups." });
            }

            const groupMetadata = await sock.groupMetadata(from);
            const mentions = groupMetadata.participants.map(p => p.id);

            await sock.sendMessage(from, {
                text: "🚨 *Star MD Tagging Everyone:*\n" + mentions.map(u => `@${u.split("@")[0]}`).join(" "),
                mentions
            });
        }
    });

    // Auto reconnect
    sock.ev.on("connection.update", update => {
        const { connection } = update;
        if (connection === "close") {
            console.log("❌ Star MD connection closed, restarting...");
            startBot();
        } else if (connection === "open") {
            console.log("✅ Star MD connected successfully!");
        }
    });
}

startBot();
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
