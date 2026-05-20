import { Scrapy } from "meowsab";

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("مثال: .انمي Naruto");
  
  if (command === "انمي") {
    const se = await Scrapy.Witanime({ query: text, choose: "search" })
    const results = se.data

    const sections = [{
      title: "📺 نتائج البحث",
      rows: results.map(anime => ({
        title: anime.name,
        description: `⭐ ${anime.rating} | 👁️ ${anime.views} | ${anime.release_date}`,
        id: `.تحميل_انمي ${anime.id}`
      }))
    }]

    return await conn.sendButtonNormal(m.chat, {
      media: { url: results[0]?.poster },
      mediaType: 'image',
      caption: `📌 *نتائج البحث عن:* "${text}"\n\n${results.map((a, i) => `${i+1}. *${a.name}*\n⭐ ${a.rating} | 🎬 ${a.genre} | 📅 ${a.release_date}\n👁️ ${a.views.toLocaleString()}\n${'─'.repeat(20)}`).join('\n')}`,
      buttons: [
        { name: "single_select", params: { 
          title: "🎬 اختر الأنمي",
          sections: sections
        }}
      ], 
      mentions: [m.sender],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      },
    }, m)
  }
  
  if (command === "تحميل_انمي") {
    if (!text) return m.reply("ايدي الانمي؟")
    
    const anime = await Scrapy.Witanime({ query: text, choose: "id" })
    const data = anime.data
    
    const episodeSections = [{
      title: `📺 ${data.name}`,
      rows: data.episodes.map(ep => ({
        title: `${ep.name}`,
        description: `📅 ${ep.air_date || "غير محدد"}`,
        id: `.جلب_حلقة ${text}|${ep.episode_number}`
      }))
    }]
    
    return await conn.sendButtonNormal(m.chat, {
      media: { url: data.poster },
      mediaType: 'image',
      caption: `🎬 *${data.name}*\n⭐ ${data.rating} | 👁️ ${data.views.toLocaleString()}\n📅 ${data.first_air_date}\n🎭 ${data.genres?.join(", ") || "غير محدد"}\n\n📝 ${data.overview.slice(0, 200)}...`,
      buttons: [
        { name: "single_select", params: { 
          title: "🎬 اختر الحلقة",
          sections: episodeSections
        }}
      ],
      mentions: [m.sender],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      },
    }, m)
  }
  
  if (command === "جلب_حلقة") {
    if (!text) return m.reply("البيانات المطلوبة: id|episode_number")
    
    const [id, epNum] = text.split("|")
    const anime = await Scrapy.Witanime({ query: id, choose: "id" })
    const episode = anime.data.episodes.find(ep => ep.episode_number == epNum)
    
    if (!episode) return m.reply("الحلقة غير موجودة")
    
    const qualitySections = [{
      title: `🎬 ${anime.data.name} - الحلقة ${epNum}`,
      rows: episode.download_links.map(link => ({
        title: `📥 ${link.quality}`,
        description: "اضغط للتحميل",
        id: `.رابط_تحميل ${link.url}|${anime.data.name}|${epNum}|${link.quality}`
      }))
    }]
    
    return await conn.sendButtonNormal(m.chat, {
      media: { url: episode.thumbnail },
      mediaType: 'image',
      caption: `🎬 *${anime.data.name}*\n📺 *${episode.name}* | 📅 ${episode.air_date || "غير محدد"}\n\n🎀 أختار جودة الفيديو حسب ما تريد:`,
      buttons: [
        { name: "single_select", params: { 
          title: "📥 جودة التحميل",
          sections: qualitySections
        }}
      ],
      mentions: [m.sender],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      },
    }, m)
  }
  
  if (command === "رابط_تحميل") {
    const [url, name, epNum, quality] = text.split("|")
    
    return await conn.sendButtonNormal(m.chat, {
  media: { url: 'https://witanime.life/wp-content/uploads/2023/08/cropped-Logo-WITU-192x192.png' },
  mediaType: 'image', // or image
  caption: `🎬 *${name}*\n📺 الحلقة ${epNum}\n📥 الجودة: *${quality}*\n\n🔗 رابط التحميل:\n${url}\n\n📌 اضغط لدخول لـ Mediafire`,
  buttons: [
    
    // 2. URL Button
    { name: "cta_url", params: { display_text: "🔗 Download", url: url } },
    
  ], 
  mentions: [m.sender],
  newsletter: {
      name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
      jid: '120363225356834044@newsletter'
    },
}, m)
  }
}

handler.usage = ["انمي"];
handler.command = ["انمي", "تحميل_انمي", "جلب_حلقة", "رابط_تحميل"];
handler.category = "downloads";

export default handler;