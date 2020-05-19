FROM node:10-alpine
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm i
RUN npm install -g @angular/cli --unsafe-perm
COPY . /app
EXPOSE 4200

# start app
CMD ng serve
