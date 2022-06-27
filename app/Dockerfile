FROM node:lts-alpine
COPY package*.json ./
RUN npm install --omit-dev
COPY ./app/public public/
COPY ./app/src src/
RUN npm run build
RUN npm install -g serve
CMD serve -s build