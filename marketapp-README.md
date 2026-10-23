# Lake Market phone app

URL: https://www.agamlife.com/marketapp/

Coolify application: nxbgdktth0igdbzbysknqm7o. Separate application, primary HavaNagila Localhost. Dockerfile: marketapp.Dockerfile. Standard generated proxy rules route only /marketapp to this container; MARKET_APP_ONLY=1 restores the stripped prefix internally. Existing website and MyMirror services are unchanged.

Self-contained marketapp-server.cjs embeds the app UI, separate manifest identity /marketapp/, PNG basket icons and scoped service worker. The full existing market runs in a same-origin frame, preserving all 3014 products, categories, search, favorites, shopping cart and existing checkout behavior. This is an installable web app, not an app-store release.

Shopping requires internet access. Android: open in Chrome and use Install app. iPhone: open in Safari, Share, Add to Home Screen.

No new payment provider or order backend was added. Existing market order and fulfillment capabilities apply. Tested live search, adding and removing an item, cart totals, installation help, HTTPS, manifest and service worker routes.

To roll back, stop or roll back only this application. Do not modify the main website service. marketapp.compose.yaml is an alternative separate-service deployment example.
