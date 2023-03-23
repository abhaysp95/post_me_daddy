FROM node:18.15.0 as base

RUN groupadd post_me_daddy && useradd -m -g post_me_daddy -s /bin/bash post_me_daddy
USER post_me_daddy

WORKDIR /home/post_me_daddy/post_me_server

COPY package*.json ./

RUN yarn install

COPY . .

# COPY ./.env ./.env

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]
