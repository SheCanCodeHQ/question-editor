FROM node:6.3.1

WORKDIR /src

COPY . /src

RUN npm install
RUN npm install -g serve

RUN npm run build

EXPOSE 5000

CMD serve -s build -p 5000
