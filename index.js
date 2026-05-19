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
    { name: "⃠✦⃟ وٌيـًٍّ̨̥ڛـًٌٍّ̨̥ڰﻲ // 𝑾𝒉𝒊𝒔𝒌𝒆𝒚​​​​​​​​​​​​​​ ⃠✦⃟", lid: "201141004467@lid", jid: "+84767389955@s.whatsapp.net" },
  // Owner 2
    { name: "⃠✦⃟ ☬Maro☬ ⃠✦⃟", lid: "20 15 53102408@lid", jid: "201068254334@s.whatsapp.net" },
  // Owner 3
    { name: "ًآوًُسًــــــــكَآر", jid: "201141346373@s.whatsapp.net", lid: "201050993985@lid" },
  // Owner 4 
   { name: "Whiskey.Developer2", jid: "201159803557@lid" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.WhiskeyGroup (group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "♡ whiskey 🎪 〈", 
  nameChannel: "Developer Channel Whiskey  ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️", 
  idChannel: "https://whatsapp.com/channel/0029VbCvb568fewqFvpAoh2t",
  urls: {
    repo: "https://chat.whatsapp.com/LJzJRzjdMWyBXkz2sBSJbh",
  urls: {
    repo,
  urls{
    repo,
  urls
  urls: {
    repo: "httpsni-AI",
    api: "https://whiskey-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbCvb568fewqFvpAoh2t"
  },
  copyright: { 
    pack: 'Whiskey', 
    author: 'whiskey'
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
