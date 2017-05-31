#
# Node.js w/ Bower & Gulp Dockerfile
#
# https://github.com/dockerfile/nodejs-bower-gulp
#

# Pull base image.
FROM dockerfile/nodejs

# Install Bower & Gulp
RUN npm install -g bower gulp

# Define working directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Define default command.
CMD ["bash"]