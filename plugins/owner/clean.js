import { execSync } from "child_process";

export default {
  command: ["تنظيف"],
  category: "owner",
  usage: ["تنظيف"],
  owner: true,
  async execute(m) {
    try {
      m.react("🧹")
      m.reply("*🧹╎ جاري التنظيف ...*")
      const result = execSync(
        'files=$(ls session/pre-key-* session/device-list-* 2>/dev/null | wc -l); rm -rf session/pre-key-* session/device-list-* 2>/dev/null; echo "$files"',
        { encoding: 'utf-8' }
      );
      
      const count = parseInt(result.trim()) || 0;
      const message = `*🗑️╎  تم تنظيف [ ${count} ] ملف*`;
      
      m.react("🟢")
      await m.reply(message);
    } catch (error) {
      await m.reply(`\`\`\`${error.message}\`\`\``);
    }
  }
}