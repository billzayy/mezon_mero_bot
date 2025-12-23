import { Injectable } from '@nestjs/common';
import {
  Command,
  AutoContext,
  Component,
  ComponentParams,
  SmartMessage,
  ButtonBuilder,
  ButtonStyle,
} from '@n0xgg04/nezon';
import type { Nezon } from '@n0xgg04/nezon';

@Injectable()
export class ButtonHandler {
  // Example 1: Button with Custom ID and Component Handler
  @Command('button')
  async askForConfirm(@AutoContext() [message]: Nezon.AutoContext) {
    await message.reply(
      SmartMessage.text('Nhấn nút để xác nhận.').addButton(
        new ButtonBuilder()
          .setCustomId('/demo/success/12345')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Success),
      ),
    );
  }

  @Component({ pattern: '/demo/success/:source_id' })
  async onConfirm(
    @ComponentParams('source_id') sourceId: string | undefined,
    @AutoContext() [message]: Nezon.AutoContext,
  ) {
    await message.reply(
      SmartMessage.text(`Đã xác nhận với source ID: ${sourceId}`),
    );
  }

  // Example 2: Button with OnClick Handler
  @Command('onclick')
  async onClickDemo(@AutoContext() [message]: Nezon.AutoContext) {
    await message.reply(
      SmartMessage.text('Click the buttons below!')
        .addButton(
          new ButtonBuilder()
            .setLabel('Button 1')
            .setStyle(ButtonStyle.Primary)
            .onClick(async (context) => {
              await context.message.reply(
                SmartMessage.text('Button 1 was clicked!'),
              );
            }),
        )
        .addButton(
          new ButtonBuilder()
            .setLabel('Button 2')
            .setStyle(ButtonStyle.Success)
            .onClick(async ({ message, channel, user }) => {
              const channelName = channel?.name ?? 'unknown';
              const userName = user?.username ?? 'unknown';
              await message.reply(
                SmartMessage.text(
                  `Button 2 was clicked by ${userName} in ${channelName}!`,
                ),
              );
            }),
        ),
    );
  }
}
