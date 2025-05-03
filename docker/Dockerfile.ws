FROM node:20-alpine

WORKDIR /usr/src/app

# Copy the necessary files from the correct locations
COPY ./packages /usr/src/app/packages
COPY ./apps/ws /usr/src/app/apps/ws
COPY package.json /usr/src/app/package.json  
COPY package-lock.json /usr/src/app/package-lock.json  
COPY turbo.json /usr/src/app/turbo.json  

# Install dependencies
RUN npm install

# Expose port for the ws app
EXPOSE 8080

WORKDIR /usr/src/app/apps/ws

# Build and start the ws app
RUN npm run build 
CMD ["npm", "run", "start:websocket"]