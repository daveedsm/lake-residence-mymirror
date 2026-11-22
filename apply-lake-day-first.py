from pathlib import Path
import re, shutil
root = Path('/opt/lake-ui-20261122-backup')
js = Path('/opt/lake-ui-20261122.js').read_text()
boot = Path('/opt/lake-first-paint.html').read_text()
for source, target in [('mirror-index.html','index.html'),('mirror-MyMirror.html','MyMirror.html')]:
    html = (root/source).read_text()
    html = re.sub(r'(<head\\b[^>]*>)', lambda m: m.group(1)+boot, html, count=1, flags=re.I)
    html = html.replace('</body>', '<script>'+js+'</script></body>')
    (Path('/opt/mymirror')/target).write_text(html)
Path('/opt/mystay-presentation/main.js').write_text((root/'stay-main.js').read_text()+'\\n;'+js)
shutil.copy('/opt/lake-ui-20261122.js','/opt/mymirror/lake-ui-20261122.js')
server_path = Path('/opt/mystay-presentation/server.cjs')
server = server_path.read_text()
backup = root/'stay-server-before-day.cjs'
if not backup.exists(): backup.write_text(server)
shutil.copy('/opt/lake-first-paint.html','/opt/mystay-presentation/lake-first-paint.html')
if 'lake-first-paint.html' not in server:
    anchor = 'let html=await upstream.text();'
    if anchor not in server: raise RuntimeError('Server injection anchor missing')
    inject = \"html=html.replace(/<head([^>]*)>/i,'<head$1>'+fs.readFileSync(path.join(root,'lake-first-paint.html'),'utf8'));\"
    server_path.write_text(server.replace(anchor,anchor+inject))
print('Day-first source prepared; original server backed up')
