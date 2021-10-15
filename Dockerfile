FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM zenika/alpine-chrome:89-with-puppeteer
WORKDIR /usr/src/pdfer
USER root
RUN apk add --no-cache msttcorefonts-installer fontconfig ttf-freefont
RUN update-ms-fonts
COPY package.json yarn.lock ./
COPY --from=builder /usr/src/app/dist/ ./dist
RUN yarn install --prod
EXPOSE 5000
CMD ["node", "dist/main"]
