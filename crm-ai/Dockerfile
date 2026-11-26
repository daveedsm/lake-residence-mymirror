FROM nginx:stable-alpine
COPY crm-ai/index.html /usr/share/nginx/html/index.html
COPY crm-ai/lake-residence-monogram.png /usr/share/nginx/html/lake-residence-monogram.png
COPY crm-ai/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
