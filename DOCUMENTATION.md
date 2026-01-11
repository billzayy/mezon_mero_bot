# 📖 Mezon Bot - Tài Liệu Toàn Diện

## 🎯 Ý Tưởng & Mục Tiêu

### Ý Tưởng Ban Đầu
Tạo một bot Mezon cung cấp dịch vụ **bói toán tâm linh** (Tarot, Tử Vi, Thần Số Học) với khả năng **cá nhân hóa cao** và **kết quả nhất quán**.

### Vấn Đề Cần Giải Quyết
1. **Thiếu tính cá nhân hóa**: Các bot bói toán thường cho kết quả chung chung, không phân biệt user
2. **Kết quả không nhất quán**: Cùng một câu hỏi hỏi nhiều lần cho nhiều đáp án khác nhau → mất tính tin cậy
3. **Nội dung nghèo nàn**: Lời khuyên generic, không phù hợp với từng cá nhân
4. **Thiếu context**: Không tính đến hoàn cảnh (clan, channel) của user

### Giải Pháp
Xây dựng bot với 3 nguyên tắc core:

#### 1. **Context-Aware Seeding**
```
Kết quả = f(User, Ngày, Clan, Channel, Input)
```
- Cùng người, cùng ngày, cùng nơi → cùng kết quả
- Khác ngày/nơi → kết quả khác
- Đảm bảo tính "thần bí" nhưng vẫn nhất quán

#### 2. **Deterministic Randomness**
Sử dụng **Seeded RNG** (xorshift algorithm):
- Từ cùng seed → sinh cùng sequence "random"
- User thấy kết quả "ngẫu nhiên" nhưng thực chất deterministic
- Tạo độ tin cậy: "Bot không nói xạo"

#### 3. **Rich Personalized Content**
- 200+ lời khuyên chuyên biệt
- Phân loại theo cung/số/lá bài
- Metadata phong phú (career, love, compatibility)

---

## 🏗️ Kiến Trúc Hệ Thống

### Tổng Quan Luồng
```
User Input → Handler → Seed Generation → RNG → Data Selection → Personalized Output
```

### Chi Tiết Từng Bước

#### Bước 1: User Input
```typescript
User gõ: *tarot
Message metadata: {
  senderId: "user123",
  clanId: "clan456",
  channelId: "channel789",
  sender: { avatar, display_name, ... }
}
```

#### Bước 2: Handler Processing
```typescript
// Extract user info
const userInfo = extractUserInfo(message);
// → { userId, displayName, avatar, clanId, channelId }
```

#### Bước 3: Seed Generation
```typescript
const dateString = "2026-01-11";
const seed = `${userId}_${dateString}_${clanId}_${channelId}`;
// → "user123_2026-01-11_clan456_channel789"
```

#### Bước 4: Seeded RNG
```typescript
const rng = createRNG(seed);
// Tạo function RNG deterministic

// Sử dụng
const cardIndex = Math.floor(rng() * 78);  // 0-77
const isReversed = rng() < 0.3;            // 30% chance
```

#### Bước 5: Data Selection
```typescript
// Fetch từ API hoặc local data
const card = await tarotAPI.getCard(cardIndex);
const meaning = VIETNAMESE_MEANINGS[card.id];
```

#### Bước 6: Output Generation
```typescript
const embed = new EmbedBuilder()
  .setTitle(`${meaning.nameVI}`)
  .setDescription(`${meaning.meaningUp}`)
  .setThumbnail(userInfo.avatar)  // Personalization
  .setColor(color);
```

---

## 🔮 Logic Hoạt Động Chi Tiết

### 1. TAROT

#### A. Daily Reading (`*tarot`)

**Input:**
- User ID
- Date (current)
- Clan ID
- Channel ID

**Process:**
```typescript
// 1. Tạo seed
seed = `${userId}_${date}_${clanId}_${channelId}`

// 2. Khởi tạo RNG
rng = createRNG(seed)

// 3. Chọn lá bài (deterministic)
cardIndex = Math.floor(rng() * 78)  // 0-77
card = await API.getCard(cardIndex)

// 4. Xác định ngược (30% chance, deterministic)
rngReverse = createRNG(seed + '_reverse')
isReversed = rngReverse() < 0.3

// 5. Lấy nghĩa
meaning = isReversed ? card.meaningRev : card.meaningUp

// 6. Tạo embed
embed.setThumbnail(userAvatar)
embed.setDescription(meaning)
```

**Output:**
- 1 lá bài
- Trạng thái thuận/ngược
- Ý nghĩa chi tiết
- Avatar user

**Đặc điểm:**
- ✅ Deterministic
- ✅ Context-aware
- ✅ Personalized (avatar + name)

---

#### B. Ask Yes/No (`*tarot ask <question>`)

**Input:**
- Câu hỏi
- User ID, Date, Clan ID, Channel ID

**Process:**
```typescript
// 1. Hash câu hỏi
let questionHash = 0;
for (let i = 0; i < question.length; i++) {
  questionHash = ((questionHash << 5) - questionHash) 
                + question.charCodeAt(i);
  questionHash |= 0;
}

// 2. Tạo seed (bao gồm hash)
seed = `${userId}_${date}_${clanId}_${channelId}_ask_${questionHash}`

// 3. Chọn lá bài
rng = createRNG(seed)
cardIndex = Math.floor(rng() * 78)
card = await API.getCard(cardIndex)

// 4. Xác định ngược (40% - cao hơn daily)
rngReverse = createRNG(seed + '_reverse')
isReversed = rngReverse() < 0.4

// 5. Lấy Yes/No từ metadata
baseAnswer = CARD_METADATA[card.id].yesNo  // "Có", "Không", "Có thể"

// 6. Đảo nếu ngược
if (isReversed) {
  if (baseAnswer === 'Có') answer = 'Không';
  else if (baseAnswer === 'Không') answer = 'Có';
}
```

**Ví dụ:**
```
Input: "Crush có thích mình không?"
Hash: 123456789
Seed: "user123_2026-01-11_clan456_channel789_ask_123456789"
→ Card: The Lovers (Có)
→ Reversed: false
→ Answer: ✅ CÓ
```

**Đặc điểm:**
- ✅ Cùng câu hỏi, cùng ngày → cùng đáp án
- ✅ Khác câu hỏi → hash khác → đáp án khác
- ❌ Phân biệt chữ hoa/thường ("Có" ≠ "có")

---

#### C. Soul Card (`*tarot soul DD/MM/YYYY`)

**Input:**
- Ngày sinh

**Process:**
```typescript
// 1. Tính theo số học Tarot
// VD: 15/05/2000
day = 15 → 1+5 = 6
month = 05 → 0+5 = 5
year = 2000 → 2+0+0+0 = 2

total = 6+5+2 = 13

// 2. Nếu > 22 (số Major Arcana) → rút gọn
if (total > 22) {
  total = reduceTo1To22(total)
}

// 3. Lấy Major Arcana #13
card = MAJOR_ARCANA[13]  // Death
isReversed = false  // Soul card luôn thuận
```

**Output:**
- 1 lá Major Arcana
- Luôn thuận (không ngược)
- Con số Tarot

**Đặc điểm:**
- ✅ Cố định (cùng ngày sinh = cùng lá bài)
- ❌ Không có context (không phụ thuộc user/clan/channel)

---

### 2. TỬ VI (HOROSCOPE)

**Input:**
- Tên cung (VD: "bachduong", "leo", "Bạch Dương")
- User ID, Date, Clan ID, Channel ID

**Process:**
```typescript
// 1. Match cung
sign = matchSign("bachduong")  // → aries
signData = ZODIAC_SIGNS_DATA['aries']

// 2. Tạo seed
seed = `${userId}_${date}_${clanId}_${channelId}_${sign.id}`

// 3. Khởi tạo RNG
rng = createRNG(seed)

// 4. Random base scores (1-5)
baseLove = Math.floor(rng() * 5) + 1
baseCareer = Math.floor(rng() * 5) + 1
baseMoney = Math.floor(rng() * 5) + 1

// 5. Áp dụng sign bonuses
finalLove = Math.min(5, baseLove + signData.loveBonus)
finalCareer = Math.min(5, baseCareer + signData.careerBonus)
finalMoney = Math.min(5, baseMoney + signData.moneyBonus)

// 6. Random các chỉ số khác
energy = Math.floor(rng() * 41) + 60  // 60-100%
luckyColor = COLORS[Math.floor(rng() * COLORS.length)]
luckyNumber = NUMBERS[Math.floor(rng() * NUMBERS.length)]
// ... tương tự cho giờ, hướng, cung hợp

// 7. Chọn advice (1 trong 12 advices của cung)
advice = signData.advices[Math.floor(rng() * signData.advices.length)]
```

**Ví dụ: Bạch Dương (Aries)**
```typescript
ZODIAC_SIGNS_DATA['aries'] = {
  careerBonus: +1,    // Mạnh về sự nghiệp
  loveBonus: 0,
  moneyBonus: 0,
  advices: [
    "Hãy kiềm chế sự nóng vội...",
    "Khả năng lãnh đạo sẽ tỏa sáng...",
    // ... 10 advices nữa
  ]
}

// Với seed "user123_2026-01-11_clan456_channel789_aries"
baseLove = 3
baseCareer = 4
baseMoney = 2

→ finalLove = 3 + 0 = ⭐⭐⭐☆☆
→ finalCareer = 4 + 1 = ⭐⭐⭐⭐⭐ (max)
→ finalMoney = 2 + 0 = ⭐⭐☆☆☆

advice = "Khả năng lãnh đạo sẽ tỏa sáng vào buổi chiều."
```

**Đặc điểm:**
- ✅ Mỗi cung có 12 lời khuyên riêng (144+ total)
- ✅ Score được điều chỉnh theo tính cách cung
- ✅ Context-aware
- ✅ Deterministic

---

### 3. THẦN SỐ HỌC (NUMEROLOGY)

**Input:**
- Ngày sinh (DD/MM/YYYY)

**Process:**
```typescript
// 1. Tính Life Path Number (Pythagoras)
// VD: 15/05/2000

// Step 1: Rút gọn từng phần
day = 15 → 1+5 = 6
month = 05 → 0+5 = 5
year = 2000 → 2+0+0+0 = 2

// Step 2: Cộng tổng
total = 6 + 5 + 2 = 13

// Step 3: Rút gọn (trừ Master Numbers: 11, 22, 33)
// 13 → 1+3 = 4

lifePathNumber = 4

// 2. Lấy data
numberData = NUMEROLOGY_DATA[4]

// 3. Random chọn 1 trong 5 advices
adviceIndex = Math.floor(Math.random() * 5)  // ← KHÔNG seed!
advice = numberData.advices[adviceIndex]

// 4. Tạo output
output = {
  number: 4,
  title: "Người Xây Dựng",
  description: "...",
  strengths: ["Kiên định", "Tổ chức tốt", ...],
  career: ["Kỹ sư", "Kế toán", ...],
  love: "...",
  compatibility: [2, 8, 22],
  advice: advice,
  color: "#8B4513",
  avatar: userAvatar
}
```

**Master Numbers:**
```typescript
// Số 11, 22, 33 KHÔNG được rút gọn thêm

VD: 29/11/1990
day = 29 → 2+9 = 11  // GIỮ NGUYÊN 11
month = 11           // GIỮ NGUYÊN 11
year = 1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1

total = 11 + 11 + 1 = 23 → 2+3 = 5

→ Life Path Number = 5

// Nhưng nếu:
VD: 11/09/1990
day = 11
month = 09 → 0+9 = 9
year = 1990 → 1

total = 11 + 9 + 1 = 21 → 2+1 = 3

Nhưng vì DAY = 11 (Master), có thể giữ:
→ Life Path Number = 11 (Master Number)
```

**Đặc điểm:**
- ✅ Cố định (cùng ngày sinh = cùng số)
- ❌ Không context-aware (không phụ thuộc user/clan)
- ⚠️ Advice selection: Random (không seed) - khác với tarot/horoscope

---

## 🎨 Personalization Features

### 1. Avatar Display
```typescript
// Extract từ message
avatar = message.sender?.avatar 
      || message.sender?.clan_avatar 
      || null

// Hiển thị
if (avatar) {
  embed.setThumbnail(avatar)
}
```

### 2. Display Name
```typescript
// Priority order:
displayName = mention?.display_name     // Nếu mention user khác
           || sender.display_name       // Display name trong clan
           || sender.username           // Username
           || 'Bạn'                     // Fallback
```

### 3. Contextual Footer
```typescript
embed.setFooter(`Personalized for ${displayName}`)
```

---

## 📊 Data Management

### Cấu Trúc Dữ Liệu

#### 1. Tarot Data
```typescript
// vietnamese-meanings.ts
VIETNAMESE_MEANINGS = {
  'ar00': {  // The Fool
    nameVI: 'Chàng Khờ',
    keywords: ['Khởi đầu mới', 'Ngây thơ', ...],
    meaningUp: 'Một khởi đầu mới...',
    meaningRev: 'Sự liều lĩnh...'
  },
  // ... 77 lá khác
}

// tarot.data.ts
MAJOR_META = {
  'ar04': {  // The Emperor
    element: 'Hỏa',
    astrology: 'Bạch Dương',
    yesNo: 'Có'
  },
  // ... 21 Major khác
}

SUIT_META = {
  'wands': { element: 'Hỏa' },
  'cups': { element: 'Thủy' },
  'swords': { element: 'Khí' },
  'pentacles': { element: 'Thổ' }
}
```

#### 2. Horoscope Data
```typescript
// horoscope.data.ts
ZODIAC_SIGNS_DATA = {
  'aries': {
    id: 'aries',
    name: 'Bạch Dương',
    element: 'Hỏa',
    strengths: ['Dũng cảm', 'Quyết đoán', ...],
    weaknesses: ['Nóng vội', ...],
    advices: [
      'Hãy kiềm chế...',
      'Khả năng lãnh đạo...',
      // ... 10 advices nữa
    ],
    careerBonus: 1,
    loveBonus: 0,
    moneyBonus: 0
  },
  // ... 11 cung khác
}
```

#### 3. Numerology Data
```typescript
// numerology.data.ts
NUMEROLOGY_DATA = {
  2: {
    number: 2,
    title: 'Người Hòa Giải',
    description: 'Bạn là người nhạy cảm...',
    strengths: ['Lắng nghe tốt', ...],
    weaknesses: ['Dễ bị tổn thương', ...],
    career: ['Cố vấn', 'Nhà ngoại giao', ...],
    love: 'Bạn cần một mối quan hệ...',
    compatibility: [6, 8, 9],
    advices: [
      'Hãy tin tưởng vào bản thân...',
      'Đừng sợ đưa ra ý kiến...',
      // ... 3 advices nữa
    ],
    color: '#87CEEB',
    element: 'Thủy'  // Optional
  },
  // ... 11 số khác
}
```

---

## 🚀 Cách Sử Dụng

### Cài Đặt
```bash
npm install
npm run build
npm run start
```

### Lệnh Cơ Bản

#### Tarot
```bash
# Bói bài ngày
*tarot

# Rút ngẫu nhiên
*tarot random

# Trải bài
*tarot spread        # Thời gian
*tarot love          # Tình yêu
*tarot career        # Sự nghiệp

# Hỏi Yes/No
*tarot ask Crush có thích mình không?

# Lá bài linh hồn
*tarot soul 15/05/2000
```

#### Tử Vi
```bash
*tuvi bachduong
*tuvi leo
*tuvi Song Ngư
```

#### Thần Số
```bash
*thanso 15/05/2000
```

### Tips

#### 1. Cùng câu hỏi, cùng đáp án
```bash
# Lần 1
*tarot ask Em có yêu anh không?
→ ✅ CÓ

# Lần 2 (cùng ngày)
*tarot ask Em có yêu anh không?
→ ✅ CÓ (giống lần 1)

# Lần 3 (ngày khác)
*tarot ask Em có yêu anh không?
→ ❌ KHÔNG (khác vì khác ngày)
```

#### 2. Context-aware
```bash
# Trong Clan A, Channel 1
*tarot
→ The Fool

# Trong Clan A, Channel 2
*tarot
→ The Magician (khác vì khác channel)

# Trong Clan B, Channel 1
*tarot
→ The High Priestess (khác vì khác clan)
```

#### 3. Personalization
- Avatar hiển thị tự động
- Tên được lấy từ display_name (ưu tiên) hoặc username

---

## 🔧 Technical Deep Dive

### Seeded RNG Algorithm (xorshift)

```typescript
private createRNG(seedStr: string) {
  // 1. Convert string to number
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed |= 0;  // Convert to 32-bit integer
  }
  
  // 2. Return RNG function
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

**Đặc điểm:**
- Cùng seed → cùng sequence
- Period: 2^32 - 1
- Distribution: Uniform [0, 1)

### Seed Format

```typescript
// Tarot Daily
`${userId}_${dateString}_${clanId}_${channelId}`

// Tarot Ask
`${userId}_${dateString}_${clanId}_${channelId}_ask_${questionHash}`

// Tarot Spread
`${userId}_${dateString}_${clanId}_${channelId}_${type}`  // type = love, career, time

// Horoscope
`${userId}_${dateString}_${clanId}_${channelId}_${signId}`
```

### Question Hashing
```typescript
let questionHash = 0;
for (let i = 0; i < question.length; i++) {
  questionHash = ((questionHash << 5) - questionHash) 
               + question.charCodeAt(i);
  questionHash |= 0;
}
```

---

## 📈 Statistics

| Feature | Data Points | Source |
|---------|-------------|--------|
| Tarot Cards | 78 | tarotapi.dev + vietnamese-meanings.ts |
| Tarot Meanings | 156 (78×2) | Up + Reversed |
| Horoscope Signs | 12 | horoscope.data.ts |
| Horoscope Advices | 144+ | 12 per sign |
| Life Path Numbers | 12 | numerology.data.ts |
| Numerology Advices | 60+ | 5 per number |
| **Total Personalized Content** | **200+** | Combined |

---

## 🎯 Best Practices

### Cho Developer

1. **Thêm lời khuyên mới**: Edit `horoscope.data.ts` hoặc `numerology.data.ts`
2. **Thay đổi bonus**: Adjust `careerBonus`, `loveBonus`, `moneyBonus` trong sign data
3. **Testing**: Dùng cùng seed để verify deterministic behavior

### Cho User

1. **Hỏi rõ ràng**: Càng specific câu hỏi, càng dễ interpret kết quả
2. **Cùng ngày**: Hỏi lại cùng câu hỏi trong ngày sẽ được cùng đáp án
3. **Context**: Nhớ rằng kết quả thay đổi theo clan/channel

---

## ⚠️ Limitations

1. **Numerology advice**: Không seeded, mỗi lần random từ 5 advices
2. **Question case-sensitive**: "Có" ≠ "có" trong tarot ask
3. **Date-based**: Kết quả thay đổi mỗi ngày (by design)

---

## 🔮 Kết Luận

Bot này kết hợp:
- ✅ **Tính thần bí** của bói toán
- ✅ **Tính khoa học** của deterministic algorithm
- ✅ **Tính cá nhân** hóa cao
- ✅ **Nội dung phong phú** (200+ advices)

Tạo ra trải nghiệm **độc đáo, nhất quán và đáng tin cậy** cho user! 🎉
