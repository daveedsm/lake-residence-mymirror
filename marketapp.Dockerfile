FROM node:22-alpine
ADD https://raw.githubusercontent.com/daveedsm/lake-residence-mymirror/main/marketapp-server.cjs /app/server.cjs
ENV MARKET_APP_ONLY=1
EXPOSE 80
CMD ["node", "/app/server.cjs"]
