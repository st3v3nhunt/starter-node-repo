FROM node:18.1.0-alpine3.14

# Default env to production
ARG NODE_ENV=production
ARG PORT=3000
ARG PORT_DEBUG=9229

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

EXPOSE $PORT $PORT_DEBUG

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .

# Run as non-root user
USER node

CMD [ "npm", "run", "start:watch" ]
