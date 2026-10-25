# MyMirror services and rooftop upgrade

Public app: https://www.agamlife.com/myapp/
Owner editor: https://www.agamlife.com/myapp/admin

Gym, pool, personal trainer, rooftop and shops are grouped with existing services. Spa and trainer have on-site and at-home referrals. The initial shop is Lake Market; no unverified shops or spa providers have been invented.

Shared provider configuration and rooftop requests are saved in /data/mymirror/state.json. Attach a persistent volume at /data/mymirror before production deployment. The public calendar exposes only times, request IDs and status. Requester names, apartment numbers, notes and cancellation hashes are owner-only. A booking is pending until approved. Overlapping active requests are rejected; residents can cancel only with their request token stored on their device.

Owner login is deliberately not activated by a public setup form. Set MYMIRROR_ADMIN_PASSWORD_HASH securely in the deployment environment as salt:scryptHex (64-byte Node scrypt output). Username is owner. The owner must choose their password privately; do not commit a password, salt/hash pair or session token. Until configured, provider changes can continue through the project maintainer using mymirror-defaults.json. Existing stored configuration takes precedence over defaults, so changes after the first admin save should use the authenticated editor.

The deployment must be scoped to the existing MyMirror application only. Keep the main website and market app services unchanged.

Tests passed: anonymous admin writes rejected, owner login/save/logout, HTTPS-only referral URLs, rooftop request persistence and overlap detection, private public-calendar output, cancellation-token checking, and owner approval. Browser-local apartment data from the previous app is preserved. Owner and resident account verification/identity services are separate; rooftop requests do not claim verified resident identity.
