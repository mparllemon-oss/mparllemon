# Player score setup

This branch adds a same-origin Snake game and score dashboard to the existing Firebase login. A completed game creates an immutable record of the authenticated player's name, UID, score, game, and server timestamp. Retry uses the same session ID. Players can only read their own records; the owner can read all records. No email addresses or passwords are stored in scores.

## Required before release

1. In Firebase project `protofolio-fab57`, create the default Cloud Firestore database in production mode if it does not exist. Review existing Firestore rules and merge this feature's collection rules if the database serves other applications; do not overwrite unrelated access policies.
2. Deploy the included Firestore rules and indexes: `firebase deploy --only firestore:rules,firestore:indexes --project protofolio-fab57` from a reviewed checkout with an authorized Firebase CLI account. Wait for the UID/playedAt index to finish building.
3. In Firebase Authentication > Users, identify Hussain's existing owner login and copy its UID. In the Firestore console create `scoreAdmins/<owner UID>` with boolean field `enabled: true`. Browser clients cannot create or modify this collection. Do not use the Vercel account email as a substitute for a verified Firebase UID.
4. Deploy this branch to the existing Vercel project `mparllemon-zmnm`, then perform the checks below before merging/releasing.

## End-to-end acceptance

- Existing login/signup and gallery continue working. Signup names appear in the game; old accounts without a name must set one before playing.
- On mobile and desktop, play Snake, hit a wall, and confirm `Score saved` appears. Reload the score page and see the saved record on another device.
- Two distinct players only see their own scores. The owner sees both names and scores, with timestamps. Client attempts to impersonate another UID, change an existing score, or write a score-admin record must be rejected.
- Simulate a failed write, retry, and confirm exactly one record exists for that game. Unconfirmed writes block starting another game, and navigation warns when a game or pending save could be lost.

## Limits

Only the integrated Snake game reports scores. Existing external games and showcase cards do not report scores. Browser-reported scores are not cheat-proof: rules verify account ownership, name, shape, bounds and server time, but do not replay gameplay. No tournament or prize verification is provided. Dashboard lists the latest 500 games, not lifetime statistics. Abandoned games are not saved.

Current blockers: Firebase database/rules/admin access is not connected here; Vercel project inspection returns 403 even after reconnect. Live saving and cross-device access must not be reported as verified until the acceptance checks pass.
