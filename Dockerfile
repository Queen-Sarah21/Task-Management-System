#stage 1 (build)
FROM node:lts-alpine AS builder

#inside of image container
WORKDIR /app

COPY ./app/package*.json /app/

RUN npm install

COPY ./app /app

RUN npm run build

#stage 2 (run)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]