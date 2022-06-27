FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit-dev
COPY . .
RUN npm install -g serve
CMD serve -s build