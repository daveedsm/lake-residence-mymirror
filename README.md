# MyMirror — Lake Residence

Public address: https://www.agamlife.com/myapp

Recovered from MyMirror.html version 16 on 2026-10-23. Includes an install arrow, PWA manifest, icons and service worker. Data remains local to each browser; 2027 figures are illustrative.

## Deployment

Coolify application: zk2js6xsfqzknclxtf6gzkvp, server 5.75.210.159. Use the repository Dockerfile as an inline Dockerfile, with standard Coolify generated labels. The HTTPS domain path is /myapp; Coolify strips this prefix. Files are available at container root and /myapp for compatibility. The nginx.conf file is an earlier reference configuration and is not copied by the working Dockerfile.

The separate existing website service retains its root domains, without a www-to-apex redirect. The app owns only /myapp.

Namecheap www CNAME: zk2js6xsfqzknclxtf6gzkvp.5.75.210.159.sslip.io. Previous value: custom-domains.chatgpt.site. Apex and mail DNS unchanged.

Verified on origin with valid HTTPS: /myapp, /myapp/manifest.webmanifest and /myapp/sw.js return 200; MyMirror title and install arrow present. Existing website root returns 200. Public DNS caches may temporarily retain the prior host.

Commit source changes to this repository before deploying. This repository backs up source, not browser-local resident data.
