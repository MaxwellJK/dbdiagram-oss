FROM nginx:latest

WORKDIR /app

# RUN apt update
# RUN apt-get -y install git
# RUN git clone https://github.com/TruDan/dbdiagram-oss.git

RUN mkdir dbdiagram-oss
COPY ./ ./dbdiagram-oss/

RUN apt update
RUN apt -y install npm
RUN npm i -g yarn
RUN npm i -g @quasar/cli
RUN npm i -g firebase
RUN ln -s /usr/local/bin/yarn /usr/bin/yarn

RUN export NODE_PATH=/app/dbdiagram-oss/web/node_modules

WORKDIR /app/dbdiagram-oss/web

RUN yarn
# RUN yarn add stream querystring url https http path util crypto fs zlib os tls fs net child_process

RUN yarn run build
# RUN yarn quasar build

RUN rm -rf /usr/share/nginx/html/*
RUN cp -r /app/dbdiagram-oss/web/dist/spa /usr/share/nginx/html
RUN mv /usr/share/nginx/html/spa /usr/share/nginx/html/dbdiagram-oss 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
