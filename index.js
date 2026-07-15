import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '20123456789', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
  // Owner 1
    { name: "ℌ𝔞𝔨𝔯 🥂💗", lid: "201110312474@lid", jid: "972569311531@s.whatsapp.net" },
  // Owner 2
    { name: "ℌ𝔞𝔨𝔯 👾⚡", lid: "201110312474@lid", jid: "201144480436@s.whatsapp.net" },
  // Owner 3
    { name: "𝔦𝔱𝔠𝔥𝔦𝔤𝔬 ✨🍷", jid: "201008964196@s.whatsapp.net", lid: "50414477168824@lid" },
  // Owner 4 
   { name: "𝓣𝓸𝓳𝓲 ✨🍷", jid: "201125395123@s.whatsapp.net", lid: "51664513925368@lid" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "♡ ℌ𝔞𝔨𝔯 🥂💗 〈", 
  nameChannel: "ℌ𝔞𝔨𝔯 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 👽⚡", 
  idChannel: "120363225356834044@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbDDesV1SWsxbj6F2z2V"
  },
  copyright: { 
    pack: 'ℌ𝔞𝔨𝔯 🥂💗', 
    author'ℌ𝔞𝔨𝔯 🥂💗'
  },
  images: [
    "https://i.pinimg.com/originals/11/26/97/11269786cdb625c60213212aa66273a9.png",
    "https://i.pinimg.com/originals/e2/21/20/e221203f319df949ee65585a657501a2.jpg",
    "https://i.pinimg.com/originals/bb/77/0f/bb770fad66a634a6b3bf93e9c00bf4e5.jpg"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
if (client.commandSystem) { 
sub(client)
  }
}, 2000);


/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
});


/* 
=========== Memory Monitor ========== 

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 800) {
        console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
        process.exit(1) 
    }
}, 300_000) 

*/
