# Mezon Bot Nezon (Full Example)

This project contains a Mezon bot built with NestJS and the `nezon` library, including all the examples from the documentation.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    - Copy `.env.example` to `.env`.
    - Fill in `MEZON_TOKEN` and `MEZON_BOT_ID`.

3.  **Run the bot**:
    ```bash
    # Development
    npm run start:dev

    # Production
    npm run build
    npm run start:prod
    ```

## Available Commands

The following commands effectively demonstrate the features of the `@n0xgg04/nezon` library:

-   `ping`: Replies with "pong".
-   `button`: detailed example of a button with a `customId` and a separate component handler.
-   `onclick`: Example of buttons using inline `onClick` handlers.
-   `embed`: Demonstrates creating a rich embed message.
-   `markdown`: Demonstrates using markdown in an embed description.
-   `form`: Demonstrates a complex form with text fields and select menus inside an embed.

## Structure

-   `src/app.module.ts`: Configures `NezonModule` and registers handlers.
-   `src/handlers/`: Contains individual feature handlers.
    -   `ping.handler.ts`: Basic command.
    -   `button.handler.ts`: Button interactions.
    -   `embed.handler.ts`: Embeds and markdown.
    -   `form.handler.ts`: Forms and inputs.
