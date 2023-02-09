FROM --platform=linux/x86-64 node:18.14-alpine AS deps

RUN apk add --no-cache libc6-compat git
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Rebuild the source code only when needed
FROM --platform=linux/x86-64 node:18.14-alpine AS builder

COPY src ./src
COPY public ./public
COPY .env .env.local next.config.js package.json tsconfig.json ./
COPY --from=deps node_modules ./node_modules
RUN npm run build

FROM --platform=linux/x86-64 node:18.14-alpine AS runner
COPY --from=builder node_modules ./node_modules
COPY --from=builder .next ./.next

COPY --from=builder .env .env.local next.config.js package.json ./

CMD ["npm", "start"]