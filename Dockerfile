FROM node:12

# Create Directory for the Container
WORKDIR /usr/src/api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80
ENV PORT=80

CMD ["npm", "start"]
