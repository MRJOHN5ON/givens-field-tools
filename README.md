# Givens Field Tools

Mobile field calculators for forestry and wildfire work, built for [Givens Fire & Forestry](https://www.givensfireandforestry.com) in Montana.

**Android package:** `com.givensfire.fieldtools`

## Tools

| Tool | Offline? | Description |
|------|----------|-------------|
| **Cord Calculator** | Yes | Frustum volume for felled logs, multi-log totals, optional species BTU |
| **Tree Height** | Yes | Five methods (angle, line-of-sight, shadow, clinometer, triangulation) |
| **Wildfire Risk** | No | Address or GPS → LANDFIRE fuels, weather, Rothermel spread/flame, risk score, 16-day outlook |

Cord and tree height match the calculators on [givensfireandforestry.com/toolbox](https://www.givensfireandforestry.com/toolbox). Wildfire risk uses the same logic as the website wildfire calculator.

## Stack

- Expo SDK 56 · React Native · TypeScript · Expo Router
- Local persistence via AsyncStorage
- `expo-location` for optional foreground GPS (wildfire tool only)
- 26 unit tests (`npm test`)

## Development

**Requirements:** Node.js 20+, npm, Android Studio (for device builds)

```bash
npm install
npm start          # Expo dev server
npm run android    # Dev build on device/emulator (native modules)
npm test           # Run unit tests
```

### Wildfire tool notes

- **Device or APK required** for full wildfire testing — live APIs (LANDFIRE, Open-Meteo, geocoding) do not work from web preview due to CORS.
- **Location permission** is requested only when the user taps “use my current location.”
- After changing native plugins in `app.json`, rebuild: `npm run android` or `npm run build:apk`.

### Release APK (local)

```bash
npm run build:apk
```

Output: `GivensFieldTools.apk` at the project root. Increment `versionCode` in `app.json` before each sideload update.

## Install (Android, sideload)

Not on Google Play yet. Download the latest APK from **[GitHub Releases](https://github.com/MRJOHN5ON/givens-field-tools/releases)**.

## Privacy

- [Field Tools Privacy Policy](https://www.givensfireandforestry.com/field-tools-privacy)
- No Givens backend — wildfire lookups go directly from the device to public APIs when the user runs a calculation
- No analytics SDK, no account required

## Project layout

```
app/                 Screens (home, cord, tree height, wildfire)
components/          Shared UI + wildfire results
constants/           Copy, theme, images
hooks/               Calculator state hooks
lib/                 Math, APIs, persistence, tests
assets/images/       Branding and tool artwork
```

## License

**Proprietary — all rights reserved.** See [LICENSE](LICENSE).

Copyright © 2026 Givens Fire & Forestry LLC. Published on Google Play by Ryebread (developer account). Source is public for transparency; copying, forking for redistribution, or derivative apps require written permission from Givens Fire & Forestry LLC.

Third-party dependencies (Expo, React Native, etc.) are licensed separately by their authors.
