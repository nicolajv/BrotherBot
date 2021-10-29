# Base
FROM node:latest AS base
WORKDIR /bot
COPY package.json .
COPY docker-compose.yml .
ARG VERSION=${VERSION:-local}
RUN sed -i 's/"version": ".*"/"version": \"'$VERSION'\"/' package.json

# Dependencies
FROM base AS dependencies
COPY tsconfig.json .
RUN npm install --production --silent
RUN cp -R node_modules prod_node_modules
RUN npm install --silent

# Build production
FROM dependencies AS production-build
COPY src ./src
COPY .eslintrc.json .
RUN npm run test
RUN npm run build

# Release
FROM base AS release
COPY --from=production-build /bot/prod_node_modules ./node_modules
COPY --from=production-build /bot/dist ./dist
COPY --from=production-build /bot/coverage ./coverage
EXPOSE 3000
CMD node dist/infrastructure/server.js

# Local
FROM base AS local
COPY --from=dependencies /bot/node_modules ./node_modules
COPY --from=dependencies /bot/tsconfig.json .
EXPOSE 3000
CMD npm run serve