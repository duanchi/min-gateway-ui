FROM docker.in-mes.io/library/node:lts as node-builder
WORKDIR /app

#COPY ./ /app
#RUN yarn config set registry "https://npm.in-mes.io/"
#RUN yarn && yarn build

FROM docker.in-mes.io/library/nginx:latest
#COPY --from=node-builder /app/dist /app
COPY ./dist /app
ENV API_PROXY "http://127.0.0.1:9080/"
ENV UPLOAD_FILE_SIZE "50m"
