FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ .
RUN npm run build

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

EXPOSE 3000

CMD ["node", "--dns-result-order=ipv4first", "dist/main"]
