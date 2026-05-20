export default async function before(m, { conn, bot }) {
    const data = global.db?.groups[m.chat];
    const group = data.insult
    const ins = ["كس", "كسمك", "متناك"]
    if (
      group      && 
      !m.isAdmin && 
      m.text.includes(ins)
        ) m.delete()
        
    return false;
};