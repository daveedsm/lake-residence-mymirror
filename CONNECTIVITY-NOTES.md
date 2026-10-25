# MyMirror account and service connections

Profile signs existing CRM administrators in through the existing CRM account service. Passwords are verified upstream and are never included in this repository. Administrator access requires the upstream `admin` role. Editing a local profile name or selecting an apartment does not grant this role.

Authenticated administrators can open service settings inside MyMirror. All twelve core services support configured email, telephone, WhatsApp, internal page, HTTPS website/booking destination, or an API webhook. Email opens the resident's mail client; it does not claim server email delivery.

API integrations use a public HTTPS endpoint on port 443 and POST JSON. Optional bearer credentials are environment variables such as `MYMIRROR_SERVICE_TRAINER_TOKEN`, configured in hosting. Endpoint URLs and token variable names are omitted from public configuration. Private network destinations and redirects are rejected. Residents must explicitly consent before submitting their contact details. Requests are rate limited and deduplicated for one hour. A provider's successful HTTP response means accepted for processing, not a confirmed booking or completed work.

Example payload (illustrative values):

```json
{"event":"service.referral.requested","requestId":"a UUID","service":"trainer","option":"onsite","resident":{"name":"Example","apartment":"175","contact":"example@example.com","identityVerified":false},"message":"Training enquiry","createdAt":"ISO timestamp"}
```

The apartment-owner login uses existing CRM invitation codes and passwords through a same-origin server bridge. Only the CRM's authenticated apartment record is returned. Approved account financial movements and bookings can be displayed without copying them into browser-local apartment storage. This does not replace or migrate the CRM database.

## Remaining CRM and worker workflow

The requested compact CRM dashboard, dedicated complaints inbox, apartment task ledger, worker completion/verification history, worker app, photos/materials, approved charges and AI routing are not implemented by this account/settings change. Complaints must go to management first. Requested apartment colors: red work needed, orange inspection needed, green verified ready, blue occupied. Occupancy and outstanding work must remain separately visible. Requested views: squares, list, thumbnails, pictures. Worker completion is distinct from manager verification.

Current non-connected maintenance/photo reports in the original app remain explicitly local; do not describe them as delivered to the CRM or workers. Existing 2027 example figures remain illustrations for visitors without a connected apartment account.
