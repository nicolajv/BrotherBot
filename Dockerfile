# Base
FROM node:latest AS base
WORKDIR /bot
COPY package.json .
ARG VERSION=${VERSION:-local}
RUN sed -i 's/"version": ".*"/"version": \"'$VERSION'\"/' package.json

# Install dependencies
FROM base AS install-dependencies
COPY tsconfig.json .
RUN npm install --production --silent && \
    cp -R node_modules prod_node_modules && \
    npm install --silent

# Build production
FROM install-dependencies AS production-build
COPY src ./src
COPY .eslintrc.json .
RUN npm run test && \
    npm run build

# Export test results
FROM scratch AS test-export
COPY --from=production-build /bot/coverage ./coverage

# Release
FROM base AS release
COPY --from=production-build /bot/prod_node_modules ./node_modules
COPY --from=production-build /bot/dist ./dist
EXPOSE 3000
CMD node dist/infrastructure/server.js

# Local
FROM base AS local
COPY --from=install-dependencies /bot/node_modules ./node_modules
COPY --from=install-dependencies /bot/tsconfig.json .
EXPOSE 3000
CMD npm run serve