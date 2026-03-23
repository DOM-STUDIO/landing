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

## Visual QA

Для быстрой визуальной проверки сайта после сборки контейнера можно использовать:

```bash
python3 visual_qa.py
```

По умолчанию скрипт ожидает, что локальный сервер уже запущен на `http://127.0.0.1:8000`, и сохраняет скриншоты и отчёт в:

```text
/tmp/domstudio-qa
```

При необходимости можно переопределить адрес и папку вывода:

```bash
python3 visual_qa.py --base-url http://127.0.0.1:8000 --out-dir /tmp/domstudio-qa
```

## Структура

- `website/index.html` — root redirect на язык по умолчанию
- `website/et/index.html` — эстонская версия
- `website/ru/index.html` — русская версия
- `website/assets/` — общие стили, скрипты и изображения
- `visual_qa.py` — локальный браузерный smoke/visual QA для Chromium + Selenium

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
