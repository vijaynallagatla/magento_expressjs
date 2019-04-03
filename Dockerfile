FROM node:8.9.1

RUN mkdir -p /usr/src/app

ADD ./ /usr/src/app/magentoapi

RUN chmod -R 777 /usr

RUN chmod -R 777 /usr/src/app/magentoapi/

WORKDIR /usr/src/app/magentoapi

RUN npm install

ENV mode=testing

RUN npm run test:unit

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
