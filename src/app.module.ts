import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NezonModule } from '@n0xgg04/nezon';
import { PingHandler } from './handlers/ping.handler';
import { ButtonHandler } from './handlers/button.handler';
import { EmbedHandler } from './handlers/embed.handler';
import { FormHandler } from './handlers/form.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NezonModule.forRoot({
      token: process.env.MEZON_TOKEN ?? '',
      botId: process.env.MEZON_BOT_ID ?? '',
    }),
  ],
  controllers: [],
  providers: [
    PingHandler,
    ButtonHandler,
    EmbedHandler,
    FormHandler,
  ],
})
export class AppModule {}
