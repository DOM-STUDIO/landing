# DOM STUDIO landing

Статичный bilingual landing website для DOM STUDIO лежит в папке `website/`.

## Локальный запуск

```bash
python3 -m http.server 8000 --directory website
```

Открыть:

```text
http://localhost:8000
```

Если в окружении доступна только команда `python`, можно использовать:

```bash
python -m http.server 8000 --directory website
```

## Структура

- `website/index.html` — root redirect на язык по умолчанию
- `website/et/index.html` — эстонская версия
- `website/ru/index.html` — русская версия
- `website/assets/` — общие стили, скрипты и изображения

Чтобы сменить язык по умолчанию, достаточно изменить redirect в `website/index.html`.

## Deploy

Автодеплой в GitHub Pages настроен через `.github/workflows/deploy-pages.yml`.
Публикуется только содержимое директории `website/`.
