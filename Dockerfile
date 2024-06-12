FROM node:20.10-alpine

WORKDIR /app

ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]