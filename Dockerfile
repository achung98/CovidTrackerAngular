FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
RUN npm install -g @angular/cli --unsafe-perm
COPY . .
RUN npm run build --prod

FROM nginx:1.17.1-alpine AS prod-stage
ENV PORT 4200
COPY --from=build /usr/src/app/dist/CovidTracker/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
