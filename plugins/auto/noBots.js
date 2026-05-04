export default async function before(m, { conn, bot }) {
    const groups = [
        "120363353449975838@g.us",
        "120363418376913985@g.us"
    ]; /* حط الجروبات الي عايز البوتات الفرعي متشتغلش فيها */

    if (bot.isSubBot && groups.includes(m.chat)) {
        return true;
    }

    return false;
}