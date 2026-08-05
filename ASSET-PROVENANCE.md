# Asset provenance and release policy

The repository-wide MIT license applies to assets the copyright holders own or
are entitled to sublicense. It does not convert third-party artwork, data,
fonts, photos, or service content to MIT. Every newly added asset must record
its origin, author or owner, license, and a durable evidence URL or file.

The current contributor team has confirmed that it is aligned on the FOSS
transition. Maintainers must still verify that any asset obtained outside that
team is covered by the entry below or has separate written permission.

## Verified external assets and data

| Asset or service | Shipped? | Provenance and terms | Required handling |
| --- | --- | --- | --- |
| Country boundaries used by `CountryMap` | Bundled through `world-atlas@2.0.2` | Natural Earth map data is public domain; `world-atlas` and `topojson-client` are ISC | Keep the package license texts in generated third-party notices and retain this provenance entry |
| Leaflet styles and marker images | Bundled from `leaflet` | Leaflet is BSD-2-Clause | Keep the Leaflet license in generated third-party notices |
| OpenStreetMap standard tiles | Requested at runtime, not bundled | OpenStreetMap contributors; use is subject to the OSM copyright and tile-usage policies | Keep visible contributor attribution and review the tile policy before high-volume production use |
| Lightence Admin-derived source assets | Some are bundled | Original project copyright (c) 2022 Altence LLC under MIT, preserved in `LICENSE` and `NOTICE` | Preserve both files and any asset-specific notices |

Evidence links:

- Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/
- world-atlas package: https://www.npmjs.com/package/world-atlas/v/2.0.2
- OpenStreetMap copyright: https://www.openstreetmap.org/copyright
- OpenStreetMap tile policy: https://operations.osmfoundation.org/policies/tiles/

## Release gate

The combined-release compliance generator hashes non-code panel assets into
`ASSET-INVENTORY.json`. Before a public release, maintainers must investigate
any asset carrying its own license file or provenance marker and must not add an
asset whose redistribution rights cannot be demonstrated. Do not infer a
license from an image's availability on the web.

The previous `src/assets/map-data/countries.geo.json` data was traced to
`johan/world.geo.json`, whose own README calls its legal status dubious. That
legacy file has been removed from the source repository. `CountryMap` now uses
the verified Natural Earth source above.
