import { AiChat } from "../../system/utils.js";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("💙 ~ حط نص جنب الأمر ~ ❤️");
  const res = await AiChat({ text });
  m.reply(res);
};

handler.usage = ["بوت"];
handler.category = "Ai";
handler.command = ["بوت"];

export default handler;