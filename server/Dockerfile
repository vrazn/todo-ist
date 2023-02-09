FROM --platform=linux/x86-64 node:18.14-alpine AS deps

RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Rebuild the source code only when needed
FROM --platform=linux/x86-64 node:18.14-alpine AS builder

RUN npm install -g @nestjs/cli
COPY src ./src
COPY nest-cli.json package.json tsconfig.build.json tsconfig.json .env ./
COPY --from=deps node_modules ./node_modules
RUN npm run build

FROM --platform=linux/x86-64 node:18.14-alpine AS runner
COPY --from=builder package.json ./
COPY --from=builder node_modules ./node_modules
COPY --from=builder dist ./dist
COPY --from=builder .env ./

CMD ["npm", "run", "start:prod"]