# Publishing — Remaining TODO (registration & manual steps)

The code/config changes for publishing are done (`eas.json`, `PRIVACY.md`,
`.gitignore`). Everything below requires personal credentials, paid accounts, or
store-console UI work, so it must be done by you. See the full plan at
`.claude/plans/i-would-like-to-zesty-yao.md`.

## 1. Accounts (start early — verification can take days)

- [X] **Apple Developer Program** — enroll as **Individual** ($99/yr):
      https://developer.apple.com/programs/
- [ ] **Google Play Console** — register ($25 one-time, identity verification required):
      https://play.google.com/console
- [X] **Expo account** (free): https://expo.dev
- [X] Install CLI: `npm i -g eas-cli` then `eas login`

## 2. Link project to EAS

- [X] Run `eas init` in the repo (writes `owner` + `extra.eas.projectId` into `app.json`)

## 3. Fill in the `eas.json` placeholders

In `submit.production`:
- [X] `ios.appleId` — your Apple account email
- [ ] `ios.appleTeamId` — from https://developer.apple.com/account (Membership)
- [ ] `ios.ascAppId` — App Store Connect app's Apple ID (after creating the app record)
- [ ] `android.serviceAccountKeyPath` — drop the Google Play service-account JSON at
      repo root as `play-service-account.json` (already gitignored). Create it in
      Google Cloud Console with Play Console API access and grant it in Play Console
      → Users & permissions.

## 4. Store-readiness assets

- [ ] Decide final **store display name** (currently "Sudoku" — generic/likely taken).
      Update `expo.name` in `app.json` if changed (bundle id stays the same).
- [X] Make this repo **public** and use the privacy policy URL:
      `https://github.com/<user>/sudoku-app/blob/main/PRIVACY.md`
      (or enable GitHub Pages for a nicer page). Paste it into both consoles.
- [ ] Support URL / contact email for App Store Connect.
- [ ] **App Store screenshots** — 6.7" iPhone + 13" iPad (tablet support is on).
- [ ] **Play Store graphics** — 512×512 icon, 1024×500 feature graphic, phone shots.
- [ ] Listing copy: subtitle, description, keywords, category (Games > Puzzle), age
      rating, and data-safety questionnaires (declare "no data collected").

## 5. Build

- [ ] `eas build --platform android --profile preview` → install APK, smoke-test
      (launch, play, force-kill + resume to verify MMKV persistence)
- [ ] `eas build --platform ios --profile preview` → test via TestFlight/ad-hoc
- [ ] `eas build --platform android --profile production` (accept EAS-managed keystore)
- [ ] `eas build --platform ios --profile production` (let EAS create certs/profiles)

## 6. Create store listings

- [ ] **App Store Connect** — create app record with bundle id
      `dev.alejandrodelacruz.sudoku`, fill metadata, privacy questionnaire, free pricing.
      Copy the **ascAppId** back into `eas.json`.
- [ ] **Google Play Console** — create app, complete Store listing, content rating,
      data safety, target audience, production track. New personal accounts may require
      the closed-testing → production flow (≥12 testers, ~14 days) — verify.

## 7. Submit & release

- [ ] `eas submit --platform android --profile production`
- [ ] `eas submit --platform ios --profile production`
- [ ] In each console: attach build to a release, submit for review.
- [ ] After approval: release, then tag git (`v1.0.0`).

## Future updates

Bump `expo.version` in `app.json`, rebuild with EAS (build numbers auto-increment),
re-submit. Consider EAS Update for OTA JS-only fixes.
