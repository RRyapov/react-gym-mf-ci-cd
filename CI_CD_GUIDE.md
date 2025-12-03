# Полное руководство по CI/CD для фронтенд-разработчика

## 📚 Содержание

1. [Что такое CI/CD?](#1-что-такое-cicd)
2. [Как работает процесс CI/CD](#2-как-работает-процесс-cicd)
3. [Docker-контейнеры: что это и зачем](#3-docker-контейнеры-что-это-и-зачем)
4. [Создание Docker-контейнера для вашего проекта](#4-создание-docker-контейнера-для-вашего-проекта)
5. [Требования для корректной работы CI/CD](#5-требования-для-корректной-работы-cicd)
6. [Где прописывать содержимое проверок пайплайна](#6-где-прописывать-содержимое-проверок-пайплайна)
7. [Первичные vs Генеральные пайплайны](#7-первичные-vs-генеральные-пайплайны)

---

## 1. Что такое CI/CD?

### CI (Continuous Integration) - Непрерывная интеграция

**CI** - это практика автоматического объединения кода от разных разработчиков в общий репозиторий и автоматического запуска проверок.

**Основные задачи CI:**
- ✅ Автоматическая проверка кода при каждом коммите
- ✅ Запуск тестов (unit, integration, e2e)
- ✅ Проверка качества кода (линтинг, форматирование)
- ✅ Проверка типов (TypeScript)
- ✅ Сборка проекта

**Когда запускается:** При каждом push в репозиторий (в ветку или при создании Pull Request)

### CD (Continuous Deployment/Delivery) - Непрерывное развертывание

**CD** - это автоматическое развертывание приложения после успешного прохождения всех проверок CI.

**Continuous Delivery (Непрерывная доставка):**
- Код готов к развертыванию, но требует ручного подтверждения

**Continuous Deployment (Непрерывное развертывание):**
- Код автоматически развертывается в продакшн после успешных проверок

**Основные задачи CD:**
- 🚀 Сборка production-версии приложения
- 🐳 Создание Docker-образа
- 📦 Публикация образа в реестр (Docker Hub, GitHub Container Registry)
- 🌐 Развертывание на сервер (staging/production)

---

## 2. Как работает процесс CI/CD

### Полный цикл CI/CD:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. РАЗРАБОТЧИК ДЕЛАЕТ ИЗМЕНЕНИЯ                              │
│    git add . && git commit -m "feat: new feature"           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. PUSH В РЕПОЗИТОРИЙ                                        │
│    git push origin feature-branch                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CI/CD СИСТЕМА ОБНАРУЖИВАЕТ ИЗМЕНЕНИЯ                     │
│    (GitHub Actions, GitLab CI, Jenkins и т.д.)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CI ЭТАП (Continuous Integration)                          │
│    ├─ Проверка синтаксиса (ESLint)                          │
│    ├─ Проверка форматирования (Prettier)                    │
│    ├─ Проверка типов (TypeScript)                           │
│    ├─ Запуск тестов (Jest)                                  │
│    └─ Сборка проекта (npm run build)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
              ┌────────┴────────┐
              │  ВСЕ ПРОВЕРКИ   │
              │   ПРОЙДЕНЫ?     │
              └────────┬────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
         ДА                        НЕТ
          │                         │
          ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ 5. CD ЭТАП       │      │ ОТКЛОНЕНИЕ       │
│ (Deployment)     │      │ Уведомление      │
│                  │      │ разработчику     │
│ ├─ Создание      │      └──────────────────┘
│ │  Docker-образа │
│ ├─ Публикация    │
│ │  в реестр      │
│ └─ Развертывание │
│    на сервер     │
└──────────────────┘
```

### Детальное описание этапов:

#### Этап 1: Trigger (Триггер)
**Когда запускается пайплайн:**
- Push в любую ветку
- Создание Pull Request
- Создание тега (для релиза)
- Ручной запуск (manual trigger)

#### Этап 2: Checkout (Получение кода)
```yaml
- uses: actions/checkout@v3
```
Клонирует репозиторий в виртуальную машину CI/CD

#### Этап 3: Setup (Настройка окружения)
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
```
Устанавливает необходимые инструменты (Node.js, npm, и т.д.)

#### Этап 4: Install Dependencies (Установка зависимостей)
```bash
npm ci  # или npm install
```
Устанавливает все зависимости из `package.json`

#### Этап 5: Lint & Type Check (Проверка кода)
```bash
npm run lint        # ESLint проверка
npm run typeCheck   # TypeScript проверка
```

#### Этап 6: Tests (Тесты)
```bash
npm test
```
Запускает все тесты

#### Этап 7: Build (Сборка)
```bash
npm run build.prod
```
Создает production-версию приложения

#### Этап 8: Docker Build (Создание образа)
```bash
docker build -t my-app:latest .
```
Создает Docker-образ из Dockerfile

#### Этап 9: Push to Registry (Публикация)
```bash
docker push my-app:latest
```
Отправляет образ в Docker Registry

#### Этап 10: Deploy (Развертывание)
Развертывает приложение на сервер (staging/production)

---

## 3. Docker-контейнеры: что это и зачем

### Что такое Docker?

**Docker** - это платформа для контейнеризации приложений. Контейнер - это изолированная среда, которая содержит все необходимое для запуска приложения.

### Аналогия с реальным миром:

**Без Docker:**
```
Разработчик: "У меня работает!"
Тестировщик: "У меня не работает!"
Продакшн: "У меня тоже не работает!"
```

**С Docker:**
```
Разработчик: "У меня работает в контейнере!"
Тестировщик: "У меня работает в том же контейнере!"
Продакшн: "У меня работает в том же контейнере!"
```

### Основные концепции Docker:

#### 1. **Image (Образ)**
- Шаблон для создания контейнеров
- Неизменяемый (immutable)
- Содержит ОС, зависимости, код приложения
- Пример: `node:18-alpine`, `nginx:latest`

#### 2. **Container (Контейнер)**
- Запущенный экземпляр образа
- Изолированная среда выполнения
- Легковесный (использует ядро хоста)

#### 3. **Dockerfile**
- Инструкции для создания образа
- Пошаговое описание сборки

#### 4. **Docker Registry**
- Хранилище образов (Docker Hub, GitHub Container Registry)
- Позволяет делиться образами

### Преимущества Docker:

✅ **Консистентность:** Одинаковая среда везде  
✅ **Изоляция:** Приложения не конфликтуют  
✅ **Портативность:** Работает на любой системе с Docker  
✅ **Масштабируемость:** Легко запустить несколько экземпляров  
✅ **Версионирование:** Можно откатиться к любой версии образа  

### Структура Dockerfile:

```dockerfile
# 1. Базовый образ (Base Image)
FROM node:18-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Копирование файлов зависимостей
COPY package*.json ./

# 4. Установка зависимостей
RUN npm ci --only=production

# 5. Копирование исходного кода
COPY . .

# 6. Сборка приложения
RUN npm run build.prod

# 7. Команда запуска
CMD ["npm", "start"]
```

---

## 4. Создание Docker-контейнера для вашего проекта

### Для фронтенд-приложения (React + Webpack)

Ваш проект - это статический сайт после сборки. Есть два подхода:

#### Подход 1: Multi-stage build (Рекомендуется)

**Этапы:**
1. **Builder stage** - сборка приложения
2. **Production stage** - только собранные файлы + веб-сервер

**Преимущества:**
- Маленький финальный образ
- Безопасность (нет dev-зависимостей)
- Быстрая загрузка

#### Подход 2: Single-stage build

Проще, но образ больше

### Пример Dockerfile для вашего проекта:

См. файл `Dockerfile` в корне проекта

### Как работает сборка:

```bash
# 1. Сборка образа (из корневой директории)
docker build -t react-gym-mf-programs:latest .

# 2. Запуск контейнера
docker run -p 3001:80 react-gym-mf-programs:latest

# 3. Проверка
curl http://localhost:3001
```

---

## 5. Требования для корректной работы CI/CD

### 5.1. Структура проекта

```
project/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI пайплайн
│       └── cd.yml          # CD пайплайн
├── Dockerfile              # Docker-образ для микрофронтенда
├── .dockerignore           # Исключения для Docker
├── package.json
├── src/
└── docker-compose.yml
```

### 5.2. Настройки в package.json

**Обязательные скрипты:**
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "typeCheck": "tsc --noEmit",
    "test": "jest",
    "build": "webpack",
    "build.prod": "webpack --env mode=production"
  }
}
```

### 5.3. Конфигурационные файлы

**ESLint:** `.eslintrc.js` или `.eslintrc.json`  
**TypeScript:** `tsconfig.json`  
**Prettier:** `.prettierrc` (опционально)  
**Jest:** `jest.config.js` (если есть тесты)

### 5.4. Переменные окружения

**Секреты в CI/CD системе:**
- `DOCKER_USERNAME` - логин Docker Hub
- `DOCKER_PASSWORD` - пароль Docker Hub
- `DEPLOY_KEY` - SSH ключ для развертывания
- `API_URL` - URL API (если нужен)

**Где хранить:**
- GitHub: Settings → Secrets and variables → Actions
- GitLab: Settings → CI/CD → Variables

### 5.5. Docker Registry

**Варианты:**
1. **Docker Hub** (docker.io) - бесплатный, публичный
2. **GitHub Container Registry** (ghcr.io) - бесплатный, приватный
3. **GitLab Container Registry** - встроен в GitLab
4. **AWS ECR, Google GCR** - платные, для enterprise

### 5.6. Правила именования

**Docker образы:**
```
registry/username/image-name:tag
```

Примеры:
- `docker.io/myuser/react-gym-mf-programs:v1.0.0`
- `ghcr.io/myuser/react-gym-mf-programs:latest`
- `ghcr.io/myuser/react-gym-mf-programs:main-abc1234` (по коммиту)

---

## 6. Где прописывать содержимое проверок пайплайна

### 6.1. GitHub Actions

**Расположение:** `.github/workflows/`

**Структура:**
```
.github/
└── workflows/
    ├── ci.yml           # CI пайплайн
    ├── cd.yml           # CD пайплайн
    └── release.yml      # Релизный пайплайн
```

**Пример структуры файла:**
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run typeCheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build.prod
```

### 6.2. GitLab CI

**Расположение:** `.gitlab-ci.yml` (в корне проекта)

**Пример:**
```yaml
stages:
  - lint
  - type-check
  - build
  - test

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

type-check:
  stage: type-check
  script:
    - npm ci
    - npm run typeCheck

build:
  stage: build
  script:
    - npm ci
    - npm run build.prod
```

### 6.3. Jenkins

**Расположение:** Jenkinsfile (в корне проекта или в репозитории Jenkins)

### 6.4. Структура проверок

**Типичный CI пайплайн включает:**

1. **Lint** - проверка стиля кода
2. **Type Check** - проверка типов TypeScript
3. **Tests** - запуск тестов
4. **Build** - сборка проекта
5. **Security Scan** - проверка безопасности (опционально)

**Каждая проверка = отдельный job/step**

---

## 7. Первичные vs Генеральные пайплайны

### 7.1. Первичные пайплайны (Primary/CI Pipelines)

**Назначение:** Быстрые проверки перед merge

**Когда запускаются:**
- При создании Pull Request
- При push в feature-ветку
- При каждом коммите

**Что проверяют:**
- ✅ Линтинг (ESLint)
- ✅ Проверка типов (TypeScript)
- ✅ Базовые тесты (unit tests)
- ✅ Сборка (build)

**Характеристики:**
- ⚡ Быстрые (2-5 минут)
- 💰 Дешевые (меньше ресурсов)
- 🔄 Частые запуски

**Пример:**
```yaml
name: CI - Quick Checks

on:
  pull_request:
    branches: [ main ]

jobs:
  quick-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run typeCheck
      - run: npm run build
```

### 7.2. Генеральные пайплайны (General/Full Pipelines)

**Назначение:** Полная проверка и развертывание

**Когда запускаются:**
- После merge в main
- При создании тега (release)
- Ручной запуск

**Что проверяют:**
- ✅ Все проверки из первичного пайплайна
- ✅ Полный набор тестов (unit + integration + e2e)
- ✅ Сборка production-версии
- ✅ Создание Docker-образа
- ✅ Публикация в registry
- ✅ Развертывание на staging/production
- ✅ Smoke tests после деплоя

**Характеристики:**
- 🐢 Медленнее (10-30 минут)
- 💰 Дороже (больше ресурсов)
- 🎯 Реже запускаются

**Пример:**
```yaml
name: CD - Full Pipeline

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Ручной запуск

jobs:
  # Все проверки из CI
  ci-checks:
    # ... (lint, type-check, tests, build)

  # Создание Docker-образа
  docker-build:
    needs: ci-checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t my-app:${{ github.sha }} .
      - name: Push to registry
        run: docker push my-app:${{ github.sha }}

  # Развертывание
  deploy:
    needs: docker-build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Команды развертывания
```

### 7.3. Сравнительная таблица

| Характеристика | Первичные пайплайны | Генеральные пайплайны |
|----------------|---------------------|----------------------|
| **Триггер** | PR, каждый коммит | Merge в main, релиз |
| **Скорость** | Быстро (2-5 мин) | Медленно (10-30 мин) |
| **Проверки** | Базовые | Полные |
| **Docker** | Нет | Да |
| **Deploy** | Нет | Да |
| **Цель** | Блокировать плохой код | Развернуть хороший код |

### 7.4. Стратегия использования

**Рекомендуемый подход:**

1. **Первичный пайплайн** запускается на каждый PR
   - Если не проходит → PR не мержится
   - Если проходит → можно мержить

2. **Генеральный пайплайн** запускается после merge
   - Создает Docker-образ
   - Развертывает на staging
   - После проверки → развертывает на production

### 7.5. Пример полной настройки

См. файлы:
- `.github/workflows/ci.yml` - первичный пайплайн
- `.github/workflows/cd.yml` - генеральный пайплайн

---

## 🎯 Практические советы

### 1. Начните с простого
- Сначала настройте только CI (проверки)
- Потом добавьте Docker
- В конце добавьте CD (развертывание)

### 2. Используйте кеширование
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 3. Параллельные jobs
Запускайте независимые проверки параллельно для скорости

### 4. Условные запуски
```yaml
if: github.event_name == 'pull_request'
```

### 5. Матричные сборки
Тестируйте на разных версиях Node.js

---

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)

---

## ❓ Часто задаваемые вопросы

**Q: Нужен ли Docker для CI/CD?**  
A: Не обязательно для CI, но очень полезен для CD и консистентности окружений.

**Q: Можно ли использовать без Docker Registry?**  
A: Да, можно развертывать напрямую, но Docker Registry упрощает управление версиями.

**Q: Как часто запускать пайплайны?**  
A: CI - на каждый коммит, CD - после merge в main.

**Q: Что делать, если пайплайн упал?**  
A: Проверить логи, исправить ошибки, запустить снова.

---

**Удачи в настройке CI/CD! 🚀**

