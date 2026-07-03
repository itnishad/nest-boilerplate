FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma/ prisma/
RUN pnpm install
RUN npx prisma generate

COPY . .

FROM base AS dev
COPY --from=deps /app /app
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["pnpm", "start:dev"]

FROM base AS build
COPY --from=deps /app /app
RUN pnpm build

FROM base AS prod
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/generated ./generated
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/src/main"]
