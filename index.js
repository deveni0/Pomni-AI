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
    { name: "𝓗𝓪𝓴𝓻 🥂", lid: "201110312474@lid", jid: "972569311531@s.whatsapp.net" },
  // Owner 2
    { name: "𝓭𝓸𝓶𝓪 🪷", lid: "201110312474@lid", jid: "201144480436@s.whatsapp.net" },
  // Owner 3
    { name: "𝔦𝔱𝔠𝔥𝔦𝔤𝔬 ✨🍷", jid: "201033024135@s.whatsapp.net", lid: "50414477168824@lid" },
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
  nameBot: "♡ 𝔇𝔬𝔪𝔞 👾 〈", 
  nameChannel: "𐌀ᘖᔦ ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⚡⚡", 
  idChannel: "120363225356834044@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://wa.me/201110312474",
    channel: "https://wa.me/201110312474"
  },
  copyright: { 
    pack: '𐌀ᘖᔦ', 
    author: '𐌀ᘖᔦ'
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
