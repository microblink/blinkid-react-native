import {
  CountryID,
  DocumentTypeID,
  FieldType,
  RegionID,
  SessionPreset,
  type BarcodeModuleSettings,
  type DocumentScenario,
  type PhotoQualityProfile,
  type VideoCaptureEnvironment,
  type VideoQualityProfile,
  type BlinkIdScanningUxSettings,
  type BlinkIdSessionSettings,
  type BlinkIdScanningSettings,
  type ClassFilter,
  type OtaResourcesConfig,
  type DocumentCaptureModuleSettings,
  type MrzModuleSettings,
  type RedactionSettings,
  type RedactionSettingsResolver,
  type ScanningMode,
  type SensitivityLevel,
  type InputImageSelectionStrategy,
  type InputImageCropType,
  type VizModuleSettings,
} from "@microblink/blinkid-react-native";
import {
  hasDocumentFilterCriteria,
  uiToDocumentFilter,
  type UiDocumentFilter,
} from "./SampleFilterOptions";

/** Default OTA service URL used by the native BlinkID SDK when omitted. */
export const DEFAULT_OTA_SERVICE_URL = "https://blinkid-ota.microblink.com";

/** Manual module tuning, or a native session preset factory (v8002+). */
export type SessionPresetMode =
  | "manual"
  | (typeof SessionPreset)[keyof typeof SessionPreset];

export const SESSION_PRESET_MODES: SessionPresetMode[] = [
  "manual",
  SessionPreset.DocumentVideo,
  SessionPreset.DocumentPhoto,
  SessionPreset.StandaloneBarcode,
  SessionPreset.VerifyCapture,
];

export const DOCUMENT_SCENARIOS: DocumentScenario[] = [
  "general",
  "mrzMandatory",
  "mrzOnly",
  "barcodeOnly",
];

export const VIDEO_QUALITY_PROFILES: VideoQualityProfile[] = [
  "balanced",
  "highSpeed",
  "highAccuracy",
  "permissive",
];

export const PHOTO_QUALITY_PROFILES: PhotoQualityProfile[] = [
  "balanced",
  "highAccuracy",
  "permissive",
];

export const VIDEO_CAPTURE_ENVIRONMENTS: VideoCaptureEnvironment[] = [
  "handHeld",
  "stationary",
];

/** UI-driven scanning configuration for the BlinkID sample app. */
export class ScanningModulesConfig {
  sessionPresetMode: SessionPresetMode = "manual";
  documentScenario: DocumentScenario = "general";
  videoQuality: VideoQualityProfile = "balanced";
  photoQuality: PhotoQualityProfile = "balanced";
  videoCaptureEnvironment: VideoCaptureEnvironment = "handHeld";

  scanningMode: ScanningMode = "automatic";
  /** Milliseconds before a scanning step times out. `0` disables the timeout (default: 60000). */
  stepTimeoutDuration = 60000;
  /** Milliseconds of UI inactivity before timeout. `0` disables the timeout (default: 10000). */
  inactivityTimeoutDuration = 10000;
  showOnboardingDialog = true;
  allowScanSound = true;
  passportOnly = false;

  barcodeEnabled = true;
  barcode: BarcodeModuleSettings =
    ScanningModulesConfig.defaultBarcodeModule();

  documentCaptureEnabled = true;
  documentCapture: DocumentCaptureModuleSettings =
    ScanningModulesConfig.defaultDocumentCaptureModule();

  mrzEnabled = true;
  mrz: MrzModuleSettings = ScanningModulesConfig.defaultMrzModule();

  vizEnabled = true;
  viz: VizModuleSettings = ScanningModulesConfig.defaultVizModule();

  classFilterEnabled = false;
  classFilterInclude: UiDocumentFilter[] = [];
  classFilterExclude: UiDocumentFilter[] = [];

  redactionResolverEnabled = false;
  redactionResolverEntries: RedactionSettings[] = [
    ScanningModulesConfig.defaultRedactionSettings(),
  ];

  directApiRedactionEnabled = false;
  directApiRedaction: RedactionSettings =
    ScanningModulesConfig.defaultRedactionSettings();

  otaResourcesDownload = true;
  otaResourcesStrict = false;
  otaResourcesServiceUrl = DEFAULT_OTA_SERVICE_URL;

  static defaultBarcodeModule(): BarcodeModuleSettings {
    return {
      presenceMandatory: false,
      barcodeImageReturnEnabled: false,
      pdf417ScanningEnabled: true,
      qrScanningEnabled: true,
      upceScanningEnabled: false,
      upcaScanningEnabled: false,
      code128ScanningEnabled: false,
      code39ScanningEnabled: false,
      ean8ScanningEnabled: false,
      ean13ScanningEnabled: false,
      itfScanningEnabled: false,
      dataMatrixScanningEnabled: false,
      aztecScanningEnabled: false,
    };
  }

  static defaultDocumentCaptureModule(): DocumentCaptureModuleSettings {
    return {
      cropType: "not-cropped",
      inputImageSelectionStrategy: "balanced",
      unsupportedDocumentsAllowed: false,
      secondSideWithNoExtractableDataSkipped: true,
      passportDataPageScanOnly: true,
      faceImageExtractionEnabled: false,
      faceImagePresenceMandatory: false,
      inputImageReturnEnabled: false,
      documentImageReturnEnabled: false,
      inputImageMargin: 0.02,
      dotsPerInch: 250,
      extensionFactor: 0,
      blurSensitivityLevel: "mid",
      imageWithBlurRejected: true,
      glareSensitivityLevel: "mid",
      imageWithGlareRejected: true,
      tiltSensitivityLevel: "mid",
      imageWithPoorLightingRejected: true,
      imageWithHandOcclusionRejected: true,
    };
  }

  static defaultMrzModule(): MrzModuleSettings {
    return { presenceMandatory: false };
  }

  static defaultVizModule(): VizModuleSettings {
    return {
      presenceMandatory: false,
      signatureImageExtractionEnabled: false,
      characterValidationEnabled: true,
      resultAggregationEnabled: true,
    };
  }

  static defaultRedactionSettings(): RedactionSettings {
    return {
      mode: "fullResult",
      documentNumberRedactionSettings: {
        prefixDigitsVisible: 0,
        suffixDigitsVisible: 1,
      },
      fields: [FieldType.FirstName, FieldType.LastName],
      redactMrzResult: false,
      redactBarcodeResult: false,
      documentFilter: {
        country: CountryID.USA,
        region: RegionID.California,
        documentType: DocumentTypeID.Id,
      },
    };
  }

  toClassFilter(): ClassFilter | undefined {
    if (!this.classFilterEnabled) {
      return undefined;
    }

    const includeDocuments = this.classFilterInclude
      .filter(hasDocumentFilterCriteria)
      .map(uiToDocumentFilter);
    const excludeDocuments = this.classFilterExclude
      .filter(hasDocumentFilterCriteria)
      .map(uiToDocumentFilter);

    if (includeDocuments.length === 0 && excludeDocuments.length === 0) {
      return undefined;
    }

    const filter: ClassFilter = {};
    if (includeDocuments.length > 0) {
      filter.includeDocuments = includeDocuments;
    }
    if (excludeDocuments.length > 0) {
      filter.excludeDocuments = excludeDocuments;
    }
    return filter;
  }

  toRedactionSettingsResolver(): RedactionSettingsResolver | undefined {
    if (!this.redactionResolverEnabled || this.redactionResolverEntries.length === 0) {
      return undefined;
    }
    return { documentRedactionList: this.redactionResolverEntries };
  }

  toDirectApiRedactionSettings(): RedactionSettings | undefined {
    if (!this.directApiRedactionEnabled) {
      return undefined;
    }
    return this.directApiRedaction;
  }

  toOtaResourcesConfig(): OtaResourcesConfig {
    if (!this.otaResourcesDownload) {
      return { checkForUpdates: false };
    }

    const serviceUrl = this.otaResourcesServiceUrl.trim();

    return {
      checkForUpdates: true,
      strict: this.otaResourcesStrict,
      ...(serviceUrl.length > 0 ? { serviceUrl } : {}),
    };
  }

  toScanningSettings(): BlinkIdScanningSettings {
    return {
      barcodeModule: this.barcodeEnabled ? { ...this.barcode } : null,
      documentCaptureModule: this.documentCaptureEnabled
        ? { ...this.documentCapture }
        : null,
      mrzModule: this.mrzEnabled ? { ...this.mrz } : null,
      vizModule: this.vizEnabled ? { ...this.viz } : null,
    };
  }

  /**
   * Manual turns the four modules on with their defaults.
   * Any other preset turns them off and clears stored edits, so the scan
   * sends only the preset until a module is turned back on.
   */
  applySessionPresetMode(mode: SessionPresetMode): void {
    this.sessionPresetMode = mode;
    this.resetScanningModules(mode === "manual");
  }

  resetScanningModules(enabled: boolean): void {
    this.barcodeEnabled = enabled;
    this.barcode = ScanningModulesConfig.defaultBarcodeModule();
    this.documentCaptureEnabled = enabled;
    this.documentCapture = ScanningModulesConfig.defaultDocumentCaptureModule();
    this.mrzEnabled = enabled;
    this.mrz = ScanningModulesConfig.defaultMrzModule();
    this.vizEnabled = enabled;
    this.viz = ScanningModulesConfig.defaultVizModule();
  }

  moduleToggleSubtitle(enabled: boolean): string {
    if (enabled) {
      return "Enabled";
    }
    if (this.sessionPresetMode === "manual") {
      return "Disabled (null)";
    }
    return "Not sent; the preset applies";
  }

  /**
   * Enabled modules only. Disabled modules are omitted so a preset keeps them.
   * Sending `null` would disable that module on the preset.
   */
  toPresetScanningSettings(): BlinkIdScanningSettings | undefined {
    const settings: BlinkIdScanningSettings = {};
    if (this.barcodeEnabled) {
      settings.barcodeModule = { ...this.barcode };
    }
    if (this.documentCaptureEnabled) {
      settings.documentCaptureModule = { ...this.documentCapture };
    }
    if (this.mrzEnabled) {
      settings.mrzModule = { ...this.mrz };
    }
    if (this.vizEnabled) {
      settings.vizModule = { ...this.viz };
    }
    return Object.keys(settings).length === 0 ? undefined : settings;
  }

  toSessionSettings(): BlinkIdSessionSettings {
    const sessionSettings: BlinkIdSessionSettings = {
      stepTimeoutDuration: this.stepTimeoutDuration,
      inactivityTimeoutDuration: this.inactivityTimeoutDuration,
    };

    if (this.sessionPresetMode === "manual") {
      sessionSettings.scanningMode = this.scanningMode;
      sessionSettings.scanningSettings = this.toScanningSettings();
      return sessionSettings;
    }

    sessionSettings.sessionPreset = this.sessionPresetMode;
    const scanningSettings = this.toPresetScanningSettings();
    if (scanningSettings !== undefined) {
      sessionSettings.scanningSettings = scanningSettings;
    }

    if (this.sessionPresetMode === SessionPreset.DocumentVideo) {
      sessionSettings.documentVideoUseCase = {
        scenario: this.documentScenario,
        quality: this.videoQuality,
        captureEnvironment: this.videoCaptureEnvironment,
      };
    } else if (this.sessionPresetMode === SessionPreset.DocumentPhoto) {
      sessionSettings.documentPhotoUseCase = {
        scenario: this.documentScenario,
        quality: this.photoQuality,
      };
    }

    return sessionSettings;
  }

  toUxSettings(): BlinkIdScanningUxSettings {
    return {
      showHelpButton: true,
      showOnboardingDialog: this.showOnboardingDialog,
      allowHapticFeedback: true,
      allowScanSound: this.allowScanSound,
      preferredCamera: "back",
      passportOnly: this.passportOnly,
    };
  }

  resetToDefaults(): void {
    this.sessionPresetMode = "manual";
    this.documentScenario = "general";
    this.videoQuality = "balanced";
    this.photoQuality = "balanced";
    this.videoCaptureEnvironment = "handHeld";
    this.scanningMode = "automatic";
    this.stepTimeoutDuration = 60000;
    this.inactivityTimeoutDuration = 10000;
    this.showOnboardingDialog = true;
    this.allowScanSound = true;
    this.passportOnly = false;
    this.resetScanningModules(true);

    this.classFilterEnabled = false;
    this.classFilterInclude = [];
    this.classFilterExclude = [];
    this.redactionResolverEnabled = false;
    this.redactionResolverEntries = [
      ScanningModulesConfig.defaultRedactionSettings(),
    ];
    this.directApiRedactionEnabled = false;
    this.directApiRedaction = ScanningModulesConfig.defaultRedactionSettings();
    this.otaResourcesDownload = true;
    this.otaResourcesStrict = false;
    this.otaResourcesServiceUrl = DEFAULT_OTA_SERVICE_URL;
  }
}

export const SCANNING_MODES: ScanningMode[] = ["automatic", "single"];

export const SENSITIVITY_LEVELS: SensitivityLevel[] = [
  "off",
  "low",
  "mid",
  "high",
];

export const INPUT_IMAGE_CROP_TYPES: InputImageCropType[] = [
  "not-cropped",
  "unknown",
  "cropped",
];

export const INPUT_IMAGE_SELECTION_STRATEGIES: InputImageSelectionStrategy[] = [
  "single-image",
  "optimize-for-speed",
  "balanced",
  "optimize-for-quality"
];