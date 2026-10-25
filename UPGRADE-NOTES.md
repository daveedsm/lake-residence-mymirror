# MyMirror — simpler home and configurable services

Phone key and Garage door are the first two controls on Home and Services. Home restores the welcome screen, residence name and Rename residence control, keeps the apartment photo and custom shortcuts, and shows every original and added service icon in a visible grid. No service icons are hidden behind collapsed groups on Home. Income, stays and the illustrative chart remain in a compact My apartment section. The Services directory also retains the grouped view.

Gym, Pool, Spa, Personal trainer, Rooftop, Shops, Maintenance, Room service, Concierge, Housekeeping and Things to do remain available. Hardware access stays honestly marked as not connected until a real lock/gate integration is provided. No resident storage keys were changed or cleared.

## Shared management

The existing protected `/myapp/admin` editor now supports editable provider titles, descriptions, Hebrew text, extra providers, availability toggles and ordering. Destination types include HTTPS websites, stores, booking pages, validated WhatsApp URLs, phone, email and internal pages. Shop entries support categories, known opening hours, optional HTTPS logos/maps, featured ordering and Hebrew text.

Rooftop requests use the existing persistent server store, overlap checks and management approvals. Added rules include closed dates, maximum duration and booking horizon. The date view displays recorded reservations and configured opening hours, never invented availability. Management can confirm, reject or cancel. Resident cancellation still requires its per-request token; public schedules exclude resident names, apartment numbers and notes. Resident identity verification is not implemented by this update.

## Performance

Three existing apartment photos were moved from embedded base64 strings to shared WebP files. Each entry HTML shrank from about 1.4 MB to 155 KB (about 89%). The photos are preserved, loaded as needed and cacheable. This is an HTML payload reduction, not a claim that total first-load image bytes dropped by the same percentage.

## Validation completed locally

- `node --test mymirror.test.cjs`: URL scheme validation, internal-link restrictions, anonymous admin denial, owner login, secure session cookie attributes, shared config writes, concurrent booking conflict prevention, public schedule privacy, cancellation token checking, management confirmation, closed dates, cross-origin write denial and persistence after restart.
- Browser: Home access order, all service groups, English/Hebrew RTL, rooftop date view and unavailable service states; 390-pixel phone layout; protected admin sign-in and saving shop opening hours on isolated test data.
- Existing install arrow, manifest/icons and `/myapp/` route retained. Device installation and Google Play publishing are not yet verified.

## Deployment

1. Build from the reviewed branch using `Dockerfile` or `mymirror.Dockerfile`. Both now copy the reviewed build context and run the Node service; do not use the previous inline nginx Dockerfile or fetch a moving `main` branch during the build.
2. Mount persistent storage at `/data/mymirror`. Back up existing `state.json` before migration; do not replace it with test data. Existing stored provider settings take precedence over defaults.
3. Terminate HTTPS at the reverse proxy. Route `/myapp` to container port 80. The service accepts either stripped or preserved `/myapp` prefixes. Keep other website/market services separate.
4. Set `MYMIRROR_ALLOWED_ORIGINS` to the exact new HTTPS origin when using another domain (comma-separated). The existing production domain is retained for compatibility.
5. Configure `MYMIRROR_ADMIN_PASSWORD_HASH` privately in hosting using the existing `salt:scryptHex` format (Node scrypt, 64 bytes). No password, hash, session secret or public admin setup flow is included in this branch. Admin remains disabled until configured.
6. Verify HTTPS, admin login, persistent writes, live calendar, images, installation and restored resident data before switching public traffic.

This branch is not deployed to the new Hetzner server. Server installation/access is still pending. No Google Play release has been created. Browser-local resident data is not automatically migrated by moving server files; export/import or explicit synchronization is still required for cross-device migration.

## Latest layout revision

Home now starts with the apartment picture, followed by its name/rename control and the customizable shortcut strip (up to five shortcuts plus the edit button). Phone key and Garage access remain available in the strip. All twelve service icons appear as compact original-icon tiles in a four-column, three-row grid. Concierge is merged into Room service; old concierge actions route to Room service. No category banners appear on Home or Services. The active navigation stripe is removed.
