# Music Invest Frontend

Фронтенд платформы для музыкального краудинвестинга на React, TypeScript и Vite.

## Локальная разработка

Требования:

- Node.js 20+
- npm 10+

Установка и запуск:

```bash
npm ci
cp .env.example .env
npm run dev
```

Переменные окружения:

- `VITE_API_BASE_URL` — базовый URL backend API

Пример:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Production Docker

Для production используется multi-stage сборка:

1. На стадии `builder` приложение собирается через `npm run build`.
2. На стадии `runner` Nginx раздает содержимое `dist`.
3. Для клиентского роутинга включен SPA fallback через `try_files ... /index.html`.

### Сборка образа

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:3000 \
  -t music-invest-front:latest \
  .
```

Важно: `VITE_API_BASE_URL` встраивается в приложение на этапе сборки образа. Если backend URL изменится, образ нужно пересобрать.

### Сборка и запуск через Docker Compose (.env)

Файл `docker-compose.yml` берет `VITE_API_BASE_URL` из `.env` и автоматически передает его в `build.args`.

```bash
docker compose up -d --build
```

Проверить запущенный сервис:

```bash
docker compose ps
docker compose logs -f frontend
```

Остановить и удалить контейнер:

```bash
docker compose down
```

### Запуск контейнера

```bash
docker run --rm -d -p 80:80 music-invest-front:latest
```

После запуска приложение будет доступно на `http://localhost`.

### Добавленные файлы

- `Dockerfile` — multi-stage production build
- `nginx.conf` — конфиг Nginx со SPA fallback
- `.dockerignore` — уменьшает build context и ускоряет сборку
- `docker-compose.yml` — запуск с подстановкой `VITE_API_BASE_URL` из `.env`

## Почему не vite preview

`vite preview` подходит для проверки собранного приложения, но не является production web server. Для продового запуска здесь используется Nginx, потому что он лучше подходит для раздачи статических файлов и корректно обрабатывает прямые переходы по SPA-маршрутам.
