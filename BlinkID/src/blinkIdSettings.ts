import type {
  ScanningMode,
  PreferredCamera,
  DocumentCaptureModuleSettings,
  MrzModuleSettings,
  BarcodeModuleSettings,
  VizModuleSettings,
} from "./types";

/**
 * Network timeouts for SDK resource downloads. Values are in milliseconds.
 * Omit unset fields to keep the native SDK default for that timeout (30 seconds
 * on current BlinkID native SDKs).
 */
export type RequestTimeout = {
  connectionTimeoutMilliseconds?: number;
  writeTimeoutMilliseconds?: number;
  readTimeoutMilliseconds?: number;
};

/**
 * Configuration for base (non-OTA) SDK resources: download, cache location, and timeouts.
 *
 * Maps to native `ResourcesConfig` on Android and `ResourcesConfig` /
 * `resourcesConfiguration` on iOS.
 *
 * When omitted on {@link BlinkIdSdkSettings}, the native SDK defaults are used
 * (`download: true`, platform default `serviceUrl` / `localFolder`, default timeouts).
 *
 * @example
 * ```ts
 * const sdkSettings: BlinkIdSdkSettings = {
 *   licenseKey,
 *   resourcesConfig: { download: true },
 * };
 * ```
 */
export type ResourcesConfig = {
  /**
   * Whether resources required for on-device image processing should be downloaded
   * and cached on first initialization of the SDK.
   *
   * If `false`, package the required resources in the app (Android assets /
   * iOS bundle) and set {@link localFolder} / {@link bundleIdentifier} as needed.
   *
   * Default: `true`.
   */
  download?: boolean;

  /**
   * URL where base resources are hosted when {@link download} is enabled.
   *
   * Default: `"https://models.cdn.microblink.com/resources"`.
   *
   * Do not use the OTA host (`https://blinkid-ota.microblink.com`) here.
   */
  serviceUrl?: string;

  /**
   * Folder name under the app cache (download enabled) or assets path (download
   * disabled) where base resources are stored.
   *
   * Platform defaults when omitted:
   * - Android: `"microblink/blinkid"`
   * - iOS: `"MLModels"`
   *
   * Keep this separate from the OTA resources folder.
   */
  localFolder?: string;

  /**
   * Network timeouts for resource downloads, in milliseconds.
   * Omit to use native SDK defaults.
   */
  requestTimeout?: RequestTimeout;

  /**
   * [iOS] Bundle identifier of the app bundle that contains prebundled resources
   * when {@link download} is `false`.
   *
   * Maps to native `ResourcesConfig.bundleUrl` (the bridge resolves the
   * identifier to a bundle URL). Ignored on Android — use {@link localFolder}
   * under assets instead.
   */
  bundleIdentifier?: string;
};

/**
 * Configuration for over-the-air (OTA) document resources.
 *
 * Behaves similarly to {@link ResourcesConfig}, with update checks and a
 * `strict` failure mode. Maps to native `OtaResourcesConfig` on Android and
 * `OTAResourcesConfig` / `otaResourcesConfiguration` on iOS.
 *
 * When omitted on {@link BlinkIdSdkSettings}, native `OtaResourcesConfig()` /
 * `OTAResourcesConfig()` defaults apply (`checkForUpdates: true`,
 * `strict: false`, platform default URL/folder).
 *
 * Do not cross-wire hosts or folders with {@link ResourcesConfig}:
 * - OTA default URL: `"https://blinkid-ota.microblink.com"`
 * - Base resources URL: `"https://models.cdn.microblink.com/resources"`
 *
 * @example
 * ```ts
 * const sdkSettings: BlinkIdSdkSettings = {
 *   licenseKey,
 *   otaResourcesConfig: { checkForUpdates: true, strict: false },
 * };
 * ```
 */
export type OtaResourcesConfig = {
  /**
   * Whether the SDK checks for and downloads updated OTA resources on
   * initialization.
   *
   * When `false`, no update check is performed and cached/bundled OTA resources
   * are used as-is. First-run downloads are still required when OTA resources
   * are missing locally — this flag only suppresses update checks, not the
   * initial fetch.
   *
   * Default: `true`.
   */
  checkForUpdates?: boolean;

  /**
   * How to handle a failed OTA update download during initialization.
   * Only applied when {@link checkForUpdates} is `true`.
   *
   * - `false` (default): initialization continues and the SDK falls back to
   *   cached/bundled OTA resources.
   * - `true`: SDK initialization fails if the OTA download fails. Callers must
   *   handle that error path.
   */
  strict?: boolean;

  /**
   * URL of the OTA versions/download service used when {@link checkForUpdates}
   * is `true`.
   *
   * Default: `"https://blinkid-ota.microblink.com"`.
   *
   * Do not use the base resources host (`https://models.cdn.microblink.com/resources`) here.
   */
  serviceUrl?: string;

  /**
   * Folder where OTA resources are downloaded and cached (or found when
   * prebundled).
   *
   * Platform defaults when omitted:
   * - Android: `"microblink/blinkid/ota"`
   * - iOS: `"OTAMLModels"`
   *
   * Keep this separate from {@link ResourcesConfig.localFolder}.
   */
  localFolder?: string;

  /**
   * Network timeouts for OTA resource downloads, in milliseconds.
   * Omit to use native SDK defaults.
   */
  requestTimeout?: RequestTimeout;

  /**
   * [iOS] Bundle identifier of the app bundle that contains prebundled OTA
   * resources.
   *
   * Maps to native `OTAResourcesConfig.bundleUrl` (the bridge resolves the
   * identifier to a bundle URL). Ignored on Android — place OTA assets under
   * {@link localFolder} (e.g. `assets/microblink/blinkid/ota`) instead.
   */
  bundleIdentifier?: string;
};

/**
 * Settings for the initialization of the BlinkID SDK.
 */
export type BlinkIdSdkSettings = {
  /**
   * License key for the native SDK.
   */
  licenseKey: string;

  /**
   * Optional licensee string if the provided license key is not tied to a single
   * application ID.
   */
  licensee?: string;

  /**
   * Base resource download and cache configuration.
   *
   * Replaces the former flat fields `downloadResources`, `resourceDownloadUrl`,
   * `resourceLocalFolder`, `resourceRequestTimeout`, and `bundleIdentifier`.
   *
   * When omitted, native `ResourcesConfig()` defaults apply.
   *
   * @see {@link ResourcesConfig}
   */
  resourcesConfig?: ResourcesConfig;

  /**
   * Over-the-air (OTA) resource download and cache configuration.
   *
   * When omitted, native OTA defaults apply (update checks enabled, non-strict).
   *
   * @see {@link OtaResourcesConfig}
   */
  otaResourcesConfig?: OtaResourcesConfig;

  /**
   * Set a custom HTTPS URL to be used as a proxy for Ping and license checks.
   * The proxy URL will be applied only if the license has the appropriate rights.
   *
   * The URL must use the HTTPS protocol. Example: https://your-proxy.com/
   *
   * If this value is defined, SDK initialization will not be successful in the following cases:
   *    - if the URL does not use HTTPS or if the URL is invalid
   *    - if the license does not allow proxy usage
   *
   */
  microblinkProxyURL?: string;
};

/**
 * Represents the configuration settings for a scanning session.
 *
 * This class holds the settings related to the resources initialization,
 * scanning mode, and specific scanning configurations that define how the scanning
 * session should behave.
 */
export type BlinkIdSessionSettings = Partial<{
  /**
   * The scanning mode to be used during the scanning session.
   *
   * Specifies whether the scanning is for a single side of a document or multiple
   * sides, as defined in {@link ScanningMode}. The default is set to `automatic`, which
   * automatically determines the number of sides to scan.
   *
   */
  scanningMode: ScanningMode;

  /**
   * The specific scanning settings for the scanning session.
   *
   * Defines various parameters that control the scanning process.
   */
  scanningSettings: Partial<BlinkIdScanningSettings>;

  /**
   * Duration in milliseconds before a scanning step times out and is cancelled.
   *
   * Resets on side changes and pauses while onboarding or help dialogs are shown.
   * Set to `0` to disable the step timeout. Defaults to `60000` (60 seconds).
   */
  stepTimeoutDuration: number;

  /**
   * Duration in milliseconds of UI inactivity (no state change) before timeout.
   *
   * Resets whenever the UI state changes (reticle type or message).
   * Set to `0` to disable the inactivity timeout. Defaults to `10000` (10 seconds).
   */
  inactivityTimeoutDuration: number;
}>;

/**
 * Represents the configurable settings for scanning a document.
 *
 * This class defines various parameters and policies related to the scanning
 * process, including image quality handling, data extraction and anonymization,
 * along with options for frame processing and image extraction.
 *
 *  */
export type BlinkIdScanningSettings = Partial<{
  /*
   * Settings for the document capture module.
   *
   * This module is responsible for the initial document detection, image extraction
   * (such as face and document images), and image quality validation (blur, glare,
   * and lighting checks).
   *
   * Set to `null` to disable this module.
   *
   * See {@link DocumentCaptureModuleSettings} for more information.
   */
  documentCaptureModule: Partial<DocumentCaptureModuleSettings> | null;

  /*
   * Settings for the MRZ (Machine Readable Zone) extraction module.
   *
   * This module is dedicated to the detection and parsing of machine-readable
   * zone typically found on passports, visas, and identity cards.
   *
   * Set to `null` to disable this module.
   *
   * See {@link MrzModuleSettings} for more information.
   */
  mrzModule: Partial<MrzModuleSettings> | null;

  /**
   * Settings for the barcode extraction module.
   *
   * This module manages the detection and data extraction from various 1D and 2D
   * barcode formats (such as PDF417, QR codes, and various retail codes).
   *
   * It can operate as a standalone module or in combination with document capture.
   *
   * Set to `null` to disable this module.
   *
   * See {@link BarcodeModuleSettings} for more information.
   */
  barcodeModule: Partial<BarcodeModuleSettings> | null;

  /**
   * Settings for the VIZ (Visual Inspection Zone) extraction module.
   *
   * This module is responsible for extracting data from the document's
   * visual fields.
   *
   * It supports features such as character validation for increased accuracy,
   * signature image extraction, and data aggregation across multiple video frames.
   *
   * Set to `null` to disable this module.
   *
   * See {@link VizModuleSettings} for more information.
   */
  vizModule: Partial<VizModuleSettings> | null;

  /**
   * The maximum allowed mismatches per field during data matching.
   *
   * Configures the maximum number of characters per field that can be inconsistent during data matching.
   *
   * By default, no mismatches are allowed.
   */
  maxAllowedMismatchesPerField: number;
}>;

/**
 * Allows customization of various aspects of the UI
 * used during the scanning process.
 *
 */
export type BlinkIdScanningUxSettings = Partial<{
  /**
   * A boolean indicating whether to show a help button
   * and enable help screens during the scanning session.
   *
   * Default: `true`
   */
  showHelpButton: boolean;

  /**
   * A boolean indicating whether to show an onboarding dialog
   * at the beginning of the scanning session.
   *
   * Default: `true`
   */
  showOnboardingDialog: boolean;
  /**
   * Determines whether haptic feedback is played for scanning-related events.
   *
   * When enabled, haptic responses are generated during scanning activities,
   * such as detection updates or user interactions (e.g., toggling the flashlight).
   *
   * When disabled, no haptic feedback is produced.
   * Default: `true`
   */
  allowHapticFeedback: boolean;

  /**
   * The preferred camera position to use when capturing document.
   *
   * This value represents the user’s choice of front or back camera.
   * The system determines the actual physical camera device.
   *
   * Default: {@link PreferredCamera.back}
   */
  preferredCamera: PreferredCamera;
}>;
