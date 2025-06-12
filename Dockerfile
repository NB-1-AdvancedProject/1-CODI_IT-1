# 빌드 스테이지
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION} AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build


# 실행 스테이지
FROM node:${NODE_VERSION}
WORKDIR /app
COPY --from=builder /build/.env ./
COPY --from=builder /build/jest.config.js ./
COPY --from=builder /build/package-lock.json ./
COPY --from=builder /build/package.json ./
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/node_modules ./node_modules

ENV SERVER_PORT=3000

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npm run prisma:deploy && npm run start"]