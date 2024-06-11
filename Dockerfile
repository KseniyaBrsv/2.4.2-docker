FROM node:20.10-alpine

WORKDIR /app

COPY . .
RUN npm install

CMD ["npm", "start"]