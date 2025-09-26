# OpenSupports Client Dockerfile
# Node.js 11.15.x 기반 React 애플리케이션

FROM node:11.15-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild node-sass
RUN npm run build

FROM nginx:alpine

COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
