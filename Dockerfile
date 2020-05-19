FROM node:10-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm install -g @angular/cli --unsafe-perm
COPY . /app
RUN npm run build --prod

FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/dist/SampleApp/ /usr/share/nginx/html
