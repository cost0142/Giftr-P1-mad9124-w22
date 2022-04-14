FROM node:14-slim

ENV API_PORT="80"
ENV DEBUG="api:*"

RUN mkdir -p /mad9124-w22-p1-giftr /mad9124-w22-p1-giftr/config /mad9124-w22-p1-giftr/exceptions /mad9124-w22-p1-giftr/logs /mad9124-w22-p1-giftr/middleware /mad9124-w22-p1-giftr/models /mad9124-w22-p1-giftr/public /mad9124-w22-p1-giftr/routes /mad9124-w22-p1-giftr/startup

COPY config/ /mad9124-w22-p1-giftr/config/
COPY exceptions/ /mad9124-w22-p1-giftr/exceptions/
COPY middleware/ /mad9124-w22-p1-giftr/middleware/
COPY models/ /mad9124-w22-p1-giftr/models/

COPY routes/ /mad9124-w22-p1-giftr/routes/
COPY startup/ /mad9124-w22-p1-giftr/startup/
COPY server.js app.js package.json /mad9124-w22-p1-giftr/

WORKDIR /mad9124-w22-p1-giftr
RUN npm install --unsafe-perm

EXPOSE 80
CMD node app.js