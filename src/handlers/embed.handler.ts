import { Injectable } from '@nestjs/common';
import {
  Command,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
} from '@n0xgg04/nezon';
import type { Nezon } from '@n0xgg04/nezon';

@Injectable()
export class EmbedHandler {
  @Command('embed')
  async onEmbedDemo(@AutoContext() [message]: Nezon.AutoContext) {
    await message.reply(
      SmartMessage.text('').addEmbed(
        new EmbedBuilder()
          .setColor('#abcdef')
          .setTitle('Example Embed')
          .setThumbnail('https://example.com/thumb.jpg')
          .addField('Field 1', 'Value 1', true)
          .addField('Field 2', 'Value 2', true)
          .setImage('https://example.com/image.jpg')
          .setFooter('Example footer'),
      ),
    );
  }

  // Using Markdown in Description
  @Command('markdown')
  async onMarkdownDemo(@AutoContext() [message]: Nezon.AutoContext) {
    await message.reply(
      SmartMessage.text('').addEmbed(
        new EmbedBuilder()
          .setColor('#E91E63')
          .setTitle('[SPECIALIZED] The basic managerial skill(s) is(are)')
          .setDescriptionMarkdown(
            [
              '1 - business strategy, human resource practices, organisational capabilities',
              '2 - marketing strategy, human resource practices, organisational capabilities',
              '3 - business strategy, human resource practices, organisational structure',
              '4 - marketing strategy, human resource practices, organisational structure',
              '5 - to supervise',
              '6 - to stimulate',
              '7 - to motivate',
              '8 - all of the above',
            ],
            { after: '(Chọn đáp án đúng tương ứng phía bên dưới!)' },
          ),
      ),
    );
  }
}
