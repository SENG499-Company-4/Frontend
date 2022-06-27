FROM node:lts-alpine
WORKDIR app
COPY package*.json ./
RUN npm install --omit-dev
COPY ./public ./public
COPY ./src ./src
RUN npm run build
RUN npm install -g serve
CMD serve -s build