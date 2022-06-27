FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit-dev
COPY . .
RUN npm install -g serve
ENTRYPOINT ["serve", "-s", "build"]