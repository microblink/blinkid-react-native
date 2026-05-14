import type {
  ScanningMode,
  PreferredCamera,
  DocumentCaptureModuleSettings,
  MrzModuleSettings,
  BarcodeModuleSettings,
  VizModuleSettings,
} from "./types";

/**
 *  Settings for the initialization of the BlinkID SDK.
 *
 */
export type BlinkIdSdkSettings = {
  /**
   * License key for the native SDK.
   *
   */
  licenseKey: string;

  /**
   * Optional licensee string if the provided license key is not tied to the single application ID.
   */
  licensee?: string;

  /**
   * Whether resources required for on-device image processing should be downloaded and cached
   * on first initialization of the SDK.
   *
   * If set to false, you need to package all the required
   * resources in your application's assets.
   *
   */
  downloadResources?: boolean;

  /**
   * If resources are to be downloaded, the following is the URL where the resources are hosted.
   *
   * URL: `"https://models.cdn.microblink.com/resources"`
   */
  resourceDownloadUrl?: string;

  /**
   * Local folder name where resources will be downloaded and cached.
   *
   * If resources are being downloaded, this defines the name of the folder within your
   * application's cache folder where resources will be cached.
   */
  resourceLocalFolder?: string;

  /**
   * [iOS-specific] If resources downloading is disabled, this defines the bundle of your app where the resources reside.
   *
   */
  bundleIdentifier?: string;

  /**
   * Timeout settings for resource downloads.
   *
   */
  resourceRequestTimeout?: number;
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
   * Duration in seconds before scanning step times out and is cancelled.
   *
   * If less than zero, scanning will not time out.
   * Defaults to 15000 (miliseconds)
   */
  stepTimeoutDuration: number;

  /**
   *  Duration in seconds of UI inactivity (no state change) before timeout.
   *
   * If less than or equal to zero, the inactivity timer will not fire.
   * Defaults to 10000 (10 seconds)
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
   * See {@link DocumentCaptureModuleSettings} for more information.
   */
  documentCaptureModule: Partial<DocumentCaptureModuleSettings>;

  /*
   * Settings for the MRZ (Machine Readable Zone) extraction module.
   *
   * This module is dedicated to the detection and parsing of machine-readable
   * zone typically found on passports, visas, and identity cards.
   *
   * See {@link MrzModuleSettings} for more information.
   */
  mrzModule: Partial<MrzModuleSettings>;

  /**
   * Settings for the barcode extraction module.
   *
   * This module manages the detection and data extraction from various 1D and 2D
   * barcode formats (such as PDF417, QR codes, and various retail codes).
   *
   * It can operate as a standalone module or in combination with document capture.
   *
   * See {@link BarcodeModuleSettings} for more information.
   */
  barcodeModule: Partial<BarcodeModuleSettings>;

  /**
   * Settings for the VIZ (Visual Inspection Zone) extraction module.
   *
   * This module is responsible for extracting data from the document's
   * visual fields.
   *
   * It supports features such as character validation for increased accuracy,
   * signature image extraction, and data aggregation across multiple video frames.
   *
   * See {@link VizModuleSettings} for more information.
   */
  vizModule: Partial<VizModuleSettings>;

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
   * Default: {@link PrefferedCamera.back}
   */
  preferredCamera: PreferredCamera;
}>;
