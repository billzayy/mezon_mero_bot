import { Injectable } from '@nestjs/common';
import {
  Command,
  Args,
  AutoContext,
  MessageContent,
  SmartMessage,
} from '@n0xgg04/nezon';
import type { Nezon } from '@n0xgg04/nezon';

@Injectable()
export class PingHandler {
  @Command({ name: 'ping', aliases: ['pong'] })
  async onPing(
    @Args() args: Nezon.Args,
    @AutoContext() [message]: Nezon.AutoContext,
    @MessageContent() content?: string,
  ) {
    const suffix = args.length ? args.join(' ') : 'pong';
    await message.reply(SmartMessage.text(`✅ ${suffix} (${content})`));
  }
}
