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

### First-time GitHub Pages setup

Если первый запуск workflow падает на шаге `Configure GitHub Pages` с ошибкой вида `Get Pages site failed`, это означает, что GitHub Pages ещё не включён для репозитория.

Сделайте один из двух вариантов:

1. Вручную:

   - открыть `Settings -> Pages`
   - в блоке `Build and deployment`
   - в поле `Source` выбрать `GitHub Actions`
   - сохранить настройки
   - заново запустить workflow

2. Автоматически:

   - создать secret `PAGES_ENABLEMENT_TOKEN`
   - токен должен быть не `GITHUB_TOKEN`
   - для `Personal Access Token` нужны права `repo` или Pages write
   - для GitHub App нужны `administration:write` и `pages:write`

Если Pages уже включён и source выставлен в `GitHub Actions`, workflow должен проходить без дополнительных действий.
