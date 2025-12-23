import { Injectable } from '@nestjs/common';
import {
  Command,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from '@n0xgg04/nezon';
import type { Nezon } from '@n0xgg04/nezon';

@Injectable()
export class FormHandler {
  @Command('form')
  async onFormDemo(@AutoContext() [message]: Nezon.AutoContext) {
    await message.reply(
      SmartMessage.build()
        .addEmbed(
          new EmbedBuilder()
            .setColor('#E91E63')
            .setTitle('POLL CREATOR')
            .addTextField('Title', 'title', {
              placeholder: 'Input title here',
              defaultValue: '',
            })
            .addTextField('Option 1️⃣', 'option_1', {
              placeholder: 'Input option 1 here',
            })
            .addSelectField(
              'Type',
              'type',
              [
                { label: 'Single choice', value: 'SINGLE' },
                { label: 'Multiple choice', value: 'MULTIPLE' },
              ],
              'SINGLE',
            )
            .setFooter('Powered by Mezon'),
        )
        .addButton(
          new ButtonBuilder().setLabel('Create').setStyle(ButtonStyle.Success),
        ),
    );
  }
}
