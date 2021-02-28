FROM node:latest
WORKDIR /bot
COPY package.json ./
COPY tsconfig.json ./
RUN npm install --silent
EXPOSE 3000
CMD ["npm", "run", "serve"]