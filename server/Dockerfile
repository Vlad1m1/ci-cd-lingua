FROM node:18-slim

# Устанавливаем espeak-ng и wait-for-it
RUN apt-get update && apt-get install -y espeak-ng wait-for-it && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Компилируем TypeScript
RUN npm run build

# Открываем порт
EXPOSE 3000

# Команда по умолчанию (переопределяется в docker-compose.yml)
CMD ["npm", "run", "start:prod"]