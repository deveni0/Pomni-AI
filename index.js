import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '212784776925', // رقم البوت الخاص بك
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
    // تم استبدال المطورين برقمك واسمك لحماية صلاحيات المالك
    { name: "KAKACHI", jid: "212784776925@s.whatsapp.net" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins' // سيبحث البوت عن مجلد الأوامر بهذا الاسم
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
  nameBot: "🥷 𝙆𝘼𝙆𝘼𝘾𝙃𝙄 𝘽𝙊𝙏 ⚡", // اسم البوت الجديد
  nameChannel: "", 
  idChannel: "", // تم إزالة معرف القناة القديم لعدم إزعاجك
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "" // تم إزالة رابط القناة القديم
  },
  copyright: { 
    pack: '𝙆𝘼𝙆𝘼𝘾𝙃𝙄', // حقوق الملصقات باسمك
    author: '𝙆𝘼𝙆𝘼𝘾𝙃𝙄'
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
