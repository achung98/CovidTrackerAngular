FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
RUN npm install -g @angular/cli --unsafe-perm
COPY . .
RUN npm run build --prod

FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/CovidTracker/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
