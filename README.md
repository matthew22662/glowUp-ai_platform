# GlowUp AI с голосом ElevenLabs

В проект добавлены:

- голос ElevenLabs для реплик помощников;
- автоматическое озвучивание успеха и неудачи;
- анимация разговора и синхронизация движения рта с воспроизведением звука;
- разные `voice_id` для пяти помощников;
- безопасное хранение API-ключа на сервере;
- браузерный голос как резервный вариант;
- готовый Dockerfile и docker-compose.

## Запуск через Docker Compose

1. Скопируйте `.env.example` в `.env`.
2. Вставьте API-ключ ElevenLabs:

```env
ELEVENLABS_API_KEY=ваш_ключ
```

3. Запустите:

```bash
docker compose up --build
```

4. Откройте:

```text
http://localhost:8080
```

## Запуск командой Docker

```bash
docker build -t glowup-ai .
docker run --rm -p 8080:3000 \
  -e ELEVENLABS_API_KEY="ваш_ключ" \
  glowup-ai
```

## Почему ключ не вставлен в браузер

API-ключ нельзя хранить в `app.js`: его сможет увидеть любой посетитель.
Поэтому запрос к ElevenLabs идёт через сервер `server.js`.

## Голоса персонажей

Можно назначить отдельные `voice_id`:

```env
ELEVENLABS_VOICE_ALEX=
ELEVENLABS_VOICE_MIRA=
ELEVENLABS_VOICE_LUMI=
ELEVENLABS_VOICE_LEO=
ELEVENLABS_VOICE_NOVA=
```

Без этих значений все помощники используют `ELEVENLABS_VOICE_ID`.
