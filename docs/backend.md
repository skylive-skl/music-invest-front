# 🎵 Music Invest Backend

Бэкенд платформы для музыкального краудфандинга и разделения доходов.  
Артисты создают проекты для привлечения инвестиций, а инвесторы получают долю от выручки пропорционально вложениям.

**Стек:** NestJS · Prisma · PostgreSQL · AWS S3 · JWT

---

## 🚀 Быстрый старт

### Требования

- Node.js >= 18
- PostgreSQL
- AWS S3-совместимое хранилище (или MinIO для локальной разработки)

### Установка

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать файл окружения и заполнить переменные
cp .env.example .env

# 3. Синхронизировать схему с базой данных
npx prisma db push

# 4. Запустить приложение в режиме разработки
npm run start:dev

# 5. Собрать приложение
npm run build

# 6. Запустить приложение в режиме production
npm run start:prod
```

### Переменные окружения (`.env`)

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `JWT_SECRET` | Секрет для подписи JWT-токенов |
| `AWS_ACCESS_KEY_ID` | AWS / S3-совместимый Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS / S3-совместимый Secret Key |
| `AWS_REGION` | Регион S3 (например, `eu-central-1`) |
| `AWS_S3_BUCKET` | Название S3-бакета |
| `AWS_S3_ENDPOINT` | Кастомный endpoint (для MinIO и пр.) |

---

## 📐 Схема базы данных

```
┌──────────────────────────────────────────────────────────────────┐
│  User                                                            │
│  id · email · passwordHash · role(USER|ARTIST|ADMIN) · balance  │
└────────┬───────────────────────────────────────────────────┬─────┘
         │ 1:N                                               │ 1:N
         ▼                                                   ▼
┌────────────────────┐                         ┌────────────────────┐
│  Project           │                         │  Album             │
│  id · title        │                         │  id · title        │
│  description       │                         │  coverImageUrl     │
│  fundingGoal       │                         │  releaseDate       │
│  currentFunding    │                         │  artistId          │
│  revenueShare%     │                         └────────┬───────────┘
│  durationMonths    │                                  │ 1:N
│  coverImageUrl     │                                  ▼
│  status            │                         ┌────────────────────┐
└────────┬───────────┘                         │  Track             │
         │                                     │  id · title        │
    ┌────┴──────────────────┐                  │  audioUrl          │
    │                       │                  │  duration (sec)    │
    ▼                       ▼                  │  albumId           │
┌──────────────┐  ┌──────────────────┐        │  artistId          │
│  Investment  │  │  MediaAttachment │        └────────────────────┘
│  userId      │  │  url · filename  │
│  amount      │  │  type(AUDIO|VIDEO│
│  sharePercent│  └──────────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────────┐      ┌──────────┐      ┌────────────┐
│  RevenueReport   │─1:N─▶│  Payout  │      │ Withdrawal │
│  amount          │      │  userId  │      │ userId     │
│  periodStart/End │      │  amount  │      │ amount     │
└──────────────────┘      └──────────┘      │ status     │
                                            └────────────┘
```

### Модели

| Модель | Описание |
|---|---|
| `User` | Пользователь системы. Роли: `USER`, `ARTIST`, `ADMIN` |
| `Project` | Музыкальный краудфандинг-проект, созданный артистом |
| `MediaAttachment` | Аудио/видео-вложение к проекту |
| `Investment` | Инвестиция пользователя в проект |
| `RevenueReport` | Отчёт о выручке, поданный артистом |
| `Payout` | Автоматически рассчитанная выплата инвестору |
| `Withdrawal` | Запрос на вывод средств с баланса |
| `Album` | Музыкальный альбом (или сингл) артиста |
| `Track` | Трек, привязанный к альбому. Хранит URL аудио и длительность |

---

## 🔌 REST API

Полная интерактивная документация доступна после запуска приложения:  
**`http://localhost:3000/api`** (Swagger UI)

---

### 🔑 Auth — `/auth`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/auth/register` | Публичный | Регистрация нового пользователя |
| `POST` | `/auth/login` | Публичный | Вход, получение JWT-токена |

**Тело запроса `/auth/register`:**

```json
{
  "email": "artist@example.com",
  "password": "password123",
  "role": "ARTIST"
}
```

---

### 👤 Users — `/users`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/users` | Публичный | Список всех пользователей |
| `GET` | `/users/me` | 🔐 Любой | Профиль текущего пользователя |
| `GET` | `/users/wallet` | 🔐 Любой | Баланс кошелька |

---

### 🎼 Projects — `/projects`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/projects` | 🔐 ARTIST, ADMIN | Создать новый проект |
| `GET` | `/projects` | Публичный | Список всех проектов |
| `GET` | `/projects?artistId=<uuid>` | Публичный | Только проекты конкретного артиста |
| `GET` | `/projects/:id` | Публичный | Детали проекта по ID |
| `POST` | `/projects/:id/cover` | 🔐 ARTIST, ADMIN | Загрузить обложку проекта |
| `POST` | `/projects/:id/media` | 🔐 ARTIST, ADMIN | Загрузить медиафайлы проекта |

**Тело запроса `POST /projects`:**

```json
{
  "title": "My New Album Fund",
  "description": "Help me record my debut album",
  "fundingGoal": 50000,
  "revenueSharePercent": 20,
  "durationMonths": 12
}
```

---

### 💿 Albums — `/albums`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/albums` | 🔐 ARTIST, ADMIN | Создать новый альбом |
| `GET` | `/albums` | Публичный | Список всех альбомов |
| `GET` | `/albums/:id` | Публичный | Альбом с треками по ID |
| `POST` | `/albums/:id/cover` | 🔐 ARTIST, ADMIN | Загрузить обложку альбома |

**Тело запроса `POST /albums`:**

```json
{
  "title": "Nevermind",
  "releaseDate": "1991-09-24"
}
```

---

### 🎵 Tracks — `/tracks`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/tracks` | 🔐 ARTIST, ADMIN | Создать метаданные трека |
| `GET` | `/tracks` | Публичный | Список всех треков |
| `GET` | `/tracks/:id` | Публичный | Трек по ID |
| `POST` | `/tracks/:id/audio` | 🔐 ARTIST, ADMIN | Загрузить аудиофайл трека |

> При загрузке аудио (`POST /tracks/:id/audio`) бэкенд **автоматически** определяет длительность трека из метаданных файла.  
> Разрешённые форматы: `audio/mpeg` (MP3), `audio/wav`, `audio/flac`, `audio/aac`, `audio/ogg`.

**Тело запроса `POST /tracks`:**

```json
{
  "title": "Smells Like Teen Spirit",
  "albumId": "uuid-of-the-album"
}
```

---

### 🔍 Search — `/search`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/search?q=...` | Публичный | Глобальный поиск по всем сущностям |

**Параметры запроса:**

| Параметр | Тип | Обязательный | Описание |
|---|---|---|---|
| `q` | `string` | ✅ | Поисковый запрос (минимум 2 символа) |
| `type` | `string` | ❌ | Фильтр типов через запятую. Допустимые значения: `track`, `album`, `artist`, `project`. По умолчанию — все типы |

**Примеры:**
```
GET /search?q=nirvana
GET /search?q=nirvana&type=track,album
GET /search?q=kurt&type=artist
```

**Ответ:**
```json
{
  "tracks":   [...],
  "albums":   [...],
  "artists":  [...],
  "projects": [...]
}
```

> Поиск регистронезависимый. Каждый тип возвращает максимум **20** результатов.

---

### 💰 Investments — `/investments`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/investments` | 🔐 Любой | Инвестировать в проект |
| `GET` | `/investments/my-investments` | 🔐 Любой | Мои инвестиции |

**Тело запроса `POST /investments`:**

```json
{
  "projectId": "uuid-of-project",
  "amount": 5000
}
```

---

### 💸 Payouts — `/payouts`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/payouts/revenue` | 🔐 ARTIST, ADMIN | Подать отчёт о выручке |
| `GET` | `/payouts/history` | 🔐 Любой | История выплат |

> После подачи отчёта о выручке система **автоматически рассчитывает и начисляет выплаты** всем инвесторам проекта пропорционально их доле.

---


## 🏗️ Архитектура проекта

```
src/
├── common/
│   ├── config/           # multer.config.ts — настройки загрузки файлов
│   ├── decorators/       # @Roles()
│   └── guards/           # JwtAuthGuard, RolesGuard
├── prisma/               # PrismaService, PrismaModule
└── modules/
    ├── auth/             # Регистрация, вход, JWT
    ├── user/             # Профиль, кошелёк
    ├── project/          # Краудфандинг-проекты
    ├── investment/       # Инвестиции в проекты
    ├── payout/           # Отчёты о выручке и выплаты
    ├── album/            # Альбомы артиста
    ├── track/            # Треки артиста
    ├── s3/               # Сервис для работы с AWS S3
```

---

## 🔐 Авторизация

Большинство мутирующих эндпоинтов требуют JWT-токен в заголовке:

```
Authorization: Bearer <token>
```

Токен выдаётся при успешном входе через `POST /auth/login`.

### Роли

| Роль | Возможности |
|---|---|
| `USER` | Просмотр контента, инвестирование |
| `ARTIST` | Всё из USER + создание проектов, альбомов, треков; загрузка файлов; подача отчётов о выручке |
| `ADMIN` | Полный доступ ко всем эндпоинтам |

---

## 📦 Типичный сценарий (артист)

```
1. POST /auth/register          → зарегистрироваться как ARTIST
2. POST /auth/login             → получить JWT-токен
3. POST /projects               → создать краудфандинг-проект
4. POST /projects/:id/cover     → загрузить обложку проекта
5. POST /albums                 → создать альбом (например, сингл)
6. POST /albums/:id/cover       → загрузить обложку альбома
7. POST /tracks                 → создать трек (с albumId)
8. POST /tracks/:id/audio       → загрузить аудиофайл (.mp3 / .wav)
9. POST /payouts/revenue        → подать отчёт о выручке (выплаты рассчитываются автоматически)
```
