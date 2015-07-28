FROM node:latest

RUN ["npm", "install", "--global", "gulp"]
WORKDIR /var/www/app
EXPOSE 1337 35729
CMD ["gulp"]
