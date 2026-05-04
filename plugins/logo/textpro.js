import axios from "axios";

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`🍭 مثال:\n.${command} venom`);

  let effect = "";

  switch (command) {
    case "عميق":
      effect = "deepsea";
      break;
    case "رعب":
      effect = "horror";
      break;
    case "بينك":
      effect = "pink";
      break;
    case "حلوى":
      effect = "candy";
      break;
    case "كريسماس":
      effect = "christmas";
      break;
    case "فاخر":
      effect = "luxury";
      break;
    case "سماء":
      effect = "sky";
      break;
    case "حديد":
      effect = "steel";
      break;
    case "صمغ":
      effect = "glue";
      break;
    case "قماش":
      effect = "fabric";
      break;
    case "ترانسفورمر":
      effect = "transformer";
      break;
    case "سام":
      effect = "toxic";
      break;
    case "قديم":
      effect = "ancient";
      break;
    case "رعد":
      effect = "thunder";
      break;
    case "قوسقزح":
      effect = "graphy";
      break;
    case "نيون":
      effect = "neon";
      break;
    case "ثلج":
      effect = "frozen";
      break;
    case "لوجو_ناروتو":
      effect = "naruto";
      break;
    case "لوجو_بوكيمون":
      effect = "pokemon";
      break;
    case "لوجو_باتمان":
      effect = "batman";
      break;
    case "منقوش":
      effect = "engraved";
      break;
    default:
      return m.reply("❌ أمر غير معروف");
  }

  try {
    const { Scrapy } = await import("meowsab");
    const { data } = await Scrapy.TextPro({ name: effect, text: text });

    let config = {
      method: "GET",
      url: data.image,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.179 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "cache-control": "max-age=0",
        "sec-ch-ua":
          '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
        dnt: "1",
        "sec-fetch-site": "none",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        "accept-language": "ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7",
        priority: "u=0, i",
      },
    };

    const response = await axios.request(config);
    await conn.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `✅ done — *(${text})*`,
    }, { quoted: global.reply_status });
  } catch (error) {
    m.reply(error.message);
  }
};

const logos = [
  "عميق",
  "رعب",
  "بينك",
  "حلوى",
  "كريسماس",
  "فاخر",
  "سماء",
  "حديد",
  "صمغ",
  "قماش",
  "ترانسفورمر",
  "سام",
  "قديم",
  "رعد",
  "قوسقزح",
  "نيون",
  "ثلج",
  "لوجو_ناروتو",
  "لوجو_بوكيمون",
  "لوجو_باتمان",
  "منقوش",
];

handler.command = logos;
handler.category = "logos";
handler.usage = logos;

export default handler;
