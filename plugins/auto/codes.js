Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

export default async function before(m, { conn , bot }) {

  if (!global.reply_status) {
    global.reply_status = {
      key: {
        participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
        remoteJid: 'status@broadcast',
        fromMe: false,
      },
      message: {
        contactMessage: {
          displayName: `${m.pushName || 'User'}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`,
        },
      },
      participant: "0@s.whatsapp.net",
    }
  };
  
  return false;
}