# MyMirror — Lake Residence

Deployment: https://www.agamlife.com/myapp

Recovered from MyMirror.html version 16 on 2026-10-23. Includes a phone install button and PWA manifest. Data remains local to each browser; 2027 figures are illustrative.

Source changes must be committed to this repository before deployment. Coolify builds from the main branch archive.

Coolify proxy must preserve the /myapp prefix. Saved routing configuration:

```text
traefik.enable=true
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
traefik.http.routers.http-0-zk2js6xsfqzknclxtf6gzkvp.entryPoints=http
traefik.http.routers.http-0-zk2js6xsfqzknclxtf6gzkvp.middlewares=gzip
traefik.http.routers.http-0-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`zk2js6xsfqzknclxtf6gzkvp.5.75.210.159.sslip.io`) && PathPrefix(`/`)
traefik.http.routers.http-0-zk2js6xsfqzknclxtf6gzkvp.service=http-0-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.http-1-zk2js6xsfqzknclxtf6gzkvp.entryPoints=http
traefik.http.routers.http-1-zk2js6xsfqzknclxtf6gzkvp.middlewares=gzip
traefik.http.routers.http-1-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`zk2js6xsfqzknclxtf6gzkvp.167.233.241.117.sslip.io`) && PathPrefix(`/`)
traefik.http.routers.http-1-zk2js6xsfqzknclxtf6gzkvp.service=http-1-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.http-2-zk2js6xsfqzknclxtf6gzkvp.entryPoints=http
traefik.http.routers.http-2-zk2js6xsfqzknclxtf6gzkvp.middlewares=redirect-to-https
traefik.http.routers.http-2-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`www.agamlife.com`) && PathPrefix(`/myapp`)
traefik.http.routers.http-2-zk2js6xsfqzknclxtf6gzkvp.service=http-2-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.http-3-zk2js6xsfqzknclxtf6gzkvp.entryPoints=http
traefik.http.routers.http-3-zk2js6xsfqzknclxtf6gzkvp.middlewares=redirect-to-https
traefik.http.routers.http-3-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`agamlife.com`) && PathPrefix(`/myapp`)
traefik.http.routers.http-3-zk2js6xsfqzknclxtf6gzkvp.service=http-3-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.entryPoints=https
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.middlewares=gzip
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`www.agamlife.com`) && PathPrefix(`/myapp`)
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.service=https-2-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.tls.certresolver=letsencrypt
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.tls=true
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.entryPoints=https
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.middlewares=gzip
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.rule=Host(`agamlife.com`) && PathPrefix(`/myapp`)
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.service=https-3-zk2js6xsfqzknclxtf6gzkvp
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.tls.certresolver=letsencrypt
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.tls=true
traefik.http.services.http-0-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
traefik.http.services.http-1-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
traefik.http.services.http-2-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
traefik.http.services.http-3-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
traefik.http.services.https-2-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
traefik.http.services.https-3-zk2js6xsfqzknclxtf6gzkvp.loadbalancer.server.port=80
caddy_0.encode=zstd gzip
caddy_0.handle_path.0_reverse_proxy={{upstreams 80}}
caddy_0.handle_path=/*
caddy_0.header=-Server
caddy_0.try_files={path} /index.html /index.php
caddy_0=http://zk2js6xsfqzknclxtf6gzkvp.5.75.210.159.sslip.io
caddy_1.encode=zstd gzip
caddy_1.handle_path.1_reverse_proxy={{upstreams 80}}
caddy_1.handle_path=/*
caddy_1.header=-Server
caddy_1.try_files={path} /index.html /index.php
caddy_1=http://zk2js6xsfqzknclxtf6gzkvp.167.233.241.117.sslip.io
caddy_2.encode=zstd gzip
caddy_2.handle.2_reverse_proxy={{upstreams 80}}
caddy_2.handle=/myapp*
caddy_2.header=-Server
caddy_2.try_files={path} /index.html /index.php
caddy_2=https://www.agamlife.com
caddy_3.encode=zstd gzip
caddy_3.handle.3_reverse_proxy={{upstreams 80}}
caddy_3.handle=/myapp*
caddy_3.header=-Server
caddy_3.try_files={path} /index.html /index.php
caddy_3=https://agamlife.com
caddy_ingress_network=coolify
traefik.http.routers.https-2-zk2js6xsfqzknclxtf6gzkvp.priority=10000
traefik.http.routers.https-3-zk2js6xsfqzknclxtf6gzkvp.priority=10000
```
