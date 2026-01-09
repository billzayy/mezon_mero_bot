import { Injectable } from '@nestjs/common';
import {
  Command,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';

@Injectable()
export class HelpHandler {
  @Command({ name: 'help', aliases: ['huongdan', 'h'] })
  async onHelp(@AutoContext() [message]: Nezon.AutoContext) {
    const helpText = `
🔮 **TAROT**
\`*tarot\` → Bói bài ngày
\`*tarot random\` → Rút lá ngẫu nhiên
\`*tarot spread\` → Trải 3 lá (Quá khứ - Hiện tại - Tương lai)
\`*tarot love\` → Trải bài tình yêu
\`*tarot career\` → Trải bài sự nghiệp
\`*tarot ask <câu hỏi>\` → Hỏi Yes/No
\`*tarot soul DD/MM/YYYY\` → Lá Bài Linh Hồn

🔢 **THẦN SỐ HỌC**
\`*thanso DD/MM/YYYY\` → Tính con số chủ đạo

⭐ **TỬ VI**
\`*tuvi <cung>\` → Xem tử vi ngày (VD: \`*tuvi Bạch Dương\`)

📱 **TIỆN ÍCH**
\`*qr <nội dung>\` → Tạo mã QR
\`*ping\` → Kiểm tra bot

💬 **GỬI LỆNH QUA DM**
\`*dm @user *lệnh\` → Gửi gợi ý lệnh cho ai đó qua DM

❓ **TRỢ GIÚP**
\`*help\` → Xem danh sách lệnh
    `.trim();

    const embed = new EmbedBuilder()
      .setTitle('📚 Hướng Dẫn Sử Dụng Bot')
      .setDescription(helpText)
      .setColor('#9B59B6')
      .setFooter('Prefix: * hoặc /');

    await message.reply(SmartMessage.text('').addEmbed(embed));
  }
}
