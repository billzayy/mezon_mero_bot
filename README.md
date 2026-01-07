# Mezon Bot

Bot Mezon là một trợ lý ảo trên nền tảng Mezon, được xây dựng với NestJS và thư viện `@n0xgg04/nezon`. Bot này cung cấp các tính năng giải trí và dự đoán tương lai, bao gồm bói bài Tarot, tính toán thần số học, xem tử vi hàng ngày theo 12 cung hoàng đạo, kiểm tra trạng thái bot, và tạo mã QR từ văn bản hoặc liên kết.

## Setup

## Setup

1.  **Cài dependencies**:

    ```bash
    npm install
    ```

2.  **Cấu hình môi trường**:
    - Copy `.env.example` thành `.env`
    - Điền `MEZON_TOKEN` và `MEZON_BOT_ID`

3.  **Chạy bot**:

    ```bash
    # Development
    npm run start:dev

    # Production
    npm run build
    npm run start:prod
    ```

## Commands

| Lệnh                  | Mô tả                 | Chi tiết / Ví dụ                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ping`                | Kiểm tra bot còn sống | Aliases: `pong`                                                                                                                                                                                                                                                                                                                                    |
| `tarot`               | Bói bài Tarot         | • `/tarot`: Rút thông điệp ngày (Daily)<br>• `/tarot random`: Rút 1 lá ngẫu nhiên<br>• `/tarot spread` hoặc `/tarot 3`: Trải bài 3 lá (Quá khứ - Hiện tại - Tương lai)<br>• `/tarot love`: Trải bài Tình yêu<br>• `/tarot career`: Trải bài Công việc<br>• `/tarot ask <câu hỏi>`: Hỏi Yes/No<br>• `/tarot soul <dd/mm/yyyy>`: Xem lá bài linh hồn |
| `thanso <dd/mm/yyyy>` | Xem Thần Số Học       | Aliases: `numerology`. Xem con số chủ đạo theo hệ Pythagoras                                                                                                                                                                                                                                                                                       |
| `tuvi <cung>`         | Xem Tử Vi 12 cung     | Aliases: `horoscope`, `cung`. Xem vận mệnh, màu sắc, con số may mắn hàng ngày                                                                                                                                                                                                                                                                      |
| `qr <nội dung>`       | Tạo mã QR             | Aliases: `qrcode`. Tạo mã QR từ văn bản hoặc liên kết                                                                                                                                                                                                                                                                                              |

## Cấu trúc thư mục

- `src/app.module.ts`: Cấu hình module chính và đăng ký handlers.
- `src/handlers/`: Chứa các file xử lý lệnh.
  - `tarot.handler.ts`: Logic bói bài Tarot chuyên sâu.
  - `numerology.handler.ts`: Logic tính toán Thần Số Học.
  - `horoscope.handler.ts`: Logic dự báo Tử Vi hàng ngày.
  - `utility.handler.ts`: Các tiện ích như tạo mã QR.
  - `ping.handler.ts`: Lệnh kiểm tra trạng thái bot.
- `src/data/`: Chứa dữ liệu tĩnh (Tarot deck, v.v.).
