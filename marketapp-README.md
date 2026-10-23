# Lake Market phone app

URL: https://www.agamlife.com/marketapp/

Self-contained marketapp-server.cjs serves the app shell, unique manifest, PNG icons and scoped service worker. The full existing market is opened in a same-origin frame, keeping its live catalog, shopping cart, favorites and checkout behavior. This is an installable web app, not a Play Store or Apple App Store release.

The gateway forwards all other requests to the current Lake Residence Sites publication. MyMirror continues through its separate Coolify /myapp routing. Deploy marketapp.compose.yaml into the existing main website service, preserving its resource name and domains.

No payment provider or new order backend has been added; fulfillment and checkout capabilities are those of the existing market. Online access is required for shopping. The app shell and installation assets are cached only within /marketapp/.

Rollback: use lake-residence-website.compose.yaml.
