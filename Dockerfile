FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./frontend ./frontend

EXPOSE 3001

RUN cd frontend && npm ci && npm run build && mv build ../ && cd ../
