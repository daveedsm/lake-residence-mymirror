FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html MyMirror.html manifest.webmanifest sw.js icon-192.png icon-512.png /usr/share/nginx/html/myapp/
EXPOSE 80
