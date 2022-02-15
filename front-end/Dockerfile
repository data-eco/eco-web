FROM node:16.8.0

MAINTAINER keith.hughitt@nih.gov

RUN mkdir -p /app

WORKDIR /app

# aliases
RUN echo 'alias l="ls -lah"' >> ~/.bashrc

ADD package.json ./

RUN yarn install

# add main code
COPY --chown=node:node . /app
