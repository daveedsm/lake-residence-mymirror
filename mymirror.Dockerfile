FROM node:22-alpine
WORKDIR /app
RUN wget -qO /tmp/app.tar.gz https://github.com/daveedsm/lake-residence-mymirror/archive/refs/heads/main.tar.gz && tar -xzf /tmp/app.tar.gz -C /tmp && cp /tmp/lake-residence-mymirror-main/index.html /tmp/lake-residence-mymirror-main/MyMirror.html /tmp/lake-residence-mymirror-main/manifest.webmanifest /tmp/lake-residence-mymirror-main/sw.js /tmp/lake-residence-mymirror-main/icon-192.png /tmp/lake-residence-mymirror-main/icon-512.png /tmp/lake-residence-mymirror-main/mymirror-upgrade.js /tmp/lake-residence-mymirror-main/mymirror-admin.html /tmp/lake-residence-mymirror-main/mymirror-defaults.json /tmp/lake-residence-mymirror-main/mymirror-server.cjs /app/
ENV MYMIRROR_DATA_DIR=/data/mymirror
EXPOSE 80
CMD ["node","mymirror-server.cjs"]
