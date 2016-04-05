FROM node:0.12-onbuild

ADD ./ /var/www/app
WORKDIR /var/www/app
RUN ["npm", "install", "-g"]
RUN ["npm", "link"]
EXPOSE 1337 35729
CMD ["node", "app.js"]
