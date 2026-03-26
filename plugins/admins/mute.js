const isOwner = (userId, bot) => bot.config?.owners?.some(o => o.jid === userId || o.lid === userId);

const handler = async (m, { conn, command, bot }) => {
    let target = m.mentionedJid?.[0];
    
    if (!target && m.quoted?.sender) {
        if (typeof m.lid2jid === 'function') {
            target = await m.lid2jid(m.quoted.sender);
        } else {
            target = m.quoted.sender;
        }
    }
    
    if (!target) return m.reply(`*🔇 كتم/فك_كتم @user*\nاو رد على رسالته`);
    if (isOwner(target, bot)) return m.reply(`*❌ لا يمكن كتم المطور*`);
    
    const group = global.db.groups[m.chat] ||= {};
    const muteList = group.mute ||= [];
    const isMuted = muteList.includes(target);
    
    if (command === "كتم") {
        if (isMuted) return m.reply(`*❌ @${target.split('@')[0]} مكتوم*`, null, { mentions: [target] });
        muteList.push(target);
        m.reply(`*✅ تم كتم @${target.split('@')[0]}*\n🔒 لن يتمكن من الكلام`, null, { mentions: [target] });
    } else if (command === "فك_كتم") {
        if (!isMuted) return m.reply(`*❌ @${target.split('@')[0]} ليس مكتوماً*`, null, { mentions: [target] });
        muteList.splice(muteList.indexOf(target), 1);
        m.reply(`*✅ تم فك كتم @${target.split('@')[0]}*\n🔓 يمكنه الكلام الآن`, null, { mentions: [target] });
    }
};

handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return;
    
    const muteList = global.db?.groups[m.chat]?.mute;
    if (!muteList?.length) return;
    
    if (m.isOwner || m.isAdmin || isOwner(m.sender, bot)) return;
    
    let sender = m.sender;
    if (typeof m.lid2jid === 'function') {
        const lid = await m.lid2jid(m.sender);
        if (lid) sender = lid;
    }
    
    const isMuted = muteList.some(muted => muted === sender || muted.split('@')[0] === sender.split('@')[0]);
    
    if (isMuted) {
        await conn.sendMessage(m.chat, { delete: m.key });
        return true;
    }
};

handler.command = ["كتم", "فك_كتم"];
handler.admin = true;

export default handler;