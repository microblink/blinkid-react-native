## v8001.0.0

Updated to BlinkID native SDKs **v8001.0.0** (Android & iOS). See also the [platform release notes](https://docs.microblink.com/blinkid/release-notes).

### What's new
- Accelerated support for newly issued documents
  - Optimized document support and extraction pipeline to reduce time-to-production for newly issued identity documents, and to apply document-rule / knowledge improvements without a full SDK upgrade when possible.
  - Zero-day readiness: depending on design availability and when a new document begins circulating, BlinkID can deliver 0-day support—and at a maximum, within 4 weeks of the document's release.
  - Future-proof compliance: workflows can adapt to global document updates faster than before.
- Enhanced frame selection & image quality
  - Smart quality selection: analyzes multiple frames and selects a crisp, stable image before extraction.
  - Higher first-pass success by filtering blurry or unstable frames early.
  - Flexible speed vs. quality tuning via `documentCaptureModule.inputImageSelectionStrategy` (camera / video flow).
- Enhanced DirectAPI / photo-mode intelligence
  - `documentCaptureModule.cropType` replaces the former boolean cropped-image flag (`"not-cropped"` | `"unknown"` | `"cropped"`).
  - `"cropped"` and `"unknown"` apply to **DirectAPI (photo)** flows only; camera UX (`performScan`) requires `"not-cropped"`.
- Expanded & improved barcode capabilities
  - Aztec barcode support via `barcodeModule.aztecScanningEnabled`.
  - Improved speed and accuracy for QR, DataMatrix, and selected 1D formats.
- Parsing & extraction improvements
  - Improved Persian digit recognition for regional documents.
- Mandatory data redaction: Netherlands DL QR code added to the redacted list.
- OTA (over-the-air) resources: configure separately from base ML resources via `BlinkIdSdkSettings.otaResourcesConfig` (see [API changes](#api-changes-v8001) below).
- Added `refreshLicenseLease` to refresh the BlinkID SDK license lease while the SDK is initialized (see [API changes](#api-changes-v8001) below).

### Bug fixes
- Document swap data caching: fixed an issue in continuous-video mode where data from a previously scanned document could persist after a new document was introduced. The SDK now detects document swaps and clears cached images (cropped faces, signatures, barcodes, etc.) to prevent cross-contamination.
- Fixed `resourcesConfig.requestTimeout` and `otaResourcesConfig.requestTimeout`: custom timeout values are now applied on Android and iOS (previously ignored on iOS; Android accepted a single number only).

### New documents support
- Bailiwick Of Jersey - Driver's License
- Bailiwick Of Jersey - Paper Passport
- Bailiwick Of Jersey - Polycarbonate Passport
- Botswana - Driver's License
- Brunei - Polycarbonate Passport
- Democratic Republic Of The Congo - Polycarbonate Passport
- Dominican Republic - Polycarbonate Passport
- Eswatini - Driver's License
- Gambia - Driver's License
- Georgia - Residence Permit
- Iceland - Identity Card
- Iceland - Residence Permit
- Japan - Specified Residence Card
- Liechtenstein - Residence Permit
- Liechtenstein - Resident ID
- Mali - Polycarbonate Passport
- Mauritania - Resident ID
- Monaco - Identity Card
- Monaco - Residence Permit
- Nepal - Identity Card
- Palestine - Identity Card
- San Marino - Identity Card
- Sudan - Driver's License
- UK, Northern Ireland - Voter ID
- USA, Arkansas - Medical Marijuana ID
- USA, Massachusetts - Medical Marijuana ID
- USA, Michigan - Medical Marijuana ID
- USA, New Jersey - Medical Marijuana ID
- Zambia - Residence Permit

#### New document versions for supported documents
- Bolivia - Driver's License
- Burkina Faso - Identity Card
- Central African Republic - Paper Passport
- Estonia - Identity Card
- Dominican Republic - Identity Card
- Guyana - Identity Card
- Israel - Identity Card
- Luxembourg - Polycarbonate Passport
- Mexico, Baja California - Driver's License
- Mexico, Hidalgo - Driver's License
- Oman - Identity Card
- Oman - Resident ID
- Uruguay - Identity Card
- USA, Mississippi - Identity Card
- USA, Nebraska - Driver's License
- USA, Nebraska - Identity Card
- USA, North Carolina - Identity Card
- USA, Oklahoma - Driver's License
- USA, Oklahoma - Identity Card
- USA, Texas - Weapon Permit

#### New extracted fields from documents
- Brazil national identity card and regional (22 regions) identity cards now extract parent names (`parentsInfo`).
- Croatia identity card: added support for cyrillic values in `sex`, `address`, `issuingAuthority`, `lastName` and `firstName`, and latin `sex`.
- Virgin Islands of the United States identity card and driver's license: added `documentSubtype` and `specificDocumentValidity`.
- Tunisia identity card: added arab values for `lastName`, `firstName`, `placeOfBirth`; added `dateOfBirth`.
- Argentina identity card and alien identity card: use `cardAccessNumber` instead of `documentAdditionalNumber`.

### Requirements
- React Native **0.82.x** or newer (built and tested; backward compatible with the old architecture)
- iOS **16.0** or newer
- Android API level **24** or newer; **compileSdk 36**; **Kotlin 2.2.21**
- Integrator apps do **not** need Jetpack Compose setup; Compose is used internally by BlinkID UX

### <a name="api-changes-v8001"></a> API changes

#### Document class info (breaking)
- `DocumentClassInfo.country`, `region`, and `documentType` are now nested objects `{ id?: CountryID | RegionID | DocumentTypeID; rawValue: string }` instead of flat enum/string values.
  - Use `id` for known, build-time classifications (same role as the old flat enums).
  - Use `rawValue` when OTA introduces classifications not yet present in the typed enums.
- `ClassFilter` / `DocumentFilter` stay **flat**: pass `CountryID` / `RegionID` / `DocumentTypeID` on the filter (not the nested result shape).

#### Document capture & barcode settings
- `documentCaptureModule.inputImageCropped` (boolean) → `documentCaptureModule.cropType`: `"not-cropped"` | `"unknown"` | `"cropped"` (default `"not-cropped"`).
- Added `documentCaptureModule.inputImageSelectionStrategy`: `"single-image"` | `"optimize-for-speed"` | `"balanced"` | `"optimize-for-quality"` (camera / video; default `"balanced"`).
- Added `barcodeModule.aztecScanningEnabled` (default `false`).

#### Scanning results
- Added `ethnicity` on `BlinkIdScanningResult` and `VizResult`.
- Added `fullName` on `ParentInfo`.
- Added `FieldType.ParentFullName` and `FieldType.Ethnicity` for redaction.

#### License lease refresh
- Added `refreshLicenseLease()` — refreshes the BlinkID SDK license lease. Can be called periodically to maintain an active license status; the required frequency depends on your license configuration. The SDK must already be initialized (via `loadBlinkIdSdk` or a scanning method) before calling this method.

#### SDK settings: nested resources + OTA (breaking for customized resource fields)
Flat resource fields on `BlinkIdSdkSettings` move into nested configs. `resourcesConfig.requestTimeout` and `otaResourcesConfig.requestTimeout` are [`RequestTimeout`](BlinkID/src/blinkIdSettings.ts) (three optional millisecond fields), not `number`. Omit `requestTimeout` or unset fields to keep native defaults (30 seconds per timeout on current BlinkID native SDKs).

| Old (flat) | New |
|---|---|
| `downloadResources` | `resourcesConfig.download` |
| `resourceDownloadUrl` | `resourcesConfig.serviceUrl` |
| `resourceLocalFolder` | `resourcesConfig.localFolder` |
| `resourceRequestTimeout` | `resourcesConfig.requestTimeout` ([`RequestTimeout`](BlinkID/src/blinkIdSettings.ts), milliseconds) |
| `bundleIdentifier` | `resourcesConfig.bundleIdentifier` (iOS) |

New optional `otaResourcesConfig`:

| Field | Default | Notes |
|---|---|---|
| `checkForUpdates` | `true` | When `false`, skips update checks; first-run download still occurs if OTA resources are missing locally |
| `strict` | `false` | When `true`, SDK init fails if an OTA update download fails |
| `serviceUrl` | `https://blinkid-ota.microblink.com` | Do not cross-wire with base resources URL |
| `localFolder` | platform default (`microblink/blinkid/ota` on Android, `OTAMLModels` on iOS) | Keep separate from base `resourcesConfig.localFolder` |
| `requestTimeout` | native default (30 s per timeout) | Milliseconds; [`RequestTimeout`](BlinkID/src/blinkIdSettings.ts) with `connectionTimeoutMilliseconds`, `writeTimeoutMilliseconds`, `readTimeoutMilliseconds`; omit unset fields to keep native default for that timeout |
| `bundleIdentifier` | — | iOS prebundled OTA resources |

Minimal `{ licenseKey }` (and optional `resourcesConfig: { download: true }`) still works; OTA uses native defaults when `otaResourcesConfig` is omitted.

```ts
const sdkSettings: BlinkIdSdkSettings = {
  licenseKey,
  resourcesConfig: {
    download: true,
    // serviceUrl / localFolder optional — platform defaults apply
    // requestTimeout: { connectionTimeoutMilliseconds: 30000, writeTimeoutMilliseconds: 30000, readTimeoutMilliseconds: 30000 },
  },
  otaResourcesConfig: {
    checkForUpdates: true,
    strict: false,
  },
};
```

#### Not exposed in React Native
Native intermediate analysis APIs added in v8001 (e.g. process/analysis crop signals, `AwaitingMoreStableInputImages`, `vizExtractionType`) are **not** part of the React Native public API. RN continues to expose session settings and final `BlinkIdScanningResult` only.

## v8000.0.0

### What's new
- The list of all supported documents and result fields is now available [here](https://docs.microblink.com/blinkid/supported-documents).
- SDK modularization & enhanced flexibility: We’ve transformed our core architecture. Features previously known as "fallback modes" are now independent SDK modules.
  - Tailored implementation: Users can now toggle specific modules such as Capture, Barcode, MRZ, or VIZ scanners to build a workflow that fits their exact needs.
  - Total control: This modular approach offers more flexibility, allowing you to use BlinkID as a comprehensive recognition tool or a specialized scanner, all while leveraging our latest feature updates.
- Expanded barcode support: When operating in Barcode Mode, BlinkID is no longer limited to PDF417.
  - Universal scanning: We've added support for QR codes, Code 128, Code 39, ITF, EAN, UPC, and DataMatrix.
  - Versatility: This expansion allows the SDK to be used across a wider variety of document types beyond standard IDs.
- Streamlined extraction & data redaction (anonymization): We are putting more power in the hands of our integrators by removing restrictive custom rules.
  - Document rules: Custom document rules have been removed. Customers can now implement their own logic based on result completeness to determine how a document is processed.
  - Data redaction (Anonymization): We’ve transitioned away from fixed data redaction (anonymization) rules. You can now programmatically decide which fields to mask and how to handle them based on the specific data returned.
  - We are transitioning our terminology from 'anonymization' to 'data redaction' to more accurately reflect the nature of this feature.
- Intelligent timeout mechanism: To balance performance with accuracy, we've introduced a new timeout feature
  - Non-Blocking scans: Ensures a smooth user experience by preventing "stuck" scan states.
  - Step-by-Step decisions: After each extraction step, you can decide whether the current data is sufficient or if the SDK should continue processing to gather more information.
- Document-specific improvements
  - EU residence permits: For documents with redundant fields on both the front and back, BlinkID now intelligently merges these into the top-level results for better data consistency.
  - Egypt driver’s license: Enhanced data extraction to now include Date of Birth (DOB) as an additional field.
  - Zimbabwe ID: Improved data extraction to support and return both alphabetic and numeric characters within the document number field.
  - We have added extraction of date of birth from document numbers on Egypt DL.
  - If a residence permit has a "remarks" field on both the front and back side, values of these fields will be combined in the top level result.

### Bug fixes
- Date conversion accuracy: Resolved an issue where Islamic-to-Gregorian date conversions could occasionally differ by +/- 1 day. These conversions are now precise and consistent.
- We have fixed MRZ parsing rules for Zimbabwe ID and the new version of Brunei ID; these are now successfully extracted.

### New documents support
- Argentina - Polycarbonate Passport
- Bhutan - Identity Card
- Georgia - Polycarbonate Passport
- Jamaica - Identity Card
- Maldives - Driver's License
- Mongolia - Identity Card
- New Zealand - Proof Of Age Card
- Pakistan - Origin Card
- Saint Kitts And Nevis - Polycarbonate Passport
- South Sudan - Identity Card
- Virgin Islands Of The United States - Driver's License
- Virgin Islands Of The United States - Identity Card

#### New document versions for supported documents
- Argentina - Alien ID
- Argentina - Identity Card
- Armenia - Identity Card
- Australia, Australian Capital Territory - Driver's License
- Australia, Australian Capital Territory - Identity Card
- Brunei - Identity Card
- Bulgaria - Residence Permit
- Denmark - Driver's License
- Georgia - Identity Card
- Greece - Residence Permit
- Guatemala - Alien ID
- Guatemala - Identity Card
- Guyana - Paper Passport
- Kosovo - Driver's License
- Kyrgyzstan - Polycarbonate Passport
- Liechtenstein - Identity Card
- Mauritius - Identity Card
- Nigeria - Identity Card
- Puerto Rico - Driver's License
- Puerto Rico - Identity Card
- Uganda - Identity Card
- USA - Paper Passport
- USA - Polycarbonate Passport
- USA, Montana - Driver's License
- USA, Montana - Identity Card
- USA, New York City - Identity Card
- Venezuela - Driver's License

#### New segments supported on documents
- Pakistan, proof of registration: renamed fathersName to additionalNameInformation
- Mauritania, ID: renamed documentNumber to personalIdNumber

### Requirements
- React Native **0.82.x** or newer (built and tested; backward compatible with the old architecture)
- iOS **16.0** or newer
- Android API level **24** or newer; **compileSdk 36**; **Kotlin 2.2.21**
- Integrator apps do **not** need Jetpack Compose setup; Compose is used internally by BlinkID UX

### Breaking changes
- **Module-based scanning settings:** flat fields on `BlinkIdScanningSettings` (e.g. `glareDetectionLevel`, `CroppedImageSettings`) are replaced by optional module configs: `DocumentCaptureModuleSettings`, `MrzModuleSettings`, `BarcodeModuleSettings`, `VizModuleSettings`
- **UX settings:** use `BlinkIdScanningUxSettings` (already renamed from `BlinkIdUiSettings` in v7.6; v8000 builds on the module model)
- **Method signatures:** `performScan` and `performDirectApiScan` accept a **single settings object** (recommended) or legacy positional arguments
- **Settings are plain TypeScript objects** (no class constructors); e.g. `{ licenseKey: ... }` instead of `new BlinkIdSdkSettings(licenseKey)`
- **Class filter:** use `ClassFilter` with `includeDocuments` / `excludeDocuments` arrays
- **Anonymization → redaction:** `AnonymizationSettings` / fixed rules removed; use `RedactionSettings` (DirectAPI) or `RedactionSettingsResolver` (camera scan)
- **Custom document rules removed:** `customDocumentRules` on `BlinkIdScanningSettings` is no longer supported — implement completeness logic in your app
- **Session timeouts:** `BlinkIdSessionSettings` adds `stepTimeoutDuration` and `inactivityTimeoutDuration` (milliseconds)
- **Enum/result changes:** see [Minor API changes](#minor-api-changes) below (`VirginIslandsUs` → `VirginIslandsOfTheUnitedStates`, removed `FieldType` values, new `cardAccessNumber`, etc.)

For step-by-step migration examples, see the [Migrating from v7.x](https://github.com/microblink/blinkid-react-native/tree/master?tab=readme-ov-file#migrating-from-v7x) section in the README and the [native v8000 migration guide](https://docs.microblink.com/blinkid/migration-v8000).

### Minor API changes
- Added new items to enums:
  - new `FieldType` enum values: `CardAccessNumber`
  - new `DocumentType` enum values: `OriginCard`
  - new `Country` enum value: `VirginIslandsOfTheUnitedStates`
- Added member results to `BlinkIdScanningResult` and `VizResult`:
  - `cardAccessNumber`
- Removed items from enums:
  - removed `FieldType` enum values: `ParentsLastName2`, `ParentsFirstName2`, `ChinPermanentExpiry`
  - removed `Country` enum value: `VirginIslandsUs`


## v7.7.0
- Updated to [Android SDK v7.7.1](https://github.com/microblink/blinkid-android/releases/tag/v7.7.1) and [iOS SDK v7.7.0](https://github.com/microblink/blinkid-ios/releases/tag/v7.7.0)

### What's New
- Barcode extraction is marked as optional on documents where barcode detecton has bad performance (Cuba ID and Passport, Philippines DL, Haiti ID, Sudan ID, Egypt ID, Ecuador Passport, Ghana Passport, Iraq Passport, Nicaragua Passport, Pakistan Passport)

## Bug fixes
- In situations where some fields on different sides of a document have values in multiple alphabets it could happen that while merging results we overwrite them and keep only one alphabet. With this version this is fixed and both alphabets are returned.
- Fixed issue with incorrect retrieval of properties `primaryID` and `secondaryID` from the `MrzResult`.

### New documents support
- Angola - Identity Card
- Antigua And Barbuda - Paper Passport
- Barbados - Paper Passport
- Belize - Paper Passport
- Benin - Driver's License
- Benin - Polycarbonate Passport
- Bermuda - Paper Passport
- Bermuda - Polycarbonate Passport
- Bhutan - Paper Passport
- Botswana - Paper Passport
- Brazil, Acre - Identity Card
- Brazil, Espirito Santo - Identity Card
- Brazil, Mato Grosso Do Sul - Identity Card
- Brazil, Paraiba - Identity Card
- Brazil, Piaui - Identity Card
- Brazil, Rio Grande Do Norte - Identity Card
- Brazil, Tocantins - Identity Card
- Central African Republic - Paper Passport
- Chad - Paper Passport
- Chad - Polycarbonate Passport
- Congo - Paper Passport
- Democratic Republic Of The Congo - Paper Passport
- Djibouti - Paper Passport
- Djibouti - Polycarbonate Passport
- Equatorial Guinea - Paper Passport
- Equatorial Guinea - Polycarbonate Passport
- Eswatini - Identity Card
- Ethiopia - Paper Passport
- Federated States Of Micronesia - Paper Passport
- Gabon - Paper Passport
- Gabon - Polycarbonate Passport
- Ghana - Polycarbonate Passport
- Ghana - Social Security Card
- Guinea - Driver's License
- Guinea Bissau - Paper Passport
- Guinea Bissau - Polycarbonate Passport
- India, Odisha - Driver's License
- India, Uttarakhand - Driver's License
- Ireland - Proof Of Age Card
- Laos - Paper Passport
- Lesotho - Paper Passport
- Liberia - Driver's License
- Liberia - Social Security Card
- Madagascar - Paper Passport
- Malawi - Driver's License
- Mauritania - Identity Card
- Mauritania - Polycarbonate Passport
- Mexico - Social Security Card
- Mongolia - Paper Passport
- Mongolia - Polycarbonate Passport
- Namibia - Paper Passport
- Niger - Paper Passport
- Nigeria - Nin Card
- Papua New Guinea - Paper Passport
- Philippines - eID
- Philippines - MySSS Card
- Puerto Rico - Identity Card
- Saint Thomas And Prince - Paper Passport
- Saint Vincent And The Grenadines - Paper Passport
- Seychelles - Paper Passport
- Seychelles - Polycarbonate Passport
- South Sudan - Polycarbonate Passport
- Taiwan - Paper Passport
- Togo - Gendarmerie ID
- Togo - Military ID
- Togo - Police ID
- Togo - Residence Permit
- Togo - Voter ID
- Tonga - Paper Passport
- Yemen - Paper Passport
- Ghana - Health Insurance Card

#### New document versions for supported documents
- Afghanistan - Identity Card
- Cameroon - Identity Card
- Chile - Driver's License
- Colombia - Alien ID
- Costa Rica - Identity Card
- Malaysia - Driver's License
- Moldova - Identity Card
- Netherlands - Driver's License
- Panama - Driver's License
- South Korea - Driver's License
- South Korea - Identity Card
- Sweden - Driver's License
- UK - Polycarbonate Passport
- USA - Veteran ID
- USA, Alaska - Identity Card
- USA, California - Driver's License
- USA, California - Identity Card
- USA, North Carolina - Driver's License
- USA, Texas - Driver's License
- USA, Texas - Identity Card
- USA, Texas - Weapon Permit
- Vietnam - Driver's License
- Zimbabwe - Identity Card

#### New segments supported on documents
- Greece, Estonia, Finland, Hungary, Ireland, Latvia, Lithuania, Norway, Romania, Slovenia, Croatia, Slovakia, Poland, Malta, Austria, Luxembourg, Netherlands, Bulgaria, Portugal, Cyprus, Sweden, Czechia, Belgium, Germany, Italy, Spain, Switzerland, Denmark - Residence Permit: remarks, residencePermitType
- Belgium, Minors ID: added parentsInfo vector
- Nicaragua, Passport: barcode
- USA, Social Security Card: workRestriction
- China, Identity Card: permanentExpiry (Chinese)

### Minor API changes
- Added new items to enums:
  - new `FieldType` enum values: `EffectiveDate`, `ParentsLastName`, `ParentsLastName2`, `ParentsFirstName2`, `WorkRestriction`, `ParentsFirstName`, `SocialSecurityStatus`, `LegalStatus`, `HusbandName`, `ChinPermanentExpiry`
  - new `DocumentType` enum values: `NinCard`, `MysssCard`, `GendarmerieId`, `PoliceId`
  - new `Country` enum value:`SaintThomasAndPrince`
  - new `Region` enum values:`Acre`,`EspiritoSanto`,`MatoGrossoDoSul`,`Paraiba`,`Piaui`,`RioGrandeDoNorte`,`Tocantins`,`Odisha`,`Uttarakhand`

- Added member results to `BlinkIdScanningResult` and `VizResult`
  - `effectiveDate`
  - `husbandName`
  - `legalStatus`
  - `socialSecurityStatus`
  - `workRestriction`
  - `parentsInfo` (new class)

## v7.6.2

### What's New
- Added backward compatibility with React Native’s old architecture.
    - The SDK now works seamlessly with both the New Architecture (TurboModules) and the legacy Native Module implementation.
- Improved error handling. 
    - Errors now include clearer context and more actionable messages for easier debugging.

## v7.6.1

- Updated to [Android SDK v7.6.1](https://github.com/microblink/blinkid-android/releases/tag/v7.6.1) and [iOS SDK v7.6.2](https://github.com/microblink/blinkid-ios/releases/tag/v7.6.2)

### What's New
- For some documents document type was returned as None, which was causing confusion. To prevent this, we are filling in document type from the barcode in case customers are using BarcodeId mode.
- The fix is applied to all the AAMVA types, plus some others (Argentina, Canada, Colombia, Nigeria, Panama, Paraguay, SouthAfrica)

## v7.6.0

- Updated to [Android SDK v7.6.0](https://github.com/microblink/blinkid-android/releases/tag/v7.6.0) and [iOS SDK v7.6.0](https://github.com/microblink/blinkid-ios/releases/tag/v7.6.0)

### What's New
- Added two new methods in `BlinkidReactNative`: `loadBlinkIdSdk` & `unloadBlinkIdSdk`
    - `loadBlinkIdSdk` - Initializes and loads the BlinkID SDK if it is not already loaded. This method can be called in advance to **preload** the SDK before starting a scanning session. Doing so reduces loading time for the `performScan` and `performDirectApiScan` methods since all resources will already be available and the license verified.
    - `unloadBlinkIdSdk` - Terminates the BlinkID SDK and releases all associated resources. This method safely shuts down the SDK instance and frees any allocated memory. If the parameter `deleteCachedResources` is set to `true`, the method performs a complete cleanup, including deletion of all downloaded and cached SDK resources from the device.
- You can now configure the SDK to load resources locally instead of downloading them. Set `downloadResources` to false, and provide the local resource path using `resourceLocalFolder` (Android) and `bundleIdentifier` (iOS).
- Added support for capturing the back of US and India passports that feature a barcode
- Prevent parsing of two-line MRZ in TD1 format unless it's explicitly allowed. This will prevent false positive MRZ extraction on documents where the last line of the MRZ is covered or not fully visible

### New Documents Support
- Angola - Paper Passport
- Bahrain - Polycarbonate Passport
- Burkina Faso - Polycarbonate Passport
- Cameroon - Driver's License
- Canada, Manitoba - Metis Federation Card
- East Timor - Polycarbonate Passport
- El Salvador - Paper Passport
- Eritrea - Paper Passport
- France - Adr Certificate
- Germany - Adr Certificate
- Ghana - Voter ID
- India, Telangana - Driver's License
- Ivory Coast - Paper Passport
- Japan - Polycarbonate Passport
- Liberia - Paper Passport
- Liberia - Voter ID
- Malawi - Identity Card
- Malawi - Paper Passport
- Maldives - Polycarbonate Passport
- Mali - Paper Passport
- Mauritius - Paper Passport
- Oman - Vehicle Registration
- Paraguay - Polycarbonate Passport
- Rwanda - Driver's License
- Senegal - Driver's License
- Sierra Leone - Paper Passport
- Somalia - Paper Passport
- Switzerland - Adr Certificate
- Togo - Driver's License
- Togo - Paper Passport
- USA, Maryland - Medical Marijuana ID
- Vietnam - Paper Passport

#### New Document Versions for Supported Documents
- Chile - Polycarbonate Passport
- India - Paper Passport
- Moldova - Identity Card
- Pakistan - Identity Card
- Peru - Identity Card
- Romania - Identity Card
- Slovakia - Identity Card
- USA, California - Driver's License
- USA, California - Identity Card
- USA, New Hampshire - Identity Card
- USA, Georgia - Medical Marijuana ID
- USA, Pennsylvania - Medical Marijuana ID
- USA, South Carolina - Driver's License
- USA, South Carolina - Identity Card
- USA, Texas - Driver's License
- USA, Texas - Identity Card

##### New Segments Supported on Documents
- Switzerland, Residence Permit - `dateOfEntry`
- Hungary, Identity Card - `maidenName`, `nationality`, `sexOrGender`, `documentNumber`, `dateOfBirth`
- Greece, Identity Card - `fathersName` (Latin and Greek), `mothersName` (Latin and Greek), `personalIdNumber`, `issuingAuthority` (Greek), `municipalityOfRegistration` (Greek)
- Mexico, Voter ID - `sectionCode`, `stateCode`, `municipalityCode`, `localityCode`
- Mexico, Consular Voter ID - `stateCode`, `stateName`

##### Renamed segments
- Hungary - Identity Card - `additionalNameInformation` -> `mothersName`

### New languages
- Added 33 new languages (see full list [here](https://github.com/microblink/blinkid-android?tab=readme-ov-file#-new-languages-v76))

### Breaking changes
- Renamed the `bundleURL` to `bundleIdentifier` in `BlinkIdSdkSettings`.
- Renamed `BlinkIdUiSettings` to `BlinkIdScanningUxSettings`.

### Native platform changes
**iOS**
- The SDK was built with Xcode 26

**Android**
- Updated Kotlin to `v2.0.21` in the `blinkid-core` library. The `blinkid-ux` and `microblink-ux` libraries already used Kotlin `v2.1.20`.
- Target SDK updated to API Level 36

### Bugfixes
- Fixed issues with React Native v0.8 compatibility.
- Users are no longer forced to scan back sides of Alien and Refugee passports
- Fixed the issue with Togo ID where document number from VIZ was overriden by a wrong value from MRZ

### Other changes
- Changed default `tiltDetectionLevel` from `Off` to `Mid`

## v7.5.0

- Updated to [Android SDK v7.5.0](https://github.com/microblink/blinkid-android/releases/tag/v7.5.0) and [iOS SDK v7.5.0](https://github.com/microblink/blinkid-ios/releases/tag/v7.5.0)

### What's New
- We introduced event tracking across the SDK lifecycle, giving you deeper insights into user journeys, success rates, and drop-off points during scanning sessions. These enhanced analytics make it easier to identify optimization opportunities and ensure the best possible user experience.
- Updated detection analysis logic in case of photo mode
- Added new `parsed` result member to the BarcodeResult which indicates whether the raw barcode data was successfully parsed
- Barcode recognition is now allowed on all document classes; unparsable barcodes will be returned as raw data

### Bugfixes
- Fixed crash when the optional `BlinkIdUiSettings` parameter was not being passed to the `performScan` method.

## 7.4.0
- Updated to [Android SDK v7.4.0](https://github.com/microblink/blinkid-android/releases/tag/v7.4.0) and [iOS SDK v7.4.0](https://github.com/microblink/blinkid-ios/releases/tag/v7.4.0)

### What's new
- Improved extraction for Canada/Nunavut ID and DL by introducing error correction for "1" and "I" characters which look the same in the font used on a document

#### New Documents Support
- Canada, Newfoundland And Labrador - Identity Card
- Canada, Northwest Territories - Driver's License
- Canada, Northwest Territories - Identity Card
- Canada, Prince Edward Island - Identity Card
- Canada, Yukon - Identity Card
- Canada, Nunavut - Driver's License
- Canada, Nunavut - Identity Card
- Liberia - Identity Card
- Mali - Identity Card
- UK - Military ID

#### New Document Versions for Supported Documents
- Bahrain - Identity Card
- Canada, Yukon - Driver's License
- Canada - Weapon Permit
- Chile - Alien ID
- Chile - Identity Card
- Finland - Driver's License
- Indonesia - Driver's License
- Kosovo - Identity Card
- Latvia - Polycarbonate Passport
- Mexico, Chiapas - Driver's License
- Mexico, Ciudad de Mexico - Driver's License
- Mexico, Durango - Driver's License
- Mexico, Jalisco - Driver's License
- Sri Lanka - Driver's License
- USA, Alaska - Driver's License
- USA, New Hampshire - Driver's License
- European Union - Health Insurance Card

#### New Beta Documents Support
- Canada - Non Card Tribal ID
- Dominica - Paper Passport
- Dominica - Polycarbonate Passport
- UAE - Diplomatic ID
- USA, Georgia - Medical Marijuana ID

#### New Document Versions for Beta-Supported Documents
- Egypt - Driver's License
- Mexico, Quintana Roo - Driver's License
- Philippines - Postal ID
- Vietnam - Identity Card

#### New Segments Supported on Documents
- European Union, Health Insurance Card - `countryCode`
- Italy, Identity Card - `documentOptionalAdditionalNumber`
- France, Identity Card - `additionalNameInformation`
- UK, Asylum Request - `residencePermitType`, `remarks`
- UK, Residence Permit - `residencePermitType`, `remarks`, `certificateNumber`, `nationalInsuranceNumber`

#### Bug fixes
- Fixed issue with incorrect `DriverLicenseDetailedInfo` serialization 

## 7.2.0

The version 7 release of the BlinkID SDK.
- Updated to [Android SDK v7.2.1](https://github.com/microblink/blinkid-android/releases/tag/v7.2.1) and [iOS SDK v7.2.2](https://github.com/microblink/blinkid-ios/releases/tag/v7.2.2)
- For more information about the inital version 7 release, see the release notes for the native SDKs for [Android](https://github.com/microblink/blinkid-android/releases/tag/v7.0.0) and [iOS](https://github.com/microblink/blinkid-ios/releases/tag/v7.0.0).

- The plugin was built and tested with [React Native v0.79.0](https://github.com/facebook/react-native/releases/tag/v0.79.0)

## Breaking changes
- Starting with BlinkID v7, the NPM package has been renamed and moved from `blinkid-react-native` to `@microblink/blinkid-react-native` to improve organization and maintainability.
    - The old package `blinkid-react-native` is now **deprecated** and will no longer receive updates. To continue using the latest BlinkID features and improvements, please install the new package:
    
    ```bash
        npm install @microblink/blinkid-react-native
    ```
- BlinkID v7 is now fully written in TypeScript for improved type safety and developer experience.

- The plugin now requires:
    - iOS version 16.0 and above.
    - Android API version 24 and above.

- Method `scanWithCamera` has been renamed to `performScan`.
- Method `scanWithDirectApi` has been renamed to `performDirectApiScan`.
- Many of the older settings have been renamed to be more intuitive, for more information see the [blinkIdSettings.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts) files, and the native documentation for [Android](https://blinkid.github.io/blinkid-android/blinkid-core/com.microblink.blinkid.core/index.html) and [iOS](https://blinkid.github.io/blinkid-swift-package/documentation/blinkid/).
- See section **Version 7 plugin usage** for more details about how to use each method, and how to handle the scanned results.

## Version 7 plugin usage
**The `performScan` method**

The `performScan` method launches the BlinkID scanning process with the default UX properties.\
It takes the following parameters: 
1. BlinkID SDK settings
2. BlinkID session settings
3. The optional BlinkID UI settings
3. The optional ClassFilter object for filtering documents.

**BlinkID SDK Settings** - `BlinkIdSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.

**BlinkID Session Settings** - `BlinkIdSessionSettings`: the class that contains various settings for the scanning session. It contains the settings for the `ScanningMode` and `BlinkIdScanningSettings`, which define various parameters that control the scanning process.

**BlinkID UI Settings** - `BlinkIdUiSettings`: the class that allows customization of various aspects of the UI used during the scanning process.

The optional **ClassFilter** class - `ClassFilter`: the class which controls which documents will be accepted or reject for information extraction during the scanning session.

- The implementation of the `performScan` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx) file.

**The `performDirectApiScanning` method**

The `performDirectApiScan` method launches the BlinkID scanning process inteded for information extraction from static images.\
It takes the following parameters: 
1. BlinkID SDK settings
2. BlinkID session settings
3. First image string in the Base64 format
4. The optional second image string in the Base64 format

**BlinkID SDK Settings** - `BlinkIdSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.

**BlinkID Session Settings** - `BlinkIdSessionSettings`: the class that contains various settings for the scanning session. It contains the settings for the [ScanningMode] and [BlinkIdScanningSettings], which define various parameters that control the scanning process.

The first image Base64 string - `string`: image that represents one side of the document. If the document contains two sides and the `ScanningMode` is set to `automatic`, this should contain the image of the front side of the document. In case the `ScanningMode` is set to `single`, it can be either the front or the back side of the document. If the document contains only one side (for example, various passports), the SDK will automatically detect it, and will not look for the other side.

The optional second image Base64 string - `string`: needed if the information from back side of the document is required and the `ScanningMode` is set to `automatic`.

- The implementation of the `performDirectApiScan` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx) file.
- All of the mentioned settings can be found in the [blinkIdSettings.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts) file.

**BlinkID result**

- Both methods return the `BlinkIdScanningResult` object, which contains the results of scanning a document, including the extracted data and images from the document.

- All of the available results can be viewed in [blinkIdResult.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdResult.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts).

**Implementation guide**
- A detailed guide about the integration and usage of the plugin can be viewed [here](https://github.com/microblink/blinkid-react-native/tree/master?tab=readme-ov-file#-plugin-integration).
- The sample application which demonstrates the usage of the SDK can be found in the [App.tsx](https://github.com/microblink/blinkid-react-native/blob/master/sample_files/App.tsx) file.

## 6.13.1
- Android-specific
    - Fixed naming of the deprecated `LegacyDocumentVerificationActivity` in `AndroidManifest.xml`

## 6.13.0
- Updated the plugin to [Android SDK v6.13.0](https://github.com/microblink/blinkid-android/releases/tag/v6.13.0) and [iOS SDK v6.13.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.13.0)

**New features**
- **ClassFilter**
    - `ClassFilter` represents the document filter used to determine which documents will be processed.
    - Document information (Country, Region, Type) is evaluated with the content set in the filter, and their inclusion or exclusion depends on the defined rules.
    - The recognition results of the excluded documents will not be returned.
    - If using the standard BlinkID Overlay, an alert will be displayed that the document will not be scanned.
    - Modifying the `includeClasses` property will set the filter to scan only the set document classes. Other document classes will be rejected.
    - Modifying the `excludeClasses` property will set the filter to reject only the set document classes. Other document classes will be accepted.
        - By defult, all of the document classes are accepted.

**Expanded document coverage**
- All of the new documents & document versions can also be found in the release notes for native Android and iOS SDKs.

**Bug fixes**
- NY ID/DL: Added logic to expose the Enhanced document subtype, allowing customers to distinguish between regular and enhanced versions.
- Bolivia & Namibia ID: Resolved data match inconsistencies that were causing data match failures.
- Romanian ID: Multi side scan no longer expects blank back card of old IDs, even with skipUnsupportedBack set to false.
- Fixed backImageAnalysisResult.cardRotation not being correctly populated when scanning the wrong side of a document.
- [iOS-specific] Fixed document flip animation on the `BlinkIdOverlayViewController`

## 6.12.0

- Updated the plugin to [Android SDK v6.12.0](https://github.com/microblink/blinkid-android/releases/tag/v6.12.0) and [iOS SDK v6.12.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.12.0)

**New features**
- **Beta Feature: Second Page Passport Scanning**
     - Added support for scanning and extracting data from the second page of passports for select countries - Slovenia, Ireland, and New Zealand. 
     - When BlinkID detects one of these passports, a UI message will guide the user to the second page. 
     - By default, this feature is disabled but can be enabled via the `BlinkIdMultiSideRecognizer.scanPassportDataPageOnly` setting - if set to `false`, it will be required to scan the second page of certain passports. This feature is in beta, and your feedback is appreciated.
- USA Green Card - Enabled Data Match for the `Document Number` field, matching values from the VIZ (Visual Inspection Zone) and MRZ to further enhance extraction reliability.

**Bug fixes**
- Spain ID: Fixed an issue with indefinite expiry dates, ensuring consistent values between the MRZ and Visual Inspection Zone (VIZ).
- Bulgaria ID: Improved parsing for indefinite expiry dates in the MRZ for better accuracy.
- Netherlands ID & Norway Passport: Resolved issues with the `Personal ID number` field that were causing the data match feature to fail.
- Chinese Passport: Enhanced reliability of extracted data with additional logic for the `Document Number` field.
- German ID & Luxembourg ID: Adjusted name extraction logic to resolve issues with name separation, ensuring more consistent results.

## 6.11.1

- We have updated the plugin to [Android SDK v6.11.2](https://github.com/microblink/blinkid-android/releases/tag/v6.11.2) and [iOS SDK v6.11.1](https://github.com/microblink/blinkid-ios/releases/tag/v6.11.1)

**Bug fixes**

- NYC Municipal ID & USA Border Crossing Card 
    - Resolved an issue where the scanning process could get stuck on the back side during multi-side scanning.

## 6.11.0

- We have updated the plugin to [Android SDK v6.11.1](https://github.com/microblink/blinkid-android/releases/tag/v6.11.1) and [iOS SDK v6.11.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.11.0)

**Expanded document coverage**

- All of the new documents & document versions can also be found in the release notes for native Android and iOS SDKs.

**New features**

- **Greek Alphabet Support**
    - Added support for extracting `Place of Birth` in both Greek and Latin scripts.
- New result fields in the `BlinkIdSingleSideRecognizer` and `BlinkIdMultiSideRecognizer`
    - `manufacturingYear`, `vehicleType`, `eligibilityCategory`, `specificDocumentValidity`, `dependentsInfo`

**Bug fixes**

- Android specific
    - Removed unused `libc++_shared.so` from the SDK
    - Fix for duplicate attrs resource: `attr/mb_onboardingImageColor` when combining multiple Microblink's SDKs in the same app
    - Raised `minSdkVersion` to 23 to support React-Native v0.75

## 6.10.0

- We have updated the plugin to [Android SDK v6.10.0](https://github.com/microblink/blinkid-android/releases/tag/v6.10.0) and [iOS SDK v6.10.1](https://github.com/microblink/blinkid-ios/releases/tag/v6.10.1)

**Expanded document coverage**

- All of the new documents & document versions can also be found in the release notes for native Android and iOS SDKs.

**New features**

- ***Avoiding Double Scans of the Front Side***: For a more reliable scanning process, BlinkID now prompts users to flip the document when they scan the front side twice. This improves the overall experience and reduces the chance of mistakes.
- ***Starting with the Right Side***: If users attempt to scan the back side of a document first, BlinkID will prompt them to begin with the front side. This feature ensures that users follow the correct order, leading to a more reliable and user-friendly experience.
- Added `imageExtractionFailures` to `AdditionalProcessingInfo`
    - `imageExtractionFailures` allows tracking if any images are not visible on the presented document
    - Added  `ImageExtractionType` (`FullDocument`, `Face`, `Signature`) enum to specify the image type
- Added a new result member, `barcodeStepUsed` to BlinkID recognizers, which indicates whether the barcode scanning step was utilized during the scanning process.
- Added two new settings to BlinkID recognizers:
    - `allowBarcodeScanOnly` - allows barcode recognition to proceed even if the initial extraction fails - set to `false` by default
    - `combineFrameResults` - enables the aggregation of data from multiple frames - set to `true` by default

## 6.9.0

- We have updated the plugin to [Android SDK v6.9.0](https://github.com/microblink/blinkid-android/releases/tag/v6.9.0) and [iOS SDK v6.9.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.9.0)

**Expanded document coverage**

- All of the new documents & document versions can also be seen in the release notes from native Android and iOS SDKs.

**Custom mandatory fields**

- We’re introducing the option to define a custom set of mandatory fields. This feature allows greater flexibility in the scanning process by enabling the extraction of only the necessary information from identity documents.
- Custom mandatory fields can be set at the document level or applied universally to all document types.
- Custom mandatory fields can be set with `CustomClassRules` and `DetailedFieldType`.

**Glare and blur detection**

- We’ve introduced glare detection to BlinkID, which removes occlusion on document images caused by glare.
- We’ve raised the threshold for our blur model, making it stricter. This improvement ensures that sharper images are accepted for processing.
    - To disable the glare and blur filters, modify the `enableBlurFilter` and `enableGlareFilter` properties on the BlinkID recognizers (filters are enabled by default).
    - The strictness level can be modified to `Strict`, `Normal` and `Relaxed` on the `glareStrictnessLevel` and `blurStrictnessLevel` properties with `StrictnessLevel`.
    - To check if glare and blur are present on the document after the scanning process has finished, see glareDetected and blurDetected properties ****in ****ImageAnalysisResult.

**UI Settings**

- Real-time feedback during scanning includes a new UI message to help users position the document correctly and reduce glare and blur.
    - Check `errorGlareDetected` and `errorBlurDetected` in the `BlinkIdOverlaySettings`.
- We have added camera presets to each platform
    - Modify `AndroidCameraResolutionPreset` and `iOSCameraResolutionPreset` in `BlinkIdOverlaySettings` to change different to camera resolutions if necessary.
- Camera Legacy API - Android-specific
    - We have added `enableAndroidLegacyCameraApi` property. This setting should only be used if the new Camera2 API is not working on the device, and it should not be applied to all devices.

## 6.7.0

- We have updated the plugin to [Android SDK v6.7.0](https://github.com/microblink/blinkid-android/releases/tag/v6.7.0) and [iOS SDK v6.7.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.7.0)
- Updated the SDK with new regions and types, which can be found in the native documentation with version 6.6.0 [Android](https://github.com/microblink/blinkid-android/releases/tag/v6.6.0) and [iOS](https://github.com/microblink/blinkid-ios/releases/tag/v6.6.0)
- Added Real ID symbol detection on US driver's licenses in the `ImageAnalysisResult` class.
- Added partial anonymization of the Document Number field.
    - Anonymization can be added in `ClassAnonymizationSettings` class by additionally adding `DocumentNumberAnonymizationSettings`.
- Added `BarcodeDetectionFailed` to `ProcessingStatus`.
    - It is returned when the mandatory barcode is not present on the back of US documents.
- Added settings `showCancelButton` and `showTorchButton` in `BlinkIdOverlaySettings` with which the ‘Cancel’ and ‘Torch’ buttons in the scanning UI can be shown or hidden.
- This version of the SDK contains the native iOS `BlinkID.xcframework` with the privacy manifest file (`PrivacyInfo.xcprivacy`).
- Fixed issue with setting the SDK language for Android.

### Major API update

- We have introduced the **DirectAPI** method of scanning, which allows the SDK to extract the document information from static images without the need to use the device’s camera and our UI.
- Usage:
    - The `scanWithDirectApi` method requires four parameters:
    - `recognizerCollection`, which is a collection of Recognizers used for document scanning.
    - `frontImage`, which would represent the front image of the document in the Base64 format string
    - `backImage`,  which would represent the back image of the document in the Base64 format string
        - the `backImage` parameter is optional when using the `BlinkIdSingleSideRecognizer`, and can be passed as `null` or an empty string (`””`). 
    - `license`, the licenses for iOS and Android required to unlock the SDK
- An example of its usage can be found in the [sample application](https://github.com/microblink/blinkid-react-native/blob/master/sample_files/index.js) , both for the Multiside and Singleside scanning. 
- More information about the DirectAPI scanning can be found here in the native documentation for [Android](https://github.com/microblink/blinkid-android?tab=readme-ov-file#direct-api) and [iOS](https://github.com/microblink/blinkid-ios?tab=readme-ov-file#direct-api-processing)
- We still recommend using direct camera scanning, as static images can sometimes be in lower-quality which can cause SDK extraction error. It would be best to use the `scanWithDirectApi` method when using the device’s camera is not an option.
        
## 6.5.0

- We have updated the plugin to [Android SDK v6.5.0](https://github.com/microblink/blinkid-android/releases/tag/v6.5.0) and [iOS SDK v6.5.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.5.0)
- Added `cardOrientation` property to `ImageAnalysisResult`
- Fixed issue with the SDK localization

## 6.4.0

We have updated plugin to [Android SDK v6.4.0](https://github.com/microblink/blinkid-android/releases/tag/v6.4.0) and [iOS SDK v6.4.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.4.0)

## 6.3.0

We have updated plugin to [Android SDK v6.3.0](https://github.com/microblink/blinkid-android/releases/tag/v6.3.0) and [iOS SDK v6.3.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.3.0)

## 6.1.1

We have updated plugin to [Android SDK v6.1.2](https://github.com/microblink/blinkid-android/releases/tag/v6.1.2) and [iOS SDK v6.1.2](https://github.com/microblink/blinkid-ios/releases/tag/v6.1.2)

## 6.1.0

We have updated plugin to [Android SDK v6.1.0](https://github.com/microblink/blinkid-android/releases/tag/v6.1.0) and [iOS SDK v6.1.0](https://github.com/microblink/blinkid-ios/releases/tag/v6.1.0)

## 5.17.0

We have updated plugin to [Android SDK v5.17.0](https://github.com/microblink/blinkid-android/releases/tag/v5.17.0) and [iOS SDK v5.17.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.17.0)

## 5.16.0

We have updated plugin to [Android SDK v5.16.0](https://github.com/microblink/blinkid-android/releases/tag/v5.16.0) and [iOS SDK v5.16.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.16.0)

## 5.15.1

We have updated plugin to [Android SDK v5.15.0](https://github.com/microblink/blinkid-android/releases/tag/v5.15.0) and [iOS SDK v5.15.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.15.0)

## 5.14.0

We have updated plugin to [Android SDK v5.14.0](https://github.com/microblink/blinkid-android/releases/tag/v5.14.0) and [iOS SDK v5.14.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.14.0)

## 5.13.0

We have updated plugin to [Android SDK v5.13.0](https://github.com/microblink/blinkid-android/releases/tag/v5.13.0) and [iOS SDK v5.13.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.13.0)

## 5.12.0

We have updated plugin to [Android SDK v5.12.0](https://github.com/microblink/blinkid-android/releases/tag/v5.12.0) and [iOS SDK v5.12.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.12.0)

## 5.11.0

We have updated plugin to [Android SDK v5.11.0](https://github.com/microblink/blinkid-android/releases/tag/v5.11.0) and [iOS SDK v5.11.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.11.0)

## 5.10.0

We have updated plugin to [Android SDK v5.10.0](https://github.com/microblink/blinkid-android/releases/tag/v5.10.0) and [iOS SDK v5.10.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.10.0)

## 5.9.0

We have updated plugin to [Android SDK v5.9.0](https://github.com/microblink/blinkid-android/releases/tag/v5.9.0) and [iOS SDK v5.9.0](https://github.com/microblink/blinkid-ios/releases/tag/v5.9.0)
