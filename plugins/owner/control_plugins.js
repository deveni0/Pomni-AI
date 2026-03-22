import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, bot, command }) => {
  const base = bot.config?.commandsPath || './plugins';
  const [cmd, target] = m.text.split(' ');
  
  const listFiles = () => {
    const files = [];
    const walk = (dir) => {
      const items = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      for (const item of items) {
        const p = path.join(dir, item);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (item.endsWith('.js')) files.push(path.relative(base, p).replace(/\.js$/, ''));
      }
    };
    walk(base);
    return files.sort();
  };
  
  const findFile = (name) => {
    const search = (dir) => {
      const items = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      for (const item of items) {
        const p = path.join(dir, item);
        if (fs.statSync(p).isDirectory()) {
          const found = search(p);
          if (found) return found;
        } else if (item === `${name}.js`) return p;
      }
      return null;
    };
    return search(base);
  };
  
  if (command === 'اضافه_ملف') {
    if (!target) {
      const files = listFiles();
      let msg = `📁 *الملفات الموجودة* (${files.length})\n\n`;
      if (!files.length) msg += '└─ لا توجد ملفات';
      else {
        for (let i = 0; i < files.length; i += 20) {
          const chunk = files.slice(i, i + 20);
          msg += `┌─ ${i+1}-${Math.min(i+20, files.length)}\n`;
          msg += chunk.map(f => `│ 📄 ${f}`).join('\n') + '\n└────────────────\n\n';
        }
        msg += '```.اضافه_ملف المسار/الاسم\n(مع الرد على الكود)```';
      }
      return m.reply(msg);
    }
    
    if (!m.quoted) return m.reply('✦ *الرد على الكود اولا* ✦');
    const content = m.quoted.text || m.quoted.body;
    if (!content) return m.reply('✧ الكود غير موجود ✧');
    
    const parts = target.split('/');
    const name = parts.pop();
    let dir = base;
    for (const p of parts) {
      dir = path.join(dir, p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = path.join(dir, `${name}.js`);
    fs.writeFileSync(filePath, content);
    m.reply(`✅ *تم الرفع*\n└─ \`${path.relative(base, filePath)}\``);
  }
  
  else if (command === 'حذف_ملف') {
    if (!target) {
      const files = listFiles();
      let msg = `🗑️ *الملفات المتاحة* (${files.length})\n\n`;
      if (!files.length) msg += '└─ لا توجد ملفات';
      else {
        for (let i = 0; i < files.length; i += 20) {
          const chunk = files.slice(i, i + 20);
          msg += `┌─ ${i+1}-${Math.min(i+20, files.length)}\n`;
          msg += chunk.map(f => `│ 📄 ${f}`).join('\n') + '\n└────────────────\n\n';
        }
        msg += '```.حذف_ملف المسار/الاسم```';
      }
      return m.reply(msg);
    }
    
    let filePath = path.join(base, `${target}.js`);
    if (!fs.existsSync(filePath)) {
      filePath = findFile(target.split('/').pop());
    }
    
    if (!filePath || !fs.existsSync(filePath)) {
      return m.reply(`❌ \`${target}.js\`\n└─ غير موجود`);
    }
    
    fs.unlinkSync(filePath);
    
    const clean = (dir) => {
      if (dir === base) return;
      if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
        clean(path.dirname(dir));
      }
    };
    clean(path.dirname(filePath));
    
    m.reply(`🗑️ *تم الحذف*\n└─ \`${path.relative(base, filePath)}\``);
  }
};

handler.category = 'owner';
handler.command = ['اضافه_ملف', 'حذف_ملف'];
handler.owner = true;

export default handler;