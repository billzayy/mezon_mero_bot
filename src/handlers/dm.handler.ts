import { Injectable, Logger } from '@nestjs/common';
import {
  Command,
  Args,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';
import { TAROT_DECK, TarotCard, MAJOR_META, SUIT_META, MINOR_YES_NO } from '../data/tarot.data';

@Injectable()
export class DmHandler {
  private readonly logger = new Logger(DmHandler.name);
  private allCards = TAROT_DECK;

  // Helper to get card metadata
  private getCardMetadata(card: TarotCard) {
    let element = '';
    let astrology = '';
    let yesNo = 'Có thể';

    if (card.suit === 'major') {
      const meta = MAJOR_META[card.id];
      if (meta) {
        element = meta.element;
        astrology = meta.astrology || '';
        yesNo = meta.yesNo;
      }
    } else if (card.suit) {
      const suitData = SUIT_META[card.suit];
      element = suitData ? suitData.element : '';
      const firstWord = card.name.split(' ')[0];
      yesNo = MINOR_YES_NO[firstWord] || 'Có thể';
    }

    return { element, astrology, yesNo };
  }

  // Create embed for a card
  private createCardEmbed(card: TarotCard, isReversed: boolean): EmbedBuilder {
    const status = isReversed ? '(Ngược)' : '(Thuận)';
    const color = isReversed ? '#E74C3C' : '#2ECC71';
    const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.id}.jpg`;
    const { element, yesNo } = this.getCardMetadata(card);

    return new EmbedBuilder()
      .setTitle(`🔮 ${card.nameVI} - ${card.name} ${status}`)
      .setImage(imageUrl)
      .setColor(color)
      .setDescription(
        `**Từ khóa:** ${card.keywords.join(', ')}\n\n` +
        `**Ý nghĩa ${status}:**\n${isReversed ? card.meaningRev : card.meaningUp}`
      )
      .setFooter(`Nguyên tố: ${element} | Yes/No: ${yesNo}`);
  }

  /**
   * DM a command result to a mentioned user
   * Usage: *dm @user *tarot
   */
  @Command({ name: 'dm', aliases: ['nhantinrieng'] })
  async onDm(
    @Args() args: Nezon.Args,
    @AutoContext('message') message: Nezon.AutoContextType.Message,
    @AutoContext('dm') dm: Nezon.AutoContextType.DM,
  ) {
    const msgAny = message as any;
    const ctx = msgAny.context || {};
    const rawMsg = ctx.message || {};
    
    const mentions = rawMsg.mentions || [];
    
    this.logger.log(`DM command - mentions: ${JSON.stringify(mentions)}, args: ${JSON.stringify(args)}`);
    
    // Check for mention
    if (!mentions || mentions.length === 0) {
      await message.reply(
        SmartMessage.text('ℹ️ Cách dùng: `*dm @username *lệnh`\nVí dụ: `*dm @BạnA *tarot`\n\n⚠️ Hãy **chọn người dùng từ danh sách** khi gõ @')
      );
      return;
    }

    const targetUser = mentions[0];
    const targetUserId = targetUser.user_id || targetUser.id;
    const targetUsername = targetUser.username || targetUser.display_name || 'Người dùng';
    
    // Find command in args
    const commandArg = args.find(arg => arg.startsWith('*'));
    const commandName = commandArg ? commandArg.substring(1).toLowerCase() : 'tarot';
    
    this.logger.log(`Executing "${commandName}" for user ${targetUserId} (${targetUsername})`);

    try {
      let resultMessage: any;

      // Execute command based on name
      switch (commandName) {
        case 'tarot':
        case 'tarotdm':
          resultMessage = this.executeTarot(targetUserId, targetUsername);
          break;
        case 'tuvi':
        case 'horoscope':
          resultMessage = this.executeTuvi(args, targetUsername);
          break;
        default:
          // Default to tarot
          resultMessage = this.executeTarot(targetUserId, targetUsername);
      }

      // Send via DM
      await dm.send(targetUserId, resultMessage);
      
      await message.reply(
        SmartMessage.text(`✅ Đã gửi kết quả \`*${commandName}\` cho **${targetUsername}** qua DM!`)
      );
    } catch (error: any) {
      this.logger.error(`Failed to send DM: ${JSON.stringify(error)}`);
      await message.reply(
        SmartMessage.text(`❌ Không thể gửi DM cho ${targetUsername}: ${error?.message || 'Lỗi không xác định'}`)
      );
    }
  }

  // Execute tarot command
  private executeTarot(targetUserId: string, targetUsername: string) {
    const randomIndex = Math.floor(Math.random() * this.allCards.length);
    const card = this.allCards[randomIndex];
    const isReversed = Math.random() < 0.3;

    const embed = this.createCardEmbed(card, isReversed);

    return SmartMessage.text(`🎁 **${targetUsername}**, ai đó đã gửi cho bạn một lá bài Tarot!`)
      .addEmbed(embed);
  }

  // Execute tuvi command (simplified)
  private executeTuvi(args: string[], targetUsername: string) {
    const luckyNumber = Math.floor(Math.random() * 99) + 1;
    const luckyColors = ['Đỏ', 'Xanh', 'Vàng', 'Tím', 'Hồng', 'Trắng'];
    const luckyColor = luckyColors[Math.floor(Math.random() * luckyColors.length)];
    const energyLevel = Math.floor(Math.random() * 41) + 60;

    const embed = new EmbedBuilder()
      .setTitle(`⭐ Tử Vi Hôm Nay`)
      .setDescription(`**${targetUsername}**, ai đó đã gửi tử vi cho bạn!`)
      .addField('🍀 Số may mắn', `**${luckyNumber}**`, true)
      .addField('🎨 Màu may mắn', `**${luckyColor}**`, true)
      .addField('⚡ Năng lượng', `**${energyLevel}%**`, true)
      .setColor('#F1C40F');

    return SmartMessage.text('').addEmbed(embed);
  }
}
