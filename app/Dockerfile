FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --omit-dev
COPY . .
RUN npm install -g serve
CMD serve -s build