FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
RUN npm install -g serve
CMD serve -s build