#!/usr/bin/env bash
# Repair the existing standalone Caddy gateway; never provision a server.
set -euo pipefail
umask 077
test "$(id -u)" = 0 || { echo 'Run as root.'; exit 1; }
cfg=/opt/mymirror-proxy/Caddyfile
src=/data/coolify/source
test -f "$cfg"
test -f "$src/.env"
test -f "$src/docker-compose.yml"
test -f "$src/docker-compose.prod.yml"
docker inspect coolify >/dev/null
docker inspect mymirror-entry >/dev/null
stamp=$(date +%Y%m%d-%H%M%S)
backup=/root/coolify-repair-$stamp
mkdir -p "$backup"
cp -p "$cfg" "$backup/Caddyfile"
cp -p "$src/.env" "$backup/coolify.env"
export REPAIR_BACKUP="$backup"
python3 - <<'PY'
from pathlib import Path
p = Path('/opt/mymirror-proxy/Caddyfile')
s = p.read_text()
needle = '    reverse_proxy 127.0.0.1:8000'
if '# Coolify websocket routes' not in s:
    if s.count(needle) != 1:
        raise SystemExit('Unexpected gateway configuration; nothing changed.')
    routes = '''    # Coolify websocket routes
    handle /app/* {
      reverse_proxy 127.0.0.1:6001
    }
    handle /apps/* {
      reverse_proxy 127.0.0.1:6001
    }
    handle /terminal/ws* {
      reverse_proxy 127.0.0.1:6002
    }
    handle {
      reverse_proxy 127.0.0.1:8000
    }'''
    s = s.replace(needle, routes)
    # Write in place: this file is bind-mounted into the running Caddy container.
    p.write_text(s)
PY
if ! docker exec mymirror-entry caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile; then
  cat "$backup/Caddyfile" > "$cfg"
  echo 'Gateway validation failed; previous file restored.'
  exit 1
fi
python3 - <<'PY'
from pathlib import Path
p = Path('/data/coolify/source/.env')
values = {'PUSHER_PORT':'443', 'TERMINAL_PORT':'443'}
lines = p.read_text().splitlines()
out = []
for line in lines:
    name = line.partition('=')[0]
    if name in values:
        continue
    out.append(line)
out.extend(k+'='+v for k,v in values.items())
p.write_text('\n'.join(out)+'\n')
PY
mkdir -p /etc/systemd/system/mymirror-dashboard-guard.service.d
cat >/etc/systemd/system/mymirror-dashboard-guard.service.d/loopback.conf <<'UNIT'
[Service]
ExecStartPost=/bin/sh -c '/usr/sbin/iptables -t mangle -C PREROUTING -i lo -p tcp --dport 8000 -j ACCEPT 2>/dev/null || /usr/sbin/iptables -t mangle -I PREROUTING -i lo -p tcp --dport 8000 -j ACCEPT'
UNIT
systemctl daemon-reload
systemctl restart mymirror-dashboard-guard.service
cd "$src"
if ! docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps coolify; then
  cat "$backup/coolify.env" > .env
  cat "$backup/Caddyfile" > "$cfg"
  echo "Coolify restart failed. Configuration restored. Backups: $backup"
  exit 1
fi
docker exec mymirror-entry caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
echo 'REPAIR COMPLETE: HTTPS websocket routes and persistent loopback access configured.'
echo "Backups: $backup"
echo 'Reload the Coolify dashboard, then open the server Terminal.'
