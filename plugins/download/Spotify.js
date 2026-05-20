import { Scrapy } from "meowsab";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("مثال: .سبوتيفاي https://open.spotify.com/track/3XiolLAtcY6wi28QyZ9vDO?si=ScKGlkeMQ0GMAkhzuggeYQ");
  m.react("⏳")
  
  const { data } = await Scrapy.spotify(text);
  
  if (!data) return m.reply("❌ : حصل مشكله في التحميل أتأكد من الرابط");
  
  await conn.sendMessage(m.chat, { 
    audio: { url: data.download }, 
    mimetype: 'audio/mpeg',
    fileName: `${data.name}.mp3`
  }, { quoted: m });
  m.react("✅")
}

handler.usage = ["سبوتيفاي"];
handler.command = ["سبوتيفاي", "spotify"];
handler.category = "downloads";

export default handler;