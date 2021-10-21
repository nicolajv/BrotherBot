# Base
FROM node:latest AS base
WORKDIR /bot
COPY package.json .

# Dependencies
FROM base AS dependencies
COPY tsconfig.json .
COPY .eslintrc.json .
COPY src ./src
RUN npm install --silent

# Build production
FROM dependencies AS production-build
RUN npm run test
RUN npm run build

# Release
FROM base AS release
COPY --from=production-build /bot/node_modules ./node_modules
COPY --from=production-build /bot/dist ./dist
EXPOSE 3000
CMD node dist/infrastructure/server.js

# Local
FROM base AS local
COPY --from=dependencies /bot/node_modules ./node_modules
COPY --from=dependencies /bot/tsconfig.json .
EXPOSE 3000
CMD npm run serve