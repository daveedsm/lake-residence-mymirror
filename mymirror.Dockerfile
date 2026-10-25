FROM node:22-alpine
WORKDIR /app
COPY index.html MyMirror.html manifest.webmanifest sw.js icon-192.png icon-512.png mymirror-upgrade.js mymirror-admin.html mymirror-owner-setup.html mymirror-admin-v2.js mymirror-defaults.json mymirror-server.cjs mymirror-config.cjs mymirror-referrals.cjs apartment-cover-*.webp ./
ENV MYMIRROR_DATA_DIR=/data/mymirror
EXPOSE 80
CMD ["node","mymirror-server.cjs"]
