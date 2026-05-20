const run = async (m, { conn, bot, args, text }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("❌ نـظـام الـبـوتـات الـفـرعـيـه غير متاح");
  if (!text) return m.reply(`~ اعمل فولو لقناة مثال: \n- .فولو https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v`);

  const urlParts = text.trim().split("/");
  const channelInvite = urlParts[urlParts.length - 1];
  if (!channelInvite) return m.reply("❌~ الرابط مش صحيح");

  let channelJid;
  try {
    const metadata = await conn.newsletterMetadata("invite", channelInvite);
    channelJid = metadata.id;
  } catch (err) {
    return m.reply(`❌~ مش قادر أوصل للقناة`);
  }

  const res = (await sub.list()).filter(b => b.connected && b.phone && b.id !== bot.id);
  if (res.length === 0) return m.reply("❌~ مافيش بوتات فرعية متصلة");

  const ids = [];
  const loadingMsg = await conn.sendMessage(m.chat, {
    text: "```⏳ جـاري عـمـل فـولـو...```"
  }, { quoted: global.reply_status });

  for (const bots of res) {
    try {
      const subBot = await sub.get(bots.id);
      await subBot.sock.newsletterFollow(channelJid);
      ids.push(bots.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {}
  }
  
  await conn.sendMessage(m.chat, {
    text: `✅ — تم عمل فولو للقناة بواسطة ${ids.length} بوت فرعي`,
    edit: loadingMsg.key
  });
};

run.command = ["فولو"];
run.noSub = true;
run.owner = true;
run.usage = ["فولو"];
run.category = "sub";
export default run;