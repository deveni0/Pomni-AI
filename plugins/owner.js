let handler = async (m, { conn, bot }) => {
  let watermark = '𝕾𝖍𝖆𝖉𝖔𝖜';
  
  let quoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: '👑┊𝕾𝖍𝖆𝖉𝖔𝖜┊👑' }
  };
  const num = bot.config.owners[0].jid.split("@")[0];
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;waid=${num}:+${num}
END:VCARD`;

  let img = 'https://i.pinimg.com/originals/e2/21/20/e221203f319df949ee65585a657501a2.jpg';
  
  await conn.sendMessage(m.chat, {
    contacts: { displayName: watermark, contacts: [{ vcard }] },
    contextInfo: {
      forwardingScore: 2023,
      externalAdReply: {
        title: '𝑇𝛨𝛯 𝛩𝑊𝛮𝛯𝑅',
        body: watermark,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb3UUKz3QxS3bgWmTc3x',
        thumbnailUrl: img,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted })
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;