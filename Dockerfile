FROM node:boron
WORKDIR /usr/src/app
COPY . .
HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1
ENTRYPOINT ["npm", "start"]