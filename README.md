<p align="center" >
  <img src="https://raw.githubusercontent.com/wiki/microblink/blinkid-android/images/logo-microblink.png" alt="Microblink" title="Microblink">
</p>

# _BlinkID_ React Native plugin

The BlinkID SDK is a comprehensive solution for implementing secure document scanning in React Native cross-platform applications.
It offers powerful capabilities for capturing and analyzing a wide range of identification documents. The React Native plugin wraps the native BlinkID SDK and BlinkID UX modules, providing a complete, ready-to-use scanning experience with a user-friendly interface.

**Please note that, for maximum performance and full access to all features, it’s best to go with one of our native SDKs (for [iOS](https://github.com/microblink/blinkid-ios) or [Android](https://github.com/microblink/blinkid-android)).**

However, since the wrapper is open source, you can add the features you need on your own.

> **Current version:** `@microblink/blinkid-react-native@8001.0.0` (BlinkID SDK v8001).  
> If you are upgrading from v8000, see [What's new in v8001](#whats-new-in-v8001).  
> If you are upgrading from v7.x, see [Migrating from v7.x](#migrating-from-v7x) (then apply the v8001 notes).

# Table of contents
- [Licensing](#licensing)
- [Requirements](#requirements)
- [Quickstart with the sample application](#quickstart-with-the-sample-application)
  - [Android sample application](#android-sample-application)
    - [On an emulator](#on-an-emulator)
    - [On a physical device via USB](#on-a-physical-device-via-usb)
  - [iOS sample application](#ios-sample-application)
- [Plugin integration](#plugin-integration)
  - [Android setup](#android-setup)
  - [iOS setup](#ios-setup)
  - [Permissions](#permissions)
- [Plugin usage](#plugin-usage)
  - [Imports and license key](#imports-and-license-key)
  - [Configure scanning modules](#configure-scanning-modules)
  - [Default BlinkID UX (camera scanning)](#default-blinkid-ux-camera-scanning)
  - [BlinkID DirectAPI (static images)](#blinkid-directapi-static-images)
  - [Document redaction](#document-redaction)
- [Plugin specifics](#plugin-specifics)
  - [Scanning methods](#scanning-methods)
  - [SDK loading & unloading](#sdk-loading--unloading)
  - [BlinkID settings](#blinkid-settings)
  - [BlinkID results](#blinkid-results)
- [What's new in v8001](#whats-new-in-v8001)
- [What's new in v8000](#whats-new-in-v8000)
  - [Migrating from v7.x](#migrating-from-v7x)
- [Additional information and Support](#additional-information-and-support)

## <a name="licensing"></a> Licensing
A valid license key is required to initialize the BlinkID plugin.

A free trial license key can be requested after registering at the [Microblink Developer Hub](https://developer.microblink.com/).


## <a name="requirements"></a> Requirements

BlinkID React Native v8001 was built and tested with [React Native v0.82.x](https://github.com/facebook/react-native/releases/tag/v0.82.1)
- The BlinkID React Native SDK is also compatible with React Native applications running on the old architecture as it contains backward compatibility with Native Module implementation.

For additional help with React-Native setup, view the official documentation [here](https://reactnative.dev/docs/set-up-your-environment).

**Device requirements**

The BlinkID React Native plugin requires:
- iOS version 16.0 and above
- Android API version 24 and above

For more detailed information about the BlinkID Android and iOS requirements, view the native SDK documentation here ([Android](https://github.com/microblink/blinkid-android?tab=readme-ov-file#-device-requirements) & [iOS](https://github.com/microblink/blinkid-ios?tab=readme-ov-file#requirements)).

## <a name="quickstart-with-the-sample-application"></a> Quickstart with the sample application
The sample application demonstrates how the BlinkID plugin is implemented and shows how to configure scanning modules and obtain results.

It contains the implementation for:
1. **Default BlinkID UX scanning** — camera-based scanning with configurable modules.
2. **Multiside DirectAPI scanning** — extracting document information from two static images (from the gallery).
3. **Singleside DirectAPI scanning** — extracting document information from a single static image (from the gallery).

The sample also includes a **module settings panel** where you can toggle and configure the document capture, barcode, MRZ, and VIZ modules, along with optional class filters and redaction settings.

To obtain and run the sample application, follow the steps below.
Make sure you have **Node & Watchman** installed before running the sample application:
```bash
# install Watchman
brew install watchman

# install Node
brew install node
```

**To install & run the sample application:**
1. Git clone the repository:
```bash
git clone https://github.com/microblink/blinkid-react-native.git
```
2. Position to the obtained `blinkid-react-native` folder
```bash
cd blinkid-react-native
```
3. Run the `initBlinkIdReactNativeSample.sh` script to create a sample app, with required configurations applied.
```bash
./initBlinkIdReactNativeSample.sh
```
4. After the script finishes running, position to the `BlinkIdSample` folder.

### <a name="android-sample-application"></a> Android sample application

Running the sample application on Android

#### <a name="on-an-emulator"></a> On an emulator:

1. Execute the following command:
```bash
npx react-native start
```
2. In another terminal, run:
```bash
npx react-native run-android
```

**Alternative: Run directly via Android Studio:**

1. Execute the following command:
```bash
npx react-native start
```
2. Open the `android` folder via Android Studio in the `BlinkIdSample` folder to run the Android sample application.

#### <a name="on-a-physical-device-via-usb"></a> On a physical device via USB:

1. Connect your device via USB and enable USB debugging in Developer Options.
2. Forward the Metro bundler port:
```bash
adb reverse tcp:8081 tcp:8081
```
3. Start Metro in one terminal:
```bash
npx react-native start
```
4. In another terminal, build and run on the device:
```bash
npx react-native run-android
```

or open it in Android Studio and run it on the physical device from there.

### <a name="ios-sample-application"></a> iOS sample application

Running the sample application on iOS

1. For running the sample application on iOS, execute the following command:
```bash
npx react-native start
```
2. Open the `BlinkIdSample.xcworkspace` located in the `ios` folder
3. Set your development team
4. Press run

## <a name="plugin-integration"></a> Plugin integration

1. To add the BlinkID plugin to a React Native project, first create an empty project if needed:
```bash
npx @react-native-community/cli init YourAppName --package-name YourPackageName --title YourAppTitle --version "0.82.0"
```

2. Install the `@microblink/blinkid-react-native` dependency:
```bash
npm install --save @microblink/blinkid-react-native@8001.0.0
```

3. Complete the platform-specific setup below.

### <a name="android-setup"></a> Android setup

Add **Maven Central** to your project repositories.

In `android/settings.gradle` (or your root `build.gradle`, depending on your React Native version):

```groovy
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
```

Ensure your app uses **Kotlin v2.2.21** or newer, **minSdkVersion 24** or newer, and **compileSdkVersion 36** or newer. Use the Android Gradle Plugin and Gradle versions shipped with your React Native release (for example, React Native 0.82.x uses AGP 8.12 and Gradle 9.0).

`blinkid-ux` ships its Compose-based scanning UI as a precompiled AAR, so client apps do not need to enable the Compose compiler plugin, `buildFeatures.compose`, or a Compose BOM unless they compile their own Compose code.

Set the Kotlin version in your project-level `android/build.gradle`:

```groovy
buildscript {
    ext {
        kotlinVersion = "2.2.21"
    }
}
```

The sample initialization script (`initBlinkIdReactNativeSample.sh`) contains the complete, tested Android configuration if you need a reference implementation.

### <a name="ios-setup"></a> iOS setup

1. Set the minimum iOS deployment target to **16.0** in your `ios/Podfile`:
```ruby
platform :ios, '16.0'
```

2. Install pods:
```bash
cd ios && pod install
```

The plugin ships with vendored `BlinkID.xcframework` and `BlinkIDUX.xcframework` frameworks.

### <a name="permissions"></a> Permissions

Add the required usage descriptions to your app:

**iOS** — in `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for document scanning</string>
```

If you use DirectAPI with images from the photo library, also add:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access is required for document image upload</string>
```

**Android** — camera permission is typically merged from the BlinkID UX library. If needed, add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## <a name="plugin-usage"></a> Plugin usage

**Note:** The plugin usage process can be found in the sample app `App.tsx` file [here](https://github.com/microblink/blinkid-react-native/blob/master/sample_files/App.tsx).

### <a name="imports-and-license-key"></a> Imports and license key

After adding the blinkid-react-native dependency, import the API and set your platform-specific license key:

```typescript
import { Platform } from 'react-native';
import {
  performScan,
  performDirectApiScan,
  loadBlinkIdSdk,
  unloadBlinkIdSdk,
  refreshLicenseLease,
  CountryID,
  DocumentTypeID,
  RegionID,
  type BlinkIdScanningResult,
  type BlinkIdSdkSettings,
  type BlinkIdSessionSettings,
  type BlinkIdScanningSettings,
  type BlinkIdScanningUxSettings,
} from '@microblink/blinkid-react-native';

const licenseKey = Platform.select({
  ios: 'your-ios-key',
  android: 'your-android-key',
})!;
```

All settings are **plain objects**. You do not need class constructors.

Use `CountryID` / `RegionID` / `DocumentTypeID` for class filters and redaction document filters. Nested `Country` / `Region` / `DocumentType` types (`{ id?, rawValue }`) appear only on **scan results** (`documentClassInfo`).

### <a name="configure-scanning-modules"></a> Configure scanning modules

Scanning behavior is configured through `BlinkIdScanningSettings`, which contains up to four module settings. Include only the modules you want to use — omitting a module disables it.

```typescript
const scanningSettings: BlinkIdScanningSettings = {
  // Document capture: detection, image quality, cropped images
  documentCaptureModule: {
    cropType: 'not-cropped', // camera UX must use not-cropped; see DirectAPI for cropped/unknown
    inputImageSelectionStrategy: 'balanced', // camera / video only
    documentImageReturnEnabled: true,
    faceImageExtractionEnabled: true,
    dotsPerInch: 250,
    blurSensitivityLevel: 'mid',
    imageWithBlurRejected: true,
    glareSensitivityLevel: 'mid',
    imageWithGlareRejected: true,
    passportDataPageScanOnly: true,
  },

  // MRZ extraction (passports, visas, etc.)
  mrzModule: {
    presenceMandatory: false,
  },

  // Barcode extraction (PDF417, QR, Aztec, etc.)
  barcodeModule: {
    pdf417ScanningEnabled: true,
    qrScanningEnabled: true,
    aztecScanningEnabled: false,
    barcodeImageReturnEnabled: false,
  },

  // VIZ extraction (visual fields on the document)
  vizModule: {
    signatureImageExtractionEnabled: true,
    characterValidationEnabled: true,
    resultAggregationEnabled: true,
  },
  
  // Max character mismatches allowed per field during cross-side data matching (default: 0)
  maxAllowedMismatchesPerField: 0,
};

const sessionSettings: BlinkIdSessionSettings = {
  scanningMode: 'automatic', // or 'single'
  scanningSettings,
  // Timeouts are in milliseconds. Set to 0 to disable.
  stepTimeoutDuration: 60000,       // default: 60 s
  inactivityTimeoutDuration: 10000, // default: 10 s
};
```

**Module-only scanning examples:**

- **Barcode only** — include `barcodeModule`, omit `mrzModule` and `vizModule`.
- **Document capture only** (similar to BlinkID Capture) — include only `documentCaptureModule`.

> **Note:** When using PDF417 and QR barcode scanning, enable both `pdf417ScanningEnabled` and `qrScanningEnabled` together. The analyzer treats them as a combined detection stage.

For DirectAPI with pre-cropped document images, set `documentCaptureModule.cropType` to `"cropped"` (or `"unknown"` if cropping is uncertain). Camera scanning (`performScan`) must keep `cropType: "not-cropped"`.

Module configuration helpers can be found in [ScanningModulesConfig.ts](https://github.com/microblink/blinkid-react-native/blob/master/sample_files/ScanningModulesConfig.ts).

### <a name="default-blinkid-ux-camera-scanning"></a> Default BlinkID UX (camera scanning)

```typescript
const sdkSettings: BlinkIdSdkSettings = {
  licenseKey,
  resourcesConfig: { download: true },
  // otaResourcesConfig is optional — native defaults enable OTA update checks
};

const scanningUxSettings: BlinkIdScanningUxSettings = {
  showHelpButton: true,
  showOnboardingDialog: true,
  allowHapticFeedback: true,
  preferredCamera: 'back',
};

const classFilter = {
  includeDocuments: [
    { country: CountryID.Croatia, documentType: DocumentTypeID.Id },
    { country: CountryID.USA, region: RegionID.Texas, documentType: DocumentTypeID.Dl },
  ],
};

try {
  const result: BlinkIdScanningResult = await performScan({
    sdkSettings,
    sessionSettings,
    scanningUxSettings,
    classFilter,
    // redactionSettingsResolver, // optional — see Document redaction
  });

  console.log(result.firstName?.value);
  console.log(result.documentClassInfo?.country?.id);
  console.log(result.documentClassInfo?.country?.rawValue);
  console.log(result.firstDocumentImage); // base64, if enabled
} catch (error) {
  console.log(`Error during scan: ${error}`);
}
```

### <a name="blinkid-directapi-static-images"></a> BlinkID DirectAPI (static images)

DirectAPI extracts data from Base64-encoded static images instead of using the camera UI.

- Pass **two images** with `scanningMode: 'automatic'` (front side first, back side second).
- Pass **one image** with `scanningMode: 'single'`.
- Set `documentCaptureModule.cropType` to `"cropped"` when images are already cropped and perspective-corrected, or `"unknown"` when cropping is uncertain. Use `"not-cropped"` for raw photos.

```typescript
const firstImageBase64 = 'your-base64-image';
const secondImageBase64 = 'your-base64-image'; // optional for single-side

try {
  const result = await performDirectApiScan({
    sdkSettings: {
      licenseKey,
      resourcesConfig: { download: true },
    },
    sessionSettings: {
      scanningMode: 'automatic',
      scanningSettings: {
        documentCaptureModule: {
          documentImageReturnEnabled: true,
          cropType: 'not-cropped', // or 'cropped' / 'unknown' for DirectAPI
        },
        mrzModule: {},
        barcodeModule: {
          pdf417ScanningEnabled: true,
          qrScanningEnabled: true,
          aztecScanningEnabled: false,
        },
        vizModule: {},
      },
    },
    firstImage: firstImageBase64,
    secondImage: secondImageBase64,
    // redactionSettings, // optional — see Document redaction
  });

  console.log(result.fullName?.value);
} catch (error) {
  console.log(`Error during scan: ${error}`);
}
```

### <a name="document-redaction"></a> Document redaction

Anonymization was renamed to **redaction** in v8000. For camera scanning, use a `RedactionSettingsResolver` to apply per-document redaction rules. For DirectAPI, pass a single `RedactionSettings` object.

```typescript
import { FieldType, CountryID, RegionID, DocumentTypeID, type RedactionSettingsResolver } from '@microblink/blinkid-react-native';

const redactionSettingsResolver: RedactionSettingsResolver = {
  documentRedactionList: [
    {
      mode: 'fullResult',
      fields: [FieldType.FirstName, FieldType.LastName],
      documentNumberRedactionSettings: {
        prefixDigitsVisible: 0,
        suffixDigitsVisible: 1,
      },
      redactMrzResult: false,
      redactBarcodeResult: false,
      documentFilter: {
        country: CountryID.USA,
        region: RegionID.California,
        documentType: DocumentTypeID.Id,
      },
    },
  ],
};

// Camera scanning — pass redactionSettingsResolver to performScan
await performScan({ sdkSettings, sessionSettings, redactionSettingsResolver });

// DirectAPI — pass redactionSettings to performDirectApiScan
await performDirectApiScan({
  sdkSettings,
  sessionSettings,
  firstImage: firstImageBase64,
  redactionSettings: {
    mode: 'fullResult',
    fields: [FieldType.DocumentNumber],
    redactMrzResult: false,
    redactBarcodeResult: false,
  },
});
```

Redaction modes: `none`, `imageOnly`, `resultFieldsOnly`, `fullResult`.

## <a name="plugin-specifics"></a> Plugin specifics
The BlinkID plugin implementation is located in the `src` folder [here](https://github.com/microblink/blinkid-react-native/tree/master/BlinkID/src), while platform-specific implementation is located in the `android` and `ios` folders.

### <a name="scanning-methods"></a> Scanning methods
Currently, the BlinkID plugin contains two main scanning methods: `performScan` and `performDirectApiScan`.

**The `performScan` method**

Launches the BlinkID scanning process with the default UX.

Recommended call style — single settings object:

```typescript
performScan({
  sdkSettings,           // BlinkIdSdkSettings (required)
  sessionSettings,       // BlinkIdSessionSettings (required)
  scanningUxSettings,    // BlinkIdScanningUxSettings (optional)
  classFilter,           // ClassFilter (optional)
  redactionSettingsResolver, // RedactionSettingsResolver (optional)
});
```

| Parameter | Description |
| --- | --- |
| `sdkSettings` | License key, `resourcesConfig`, optional `otaResourcesConfig`, proxy URL |
| `sessionSettings` | Scanning mode, module settings, timeouts |
| `scanningUxSettings` | Help button, onboarding dialog, haptic feedback, preferred camera |
| `classFilter` | Include/exclude documents by country, region, and type |
| `redactionSettingsResolver` | Per-document redaction rules applied before the result is finalized |

Returns `BlinkIdScanningResult` ([implementation](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx)).

**The `performDirectApiScan` method**

Extracts document information from static Base64 images.

```typescript
performDirectApiScan({
  sdkSettings,        // BlinkIdSdkSettings (required)
  sessionSettings,    // BlinkIdSessionSettings (required)
  firstImage,         // Base64 string (required)
  secondImage,        // Base64 string (optional)
  redactionSettings,  // RedactionSettings (optional)
});
```

Returns `BlinkIdScanningResult` ([implementation](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx)).

### <a name="sdk-loading--unloading"></a> SDK loading & unloading


**The `loadBlinkIdSdk` method**

Creates or retrieves the BlinkID SDK instance. Handles initialization, resource downloading, and license verification. Call in advance to reduce first-scan latency.

```typescript
await loadBlinkIdSdk({
  sdkSettings: {
    licenseKey,
    resourcesConfig: { download: true },
  },
});
```

If you do not call `loadBlinkIdSdk`, it is invoked automatically when a scan starts.

**The `unloadBlinkIdSdk` method**

Terminates the SDK and releases resources. Must reinitialize before the next scan.

```typescript
await unloadBlinkIdSdk({ deleteCachedResources: false });
```

Set `deleteCachedResources` to `true` to also delete downloaded and cached SDK resources from the device.

`unloadBlinkIdSdk` is called automatically after each successful scan session.

**The `refreshLicenseLease` method**

Refreshes the SDK license lease. Can be called periodically to maintain an active license status; the required frequency depends on your license configuration. The SDK must already be initialized (via `loadBlinkIdSdk` or a scan) before calling this method.

```typescript
await refreshLicenseLease();
```

### <a name="blinkid-settings"></a> BlinkID Settings

| Setting | Type | Description |
| --- | --- | --- |
| SDK settings | `BlinkIdSdkSettings` | License key, nested `resourcesConfig` / `otaResourcesConfig`, proxy URL |
| Session settings | `BlinkIdSessionSettings` | Scanning mode, module settings, step/inactivity timeouts (ms; `0` disables) |
| Scanning settings | `BlinkIdScanningSettings` | Module configuration (see below) |
| UX settings | `BlinkIdScanningUxSettings` | UI customization during scanning |
| Class filter | `ClassFilter` | Document include/exclude rules (`CountryID` / `RegionID` / `DocumentTypeID`) |
| Redaction | `RedactionSettings` / `RedactionSettingsResolver` | Field and image redaction |

**SDK resource settings** (`BlinkIdSdkSettings`)

| Field | Description |
| --- | --- |
| `resourcesConfig` | Base ML resource download/cache (`download`, `serviceUrl`, `localFolder`, `requestTimeout` as [`RequestTimeout`](BlinkID/src/blinkIdSettings.ts), iOS `bundleIdentifier`) |
| `otaResourcesConfig` | OTA document resources (`checkForUpdates`, `strict`, `serviceUrl`, `localFolder`, …). Optional; native defaults apply when omitted |

Do not cross-wire base and OTA hosts: base defaults to `https://models.cdn.microblink.com/resources`; OTA defaults to `https://blinkid-ota.microblink.com`.

**Scanning module settings**

| Module | Type | Key settings |
| --- |  | --- |
| Document capture | `DocumentCaptureModuleSettings` | `cropType`, `inputImageSelectionStrategy`, image quality, image return, face extraction, passport data page only |
| MRZ | `MrzModuleSettings` | `presenceMandatory` |
| Barcode | `BarcodeModuleSettings` | PDF417, QR, Aztec, retail barcode types, barcode image return |
| VIZ | `VizModuleSettings` | Signature extraction, character validation, result aggregation |

The [blinkIdSettings.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts) files contain all available settings with inline documentation.

### <a name="blinkid-results"></a> BlinkID Results

The scanning result is stored in `BlinkIdScanningResult`. It contains extracted data and images from the document.

Key result members:

1. **Document class info** — `documentClassInfo` (`DocumentClassInfo`) with nested `country` / `region` / `documentType` as `{ id?, rawValue }`
2. **Data match information** — `dataMatchResult` (`DataMatchResult`)
3. **Per-side results** — `subResults` (`SingleSideScanningResult[]`) — contains VIZ, MRZ, and barcode data per side
4. **Aggregated fields** — top-level fields such as `firstName`, `lastName`, `documentNumber`, `ethnicity`, `parentsInfo`, etc.
5. **Images** — `firstDocumentImage`, `secondDocumentImage`, `faceImage`, `signatureImage`, `firstInputImage`, `secondInputImage`, `barcodeImage`

Each `SingleSideScanningResult` contains:
- `viz` — Visual Inspection Zone data (includes `ethnicity` when available)
- `mrz` — Machine Readable Zone data
- `barcode` — Barcode data
- `documentImage`, `faceImage`, `signatureImage`, `inputImage`


Full result types: [blinkIdResult.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdResult.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts).

## <a name="whats-new-in-v8001"></a> What's new in v8001

BlinkID v8001 builds on the modular architecture from v8000 with faster document support (including OTA resources), better frame selection, DirectAPI crop handling, Aztec barcodes, and nested document class info.

Highlights for React Native:

| Area | Change |
| --- | --- |
| **SDK settings** | Flat resource fields → nested `resourcesConfig`; new optional `otaResourcesConfig` |
| **Document class info** | `country` / `region` / `documentType` are `{ id?, rawValue }` (filters still use flat `CountryID` / `RegionID` / `DocumentTypeID`) |
| **Document capture** | `inputImageCropped` → `cropType`; added `inputImageSelectionStrategy` |
| **Barcode** | `aztecScanningEnabled` |
| **Results** | `ethnicity`; `ParentInfo.fullName`; `FieldType.Ethnicity` / `ParentFullName` |

#### Migrating SDK settings from v8000

```typescript
// v8000
const sdkSettings = { licenseKey, downloadResources: true };

// v8001
const sdkSettings: BlinkIdSdkSettings = {
  licenseKey,
  resourcesConfig: { download: true },
  otaResourcesConfig: {
    checkForUpdates: true, // default
    strict: false,         // default — set true to fail init on OTA download errors
  },
};
```

| v8000 (flat) | v8001 |
| --- | --- |
| `downloadResources` | `resourcesConfig.download` |
| `resourceDownloadUrl` | `resourcesConfig.serviceUrl` |
| `resourceLocalFolder` | `resourcesConfig.localFolder` |
| `resourceRequestTimeout` | `resourcesConfig.requestTimeout` ([`RequestTimeout`](BlinkID/src/blinkIdSettings.ts), milliseconds) |
| `bundleIdentifier` | `resourcesConfig.bundleIdentifier` (iOS) |

Do **not** cross-wire hosts: base resources use `https://models.cdn.microblink.com/resources`; OTA uses `https://blinkid-ota.microblink.com`.

#### Resource download timeouts

`resourcesConfig.requestTimeout` and `otaResourcesConfig.requestTimeout` accept a [`RequestTimeout`](BlinkID/src/blinkIdSettings.ts) object (milliseconds). Omit `requestTimeout` to use native defaults (30 seconds per timeout on current BlinkID native SDKs). Omit individual fields inside `requestTimeout` to keep the native default for that timeout.

```typescript
resourcesConfig: {
  download: true,
  requestTimeout: {
    connectionTimeoutMilliseconds: 30000,
    writeTimeoutMilliseconds: 30000,
    readTimeoutMilliseconds: 30000,
  },
},

otaResourcesConfig: {
  requestTimeout: {
    connectionTimeoutMilliseconds: 30000,
    readTimeoutMilliseconds: 60000,
  }, // write timeout uses native default when omitted
},
```

#### Migrating document capture settings

```typescript
// v8000
documentCaptureModule: { inputImageCropped: true }

// v8001 — DirectAPI only for cropped/unknown
documentCaptureModule: { cropType: 'cropped' } // or 'unknown' | 'not-cropped'
```

Camera UX (`performScan`) must use `cropType: 'not-cropped'`.

#### Document class info in results

```typescript
const countryId = result.documentClassInfo?.country?.id;       // CountryID when known
const countryRaw = result.documentClassInfo?.country?.rawValue; // always set when country present
```

Full changelog (documents, bug fixes, API details): [Release notes.md](https://github.com/microblink/blinkid-react-native/blob/master/Release%20notes.md) and [platform release notes](https://docs.microblink.com/blinkid/release-notes).

## <a name="whats-new-in-v8000"></a> What's new in v8000

BlinkID v8000 introduces a **modular recognition architecture**. Instead of flat scanning settings and fallback recognition modes, extraction is driven by four independent modules that you enable and configure separately:

| Module | Purpose |
| --- | --- |
| **Document capture** | Document detection, image quality checks (blur, glare, tilt, lighting), and cropped image extraction |
| **MRZ** | Machine Readable Zone detection and parsing (passports, visas, ID cards) |
| **Barcode** | 1D/2D barcode detection and parsing (PDF417, QR, retail codes, and more) |
| **VIZ** | Visual Inspection Zone field extraction, character validation, and signature images |

Other notable changes:

- Settings are **plain TypeScript objects** (no class constructors).
- Scanning methods accept a **single settings object** (recommended) or legacy positional arguments.
- **Anonymization** has been renamed to **redaction** (`RedactionSettings`, `RedactionSettingsResolver`).
- Image return and quality settings moved from `CroppedImageSettings` into `documentCaptureModule` and `vizModule`.
- Detection levels (`DetectionLevel`) are replaced by **sensitivity levels** (`SensitivityLevel`: `off`, `low`, `mid`, `high`).
- Scanning sessions include **step** and **inactivity timeouts** on `BlinkIdSessionSettings` (milliseconds; defaults `60000` and `10000`). Set either to `0` to disable.

### <a name="migrating-from-v7x"></a> Migrating from v7.x

If you are upgrading from `@microblink/blinkid-react-native@7.x` (e.g. 7.7.0), the following changes apply.

#### Settings are plain objects

```typescript
// v7
const sdkSettings = new BlinkIdSdkSettings(licenseKey);
sdkSettings.downloadResources = true;

// v8000 (flat resource fields)
const sdkSettings = { licenseKey, downloadResources: true };

// v8001 (nested resources — preferred)
const sdkSettings = {
  licenseKey,
  resourcesConfig: { download: true },
};
```

#### Modular scanning settings

Flat v7 settings map to module settings in v8000 (still valid in v8001; use `cropType` instead of `inputImageCropped`):

| v7                                                | v8000 / v8001                                          |
|---------------------------------------------------|--------------------------------------------------------|
| `blurDetectionLevel`                              | `documentCaptureModule.blurSensitivityLevel`           |
| `glareDetectionLevel`                             | `documentCaptureModule.glareSensitivityLevel`          |
| `tiltDetectionLevel`                              | `documentCaptureModule.tiltSensitivityLevel`           |
| `skipImagesWithBlur`                              | `documentCaptureModule.imageWithBlurRejected`          |
| `skipImagesWithGlare`                             | `documentCaptureModule.imageWithGlareRejected`         |
| `croppedImageSettings.returnDocumentImage`        | `documentCaptureModule.documentImageReturnEnabled`     |
| `croppedImageSettings.returnFaceImage`            | `documentCaptureModule.faceImageExtractionEnabled`     |
| `croppedImageSettings.returnSignatureImage`       | `vizModule.signatureImageExtractionEnabled`            |
| `croppedImageSettings.dotsPerInch`                | `documentCaptureModule.dotsPerInch`                    |
| `scanCroppedDocumentImage`                        | `documentCaptureModule.cropType` (`"cropped"` / `"not-cropped"` / `"unknown"`) |
| `enableCharacterValidation`                       | `vizModule.characterValidationEnabled`                 |
| `scanPassportDataPageOnly`                        | `documentCaptureModule.passportDataPageScanOnly`       |
| `anonymizationMode`                               | Use `RedactionSettings` / `RedactionSettingsResolver`  |
| `recognitionModeFilter` / `enableBarcodeScanOnly` | Enable/disable modules explicitly                      |

Removed types: `CroppedImageSettings`, `AnonymizationMode`, `DetectionLevel`, `RecognitionMode`.

#### Method call style

```typescript
// v7 — positional arguments
await performScan(sdkSettings, sessionSettings, uxSettings, classFilter);

// v8000 / v8001 — recommended object style
await performScan({ sdkSettings, sessionSettings, scanningUxSettings: uxSettings, classFilter });
```

```typescript
// unload API
await unloadBlinkIdSdk({ deleteCachedResources: false });
```

BlinkID Android SDK requires Kotlin v2.2.21+. See [Android setup](#android-setup) for more details.

After migrating from v7 to the modular API, also apply [What's new in v8001](#whats-new-in-v8001) (nested `resourcesConfig` / OTA, `cropType`, nested class info).

For the complete native migration guide from v7, see [Migrate to v8000](https://docs.microblink.com/blinkid/migration-v8000).

## <a name="additional-information-and-support"></a> Additional information and Support
For any additional questions and information, feel free to contact us [here](https://help.microblink.com), or directly to the Support team at support@microblink.com.
