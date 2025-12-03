# Практическое руководство по Docker для вашего проекта

## 🚀 Быстрый старт

### 1. Установка Docker

**Windows:**
1. Скачайте [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Установите и запустите
3. Проверьте: `docker --version`

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 2. Сборка образа

```bash
# Убедитесь, что вы в корневой директории проекта (где находится Dockerfile)

# Соберите образ
docker build -t react-gym-mf-programs:latest .

# Проверьте, что образ создан
docker images
```

### 3. Запуск контейнера

```bash
# Запуск контейнера
docker run -d -p 3001:80 --name programs react-gym-mf-programs:latest

# Проверка работы
curl http://localhost:3001
# или откройте в браузере: http://localhost:3001
```

### 4. Просмотр логов

```bash
docker logs programs
docker logs -f programs  # следовать за логами
```

### 5. Остановка и удаление

```bash
# Остановка
docker stop programs

# Удаление контейнера
docker rm programs

# Удаление образа
docker rmi react-gym-mf-programs:latest
```

## 📦 Использование Docker Compose

### Запуск всех микрофронтендов

```bash
# Из корня проекта
docker-compose up --build

# В фоновом режиме
docker-compose up -d

# Остановка
docker-compose down
```

## 🔍 Полезные команды Docker

### Работа с образами

```bash
# Список образов
docker images

# Удаление образа
docker rmi <image-id>

# Удаление всех неиспользуемых образов
docker image prune -a
```

### Работа с контейнерами

```bash
# Список запущенных контейнеров
docker ps

# Список всех контейнеров (включая остановленные)
docker ps -a

# Остановка контейнера
docker stop <container-id>

# Удаление контейнера
docker rm <container-id>

# Вход в контейнер (для отладки)
docker exec -it <container-id> sh
```

### Просмотр информации

```bash
# Информация о контейнере
docker inspect <container-id>

# Использование ресурсов
docker stats

# Логи контейнера
docker logs <container-id>
```

## 🐛 Отладка

### Проблема: "Port already in use"

```bash
# Найдите процесс, использующий порт
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Остановите контейнер
docker stop <container-id>
```

### Проблема: "Cannot connect to Docker daemon"

Убедитесь, что Docker Desktop запущен.

### Проблема: "Build failed"

```bash
# Соберите с выводом всех логов
docker build --no-cache -t react-gym-mf-programs:latest .

# Проверьте Dockerfile на ошибки
```

## 📚 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

