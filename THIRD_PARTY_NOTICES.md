# Third-party notices

Ritro is licensed under the [GNU AGPL-3.0](LICENSE). It includes or depends on third-party
software and assets under their own licences, listed below.

## Fonts (bundled)

These fonts ship with the website in `client/src/app/fonts/`. Each is licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org), and its full licence text sits next to
the font file.

| Font | Copyright | Licence file |
|---|---|---|
| Geist | Copyright 2024 The Geist Project Authors | `geist-OFL.txt` |
| Syne | Copyright 2017 The Syne Project Authors | `syne-OFL.txt` |
| DM Sans | Copyright 2014 The DM Sans Project Authors | `dmsans-OFL.txt` |

## Icons

- [Lucide](https://lucide.dev) icons, via `lucide-react`. ISC licence, Copyright (c) Lucide Contributors.

## npm dependencies

The website's runtime dependencies are installed from npm and keep their own licences in
`node_modules`. As of version 0.0.1 they are all permissive (MIT, Apache-2.0, ISC, BSD and similar)
and compatible with the AGPL-3.0, with a few to know about:

| Package | Licence | Notes |
|---|---|---|
| `caniuse-lite` | CC-BY-4.0 | Browser support data used at build time |
| `@img/sharp-libvips-*` | LGPL-3.0-or-later | Image optimisation library used by Next.js, dynamically linked |
| `elkjs` | EPL-2.0 | Used by Prisma's CLI tooling, not shipped to browsers |

To list every production dependency and its licence:

```bash
cd client
npx license-checker --production --summary
```

## Brand marks

The Google and GitHub logos on the sign-in page are trademarks of their owners and are used only
to identify those sign-in options.
