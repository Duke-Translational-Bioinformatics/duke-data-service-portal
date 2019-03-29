FROM node:9.11.1

ADD ./ /var/www/app
WORKDIR /var/www/app
RUN npm install -g && npm link
EXPOSE 1337 35729
CMD ["npm", "start"]
