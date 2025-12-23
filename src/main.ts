import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // NestJS usually runs on port 3000, but for a bot it might not need a port if it's just a client.
  // However, Nezon might need to keep the process alive or serve webhooks if expanded.
  // For now, we just start the app context or listen if we want a health check.
  // But usually bots just connect.
  // If we just do app.init(), it might exit if no event loop is active, but the bot client will keep it open.
  // Let's stick to listen(3000) so it feels like a standard Nest app, or just init if we are sure.
  // The example uses 'nodemon index' which runs a script.
  // NestJS `listen` starts the HTTP server.
  await app.listen(3000);
  console.log('Bot application is running on: http://localhost:3000');
}
bootstrap();
