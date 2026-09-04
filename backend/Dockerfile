FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ARG BUILD_TIME=now
ENV BUILD_TIME=${BUILD_TIME}

EXPOSE 3000

CMD ["node", "--dns-result-order=ipv4first", "dist/main"]
