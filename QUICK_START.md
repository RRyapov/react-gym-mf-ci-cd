# 🚀 Быстрый старт: Настройка CI/CD

## Шаг 1: Изучите теорию

Прочитайте **CI_CD_GUIDE.md** - там подробно объяснены все концепции.

## Шаг 2: Проверьте Docker локально

### Установите Docker Desktop
- Windows: https://www.docker.com/products/docker-desktop
- После установки запустите Docker Desktop

### Протестируйте сборку образа

```bash
# Убедитесь, что вы находитесь в корневой директории проекта
# (там, где находится Dockerfile)

# Соберите Docker-образ
docker build -t react-gym-mf-programs:test .

# Запустите контейнер
docker run -d -p 3001:80 --name test-programs react-gym-mf-programs:test

# Откройте в браузере: http://localhost:3001

# Остановите и удалите тестовый контейнер
docker stop test-programs
docker rm test-programs
```

## Шаг 3: Настройте GitHub Actions

### 3.1. Создайте репозиторий на GitHub

Если еще нет:
1. Создайте новый репозиторий на GitHub
2. Загрузите код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 3.2. Проверьте файлы пайплайнов

Файлы уже созданы:
- `.github/workflows/ci.yml` - первичный пайплайн
- `.github/workflows/cd.yml` - генеральный пайплайн

### 3.3. Настройте секреты (если нужны)

Если планируете развертывание на сервер:

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте секреты:
   - `SERVER_HOST` - адрес сервера
   - `SERVER_USER` - пользователь для SSH
   - `SSH_PRIVATE_KEY` - приватный SSH ключ

**Для начала секреты не нужны** - пайплайны будут работать без них.

## Шаг 4: Протестируйте CI/CD

### 4.1. Создайте тестовый Pull Request

```bash
# Создайте новую ветку
git checkout -b test-ci-cd

# Внесите небольшое изменение (например, добавьте комментарий)
# В любом файле

# Закоммитьте и запушьте
git add .
git commit -m "test: testing CI pipeline"
git push origin test-ci-cd
```

### 4.2. Создайте Pull Request на GitHub

1. Перейдите на GitHub
2. Создайте Pull Request из ветки `test-ci-cd` в `main`
3. Перейдите на вкладку "Actions"
4. Увидите запущенный пайплайн "CI - Quick Checks"

### 4.3. Проверьте результаты

- ✅ Зеленая галочка = все проверки прошли
- ❌ Красный крестик = есть ошибки (смотрите логи)

## Шаг 5: Настройте CD (развертывание)

### 5.1. После merge в main

После того, как PR будет смержен в `main`:
1. Автоматически запустится пайплайн "CD - Full Pipeline"
2. Он создаст Docker-образы
3. Опубликует их в GitHub Container Registry

### 5.2. Просмотр образов

1. Перейдите на GitHub
2. Справа от репозитория нажмите "Packages"
3. Увидите созданный образ:
   - `react-gym-mf-programs`

### 5.3. Использование образов

```bash
# Скачать образ
docker pull ghcr.io/YOUR_USERNAME/react-gym-mf-programs:latest

# Запустить
docker run -p 3001:80 ghcr.io/YOUR_USERNAME/react-gym-mf-programs:latest
```

## Шаг 6: Настройте развертывание (опционально)

Если у вас есть сервер для развертывания:

1. Раскомментируйте секцию `deploy` в `.github/workflows/cd.yml`
2. Добавьте секреты в GitHub (см. Шаг 3.3)
3. Настройте команды развертывания под вашу инфраструктуру

## 📋 Чеклист готовности

- [ ] Docker установлен и работает
- [ ] Локальная сборка Docker-образа успешна
- [ ] Код загружен в GitHub
- [ ] Создан тестовый PR
- [ ] CI пайплайн проходит успешно
- [ ] После merge CD пайплайн создает образы
- [ ] Образы доступны в GitHub Container Registry

## 🆘 Проблемы и решения

### Проблема: "Workflow not found"

**Решение:** Убедитесь, что файлы находятся в `.github/workflows/` и закоммичены.

### Проблема: "npm ci failed"

**Решение:** 
- Проверьте, что `package-lock.json` существует
- Запустите `npm install` локально и закоммитьте `package-lock.json`

### Проблема: "Docker build failed"

**Решение:**
- Проверьте Dockerfile на ошибки
- Убедитесь, что все пути правильные
- Попробуйте собрать локально: `docker build -t test .`

### Проблема: "Permission denied" при push образа

**Решение:**
- Убедитесь, что используется `GITHUB_TOKEN` (автоматически доступен)
- Проверьте permissions в workflow файле

## 📚 Дополнительные материалы

- **CI_CD_GUIDE.md** - полное руководство по CI/CD
- **DOCKER_GUIDE.md** - практическое руководство по Docker
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)

## 🎉 Готово!

Теперь у вас настроен полноценный CI/CD! Каждый раз при создании PR будут запускаться проверки, а после merge - создаваться Docker-образы.

**Следующие шаги:**
1. Добавьте тесты (Jest)
2. Настройте автоматическое развертывание
3. Добавьте уведомления (Slack, email)
4. Настройте мониторинг

Удачи! 🚀

