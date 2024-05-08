
# the base Docker image
FROM node:alpine

# the default application directory
WORKDIR /usr/src/app

# copies the local application files and directories to the defined directory
COPY . /usr/src/app

# installs the global command line dependency for Angular.
RUN npm install -g @angular/cli

# installs the Angular application dependencies.
RUN npm install

# creates and runs the Angular application for external access.
CMD ["ng", "serve", "--host", "0.0.0.0"]