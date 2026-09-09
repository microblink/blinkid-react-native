import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type {
  BarcodeModuleSettings,
  DocumentCaptureModuleSettings,
  SensitivityLevel,
  InputImageCropType,
  InputImageSelectionStrategy,
  VizModuleSettings,
} from "@microblink/blinkid-react-native";
import {
  SCANNING_MODES,
  SENSITIVITY_LEVELS,
  INPUT_IMAGE_CROP_TYPES,
  ScanningModulesConfig,
  INPUT_IMAGE_SELECTION_STRATEGIES
} from "./ScanningModulesConfig";
import { OptionalScanSettingsPanel } from "./OptionalScanSettingsPanel";
import {
  BoolSettingTile,
  DoubleSettingField,
  EnumDropdown,
  IntSettingField,
  ModuleCard,
  SectionLabel,
  SettingsCard,
} from "./SampleUiComponents";

type Props = {
  config: ScanningModulesConfig;
  onChanged: () => void;
};

export function ModuleSettingsPanel({ config, onChanged }: Props) {
  const updateDocumentCapture = (
    update: (s: DocumentCaptureModuleSettings) => void,
  ) => {
    update(config.documentCapture);
    onChanged();
  };

  const updateViz = (update: (s: VizModuleSettings) => void) => {
    update(config.viz);
    onChanged();
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Scanning modules</Text>
      <Text style={styles.hint}>
        Disabled modules are sent as null (not supported). Settings apply to all
        scan actions below.
      </Text>

      <EnumDropdown
        label="Scanning Mode"
        value={config.scanningMode}
        options={SCANNING_MODES}
        onChanged={(mode) => {
          config.scanningMode = mode;
          onChanged();
        }}
      />

      <SettingsCard
        title="Session timeouts"
        subtitle="Duration in milliseconds. Set to 0 to disable timeout."
      >
        <IntSettingField
          label="Step timeout duration"
          value={config.stepTimeoutDuration}
          min={0}
          max={600000}
          onChanged={(v) => {
            config.stepTimeoutDuration = v;
            onChanged();
          }}
        />
        <IntSettingField
          label="Inactivity timeout duration"
          value={config.inactivityTimeoutDuration}
          min={0}
          max={600000}
          onChanged={(v) => {
            config.inactivityTimeoutDuration = v;
            onChanged();
          }}
        />
      </SettingsCard>

      <SettingsCard title="UX settings" subtitle="Apply to Scan with camera.">
        <BoolSettingTile
          title="Show onboarding dialog"
          subtitle="Introduction dialog at the start of scanning"
          value={config.showOnboardingDialog}
          onChanged={(v) => {
            config.showOnboardingDialog = v;
            onChanged();
          }}
        />
      </SettingsCard>

      <BarcodeModuleCard config={config} onChanged={onChanged} />
      <DocumentCaptureModuleCard
        config={config}
        onChanged={onChanged}
        update={updateDocumentCapture}
      />
      <MrzModuleCard config={config} onChanged={onChanged} />
      <VizModuleCard config={config} onChanged={onChanged} update={updateViz} />

      <Pressable
        style={styles.resetButton}
        onPress={() => {
          config.resetToDefaults();
          onChanged();
        }}
      >
        <Text style={styles.resetText}>Reset to defaults</Text>
      </Pressable>

      <View style={styles.divider} />
      <OptionalScanSettingsPanel config={config} onChanged={onChanged} />
    </View>
  );
}

function BarcodeModuleCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  const b = config.barcode;
  const update = (fn: (s: BarcodeModuleSettings) => void) => {
    fn(config.barcode);
    onChanged();
  };

  return (
    <ModuleCard
      title="Barcode"
      subtitle={config.barcodeEnabled ? "Enabled" : "Disabled (null)"}
      enabled={config.barcodeEnabled}
      onEnabledChanged={(v) => {
        config.barcodeEnabled = v;
        onChanged();
      }}
    >
      <SectionLabel text="Presence & image" />
      <BoolSettingTile
        title="Presence mandatory"
        subtitle="Barcode must be present on scanned side(s)"
        value={b.presenceMandatory}
        onChanged={(v) => update((s) => (s.presenceMandatory = v))}
      />
      <BoolSettingTile
        title="Barcode image return"
        value={b.barcodeImageReturnEnabled}
        onChanged={(v) => update((s) => (s.barcodeImageReturnEnabled = v))}
      />
      <SectionLabel text="Document barcodes" />
      <BoolSettingTile
        title="PDF417 scanning"
        value={b.pdf417ScanningEnabled}
        onChanged={(v) => update((s) => (s.pdf417ScanningEnabled = v))}
      />
      <BoolSettingTile
        title="QR scanning"
        value={b.qrScanningEnabled}
        onChanged={(v) => update((s) => (s.qrScanningEnabled = v))}
      />
      <SectionLabel text="Retail formats" />
      <Text style={styles.retailHint}>
        Retail formats apply when document capture is disabled.
      </Text>
      <BoolSettingTile
        title="UPC-E"
        value={b.upceScanningEnabled}
        onChanged={(v) => update((s) => (s.upceScanningEnabled = v))}
      />
      <BoolSettingTile
        title="UPC-A"
        value={b.upcaScanningEnabled}
        onChanged={(v) => update((s) => (s.upcaScanningEnabled = v))}
      />
      <BoolSettingTile
        title="Code 128"
        value={b.code128ScanningEnabled}
        onChanged={(v) => update((s) => (s.code128ScanningEnabled = v))}
      />
      <BoolSettingTile
        title="Code 39"
        value={b.code39ScanningEnabled}
        onChanged={(v) => update((s) => (s.code39ScanningEnabled = v))}
      />
      <BoolSettingTile
        title="EAN-8"
        value={b.ean8ScanningEnabled}
        onChanged={(v) => update((s) => (s.ean8ScanningEnabled = v))}
      />
      <BoolSettingTile
        title="EAN-13"
        value={b.ean13ScanningEnabled}
        onChanged={(v) => update((s) => (s.ean13ScanningEnabled = v))}
      />
      <BoolSettingTile
        title="ITF"
        value={b.itfScanningEnabled}
        onChanged={(v) => update((s) => (s.itfScanningEnabled = v))}
      />
      <BoolSettingTile
        title="DataMatrix"
        value={b.dataMatrixScanningEnabled}
        onChanged={(v) => update((s) => (s.dataMatrixScanningEnabled = v))}
      />
      <BoolSettingTile
        title="Aztec"
        value={b.aztecScanningEnabled}
        onChanged={(v) => update((s) => (s.aztecScanningEnabled = v))}
      />
    </ModuleCard>
  );
}

function DocumentCaptureModuleCard({
  config,
  onChanged,
  update,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
  update: (fn: (s: DocumentCaptureModuleSettings) => void) => void;
}) {
  const d = config.documentCapture;

  return (
    <ModuleCard
      title="Document capture"
      subtitle={
        config.documentCaptureEnabled ? "Enabled" : "Disabled (null)"
      }
      enabled={config.documentCaptureEnabled}
      onEnabledChanged={(v) => {
        config.documentCaptureEnabled = v;
        onChanged();
      }}
    >
      <SectionLabel text="Images & return" />
      <BoolSettingTile
        title="Document image return"
        value={d.documentImageReturnEnabled}
        onChanged={(v) => update((s) => (s.documentImageReturnEnabled = v))}
      />
      <BoolSettingTile
        title="Input image return"
        subtitle="Increases memory usage"
        value={d.inputImageReturnEnabled}
        onChanged={(v) => update((s) => (s.inputImageReturnEnabled = v))}
      />
      <BoolSettingTile
        title="Unsupported documents allowed"
        value={d.unsupportedDocumentsAllowed}
        onChanged={(v) => update((s) => (s.unsupportedDocumentsAllowed = v))}
      />
      <BoolSettingTile
        title="Skip second side with no extractable data"
        value={d.secondSideWithNoExtractableDataSkipped}
        onChanged={(v) =>
          update((s) => (s.secondSideWithNoExtractableDataSkipped = v))
        }
      />
      <SectionLabel text="Face & passport" />
      <BoolSettingTile
        title="Face image extraction"
        value={d.faceImageExtractionEnabled}
        onChanged={(v) => update((s) => (s.faceImageExtractionEnabled = v))}
      />
      <BoolSettingTile
        title="Face image presence mandatory"
        value={d.faceImagePresenceMandatory}
        onChanged={(v) => update((s) => (s.faceImagePresenceMandatory = v))}
      />
      <BoolSettingTile
        title="Passport data page scan only"
        value={d.passportDataPageScanOnly}
        onChanged={(v) => update((s) => (s.passportDataPageScanOnly = v))}
      />
      <SectionLabel text="Image quality" />
      <SensitivityDropdown
        label="Blur sensitivity"
        value={d.blurSensitivityLevel}
        onChanged={(v) => update((s) => (s.blurSensitivityLevel = v))}
      />
      <BoolSettingTile
        title="Reject image with blur"
        value={d.imageWithBlurRejected}
        onChanged={(v) => update((s) => (s.imageWithBlurRejected = v))}
      />
      <SensitivityDropdown
        label="Glare sensitivity"
        value={d.glareSensitivityLevel}
        onChanged={(v) => update((s) => (s.glareSensitivityLevel = v))}
      />
      <BoolSettingTile
        title="Reject image with glare"
        value={d.imageWithGlareRejected}
        onChanged={(v) => update((s) => (s.imageWithGlareRejected = v))}
      />
      <SensitivityDropdown
        label="Tilt sensitivity"
        value={d.tiltSensitivityLevel}
        onChanged={(v) => update((s) => (s.tiltSensitivityLevel = v))}
      />
      <BoolSettingTile
        title="Reject poor lighting"
        value={d.imageWithPoorLightingRejected}
        onChanged={(v) => update((s) => (s.imageWithPoorLightingRejected = v))}
      />
      <BoolSettingTile
        title="Reject hand occlusion"
        value={d.imageWithHandOcclusionRejected}
        onChanged={(v) => update((s) => (s.imageWithHandOcclusionRejected = v))}
      />
      <IntSettingField
        label="Dots per inch"
        value={d.dotsPerInch}
        min={100}
        max={400}
        onChanged={(v) => update((s) => (s.dotsPerInch = v))}
      />
      <DoubleSettingField
        label="Extension factor"
        value={d.extensionFactor}
        min={0}
        max={1}
        onChanged={(v) => update((s) => (s.extensionFactor = v))}
      />
      <SectionLabel text="Direct API" />
      <CropTypeDropdown
        label="Input image crop type"
        value={d.cropType}
        onChanged={(v) => update((s) => (s.cropType = v))}
      />
      <ImageSelectionStrategyDropdown
        label="Input image selection strategy"
        value={d.inputImageSelectionStrategy}
        onChanged={(v) => update((s) => (s.inputImageSelectionStrategy = v))}
      />
      <DoubleSettingField
        label="Input image margin"
        value={d.inputImageMargin ?? 0.02}
        min={0}
        max={1}
        onChanged={(v) => update((s) => (s.inputImageMargin = v))}
      />
    </ModuleCard>
  );
}

function MrzModuleCard({
  config,
  onChanged,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
}) {
  return (
    <ModuleCard
      title="MRZ"
      subtitle={config.mrzEnabled ? "Enabled" : "Disabled (null)"}
      enabled={config.mrzEnabled}
      onEnabledChanged={(v) => {
        config.mrzEnabled = v;
        onChanged();
      }}
    >
      <BoolSettingTile
        title="Presence mandatory"
        subtitle="MRZ must be present on scanned side(s)"
        value={config.mrz.presenceMandatory}
        onChanged={(v) => {
          config.mrz.presenceMandatory = v;
          onChanged();
        }}
      />
    </ModuleCard>
  );
}

function VizModuleCard({
  config,
  onChanged,
  update,
}: {
  config: ScanningModulesConfig;
  onChanged: () => void;
  update: (fn: (s: VizModuleSettings) => void) => void;
}) {
  const v = config.viz;

  return (
    <ModuleCard
      title="VIZ"
      subtitle={config.vizEnabled ? "Enabled" : "Disabled (null)"}
      enabled={config.vizEnabled}
      onEnabledChanged={(enabled) => {
        config.vizEnabled = enabled;
        onChanged();
      }}
    >
      <BoolSettingTile
        title="Presence mandatory"
        value={v.presenceMandatory}
        onChanged={(val) => update((s) => (s.presenceMandatory = val))}
      />
      <BoolSettingTile
        title="Signature image extraction"
        value={v.signatureImageExtractionEnabled}
        onChanged={(val) =>
          update((s) => (s.signatureImageExtractionEnabled = val))
        }
      />
      <BoolSettingTile
        title="Character validation"
        value={v.characterValidationEnabled}
        onChanged={(val) => update((s) => (s.characterValidationEnabled = val))}
      />
      <BoolSettingTile
        title="Result aggregation"
        subtitle="Aggregate data from multiple frames (video only)"
        value={v.resultAggregationEnabled}
        onChanged={(val) => update((s) => (s.resultAggregationEnabled = val))}
      />
    </ModuleCard>
  );
}

function SensitivityDropdown({
  label,
  value,
  onChanged,
}: {
  label: string;
  value: SensitivityLevel;
  onChanged: (value: SensitivityLevel) => void;
}) {
  return (
    <EnumDropdown
      label={label}
      value={value}
      options={SENSITIVITY_LEVELS}
      onChanged={onChanged}
    />
  );
}

function CropTypeDropdown({
  label,
  value,
  onChanged,
}: {
  label: string;
  value: InputImageCropType;
  onChanged: (value: InputImageCropType) => void;
}) {
  return (
    <EnumDropdown
      label={label}
      value={value}
      options={INPUT_IMAGE_CROP_TYPES}
      onChanged={onChanged}
    />
  );
}

function ImageSelectionStrategyDropdown({
  label,
  value,
  onChanged,
}: {
  label: string;
  value: InputImageSelectionStrategy;
  onChanged: (value: InputImageSelectionStrategy) => void;
}) {
  return (
    <EnumDropdown
      label={label}
      value={value}
      options={INPUT_IMAGE_SELECTION_STRATEGIES}
      onChanged={onChanged}
    />
  );
}

const styles = StyleSheet.create({
  panel: { marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "600", color: "#1565C0" },
  hint: { fontSize: 12, color: "#666", marginTop: 4, marginBottom: 12 },
  retailHint: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  resetButton: { alignSelf: "flex-end", paddingVertical: 8 },
  resetText: { color: "#1565C0", fontSize: 15 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
});
