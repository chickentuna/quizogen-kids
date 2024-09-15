FROM node:19

# Packages
WORKDIR /var/www/html/client
COPY client/package.json .
COPY client/package-lock.json .

WORKDIR /var/www/html/server
COPY server/package.json .
COPY server/package-lock.json .

# NPM dependencies
WORKDIR /var/www/html/client
RUN npm ci

WORKDIR /var/www/html/server
RUN npm ci --omit=dev

# Builds
WORKDIR /var/www/html/client
COPY client .
RUN npm run build

WORKDIR /var/www/html/server
COPY server .
RUN npm run build

# Expose port
EXPOSE 4043

# Run bot
ENTRYPOINT [ "node", "dist/index.js" ]