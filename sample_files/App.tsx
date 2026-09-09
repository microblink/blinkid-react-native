import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from "react-native";
import {
  performScan,
  performDirectApiScan,
  refreshLicenseLease,
  type BlinkIdScanningResult,
} from "@microblink/blinkid-react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { BlinkIdResultBuilder } from "./BlinkIdResultBuilder";
import { ModuleSettingsPanel } from "./ModuleSettingsPanel";
import { ScanningModulesConfig } from "./ScanningModulesConfig";

const INITIAL_RESULT_HINT =
  'Press "Scan with camera" to scan with the default BlinkID UX.\n\n' +
  'Press "DirectAPI MultiSide" or "DirectAPI SingleSide" to scan static images.';

export default function App() {
  const modulesConfig = useRef(new ScanningModulesConfig()).current;
  const [, setConfigVersion] = useState(0);
  const onConfigChanged = () => setConfigVersion((v) => v + 1);

  const [result, setResult] = useState<string>(INITIAL_RESULT_HINT);
  const [firstCroppedImage, setFirstCroppedImage] = useState<string>();
  const [secondCroppedImage, setSecondCroppedImage] = useState<string>();
  const [faceImage, setFaceImage] = useState<string>();
  const [signatureImage, setSignatureImage] = useState<string>();
  const [firstInputImage, setFirstInputImage] = useState<string>();
  const [secondInputImage, setSecondInputImage] = useState<string>();
  const [barcodeImage, setBarcodeImage] = useState<string>();

  /// Add a valid license key, based on the platform.
  /// A valid license key can be obtained from the Microblink Developer Hub: https://developer.microblink.com
  const licenseKey = Platform.select({
    ios: "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzT0RnNU16YzBOVGN3TnpBc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PeedI+x0vxjtlmzYEtWTK+S/ovjOlhqMmCKLisYbh/LyT9QoPkwI9Tz62mq+nKcT/RYs3vDn7T3mzTjtZ+NEDX9Eoipwt6h8AEKw9ASUMpleYUQPizdpOdw9kbU08Q==",
    android:
      "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUAbGV5SkRjbVZoZEdWa1QyNGlPakUzT0RnNU16Y3hPVGMwTnpVc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PVwOW5CxXmcyT1b0xkuJj6fsRxytRnpnssH6wmeManQtKT+2J77qceytDcD+KcHUrVCGxnRxpnSbG36m9wrdrob43zbWA8md1fX6q39clBhQp3Q4dqjJcBKZ9DxlOQ==",
  })!;

  const microblinkProxyURL: string | undefined = undefined;

  const buildSdkSettings = () => {
    const otaResourcesConfig = modulesConfig.toOtaResourcesConfig();

    return {
      licenseKey,
      resourcesConfig: { download: true },
      otaResourcesConfig,
      ...(microblinkProxyURL ? { microblinkProxyURL } : {}),
    };
  };

  const logScanConfiguration = (action: string) => {
    const sessionSettings = modulesConfig.toSessionSettings();
    console.log(`[BlinkIdSample] ${action}`);
    console.log(
      `[BlinkIdSample] scanningMode: ${sessionSettings.scanningMode}`,
    );
    console.log(
      `[BlinkIdSample] stepTimeoutDuration: ${sessionSettings.stepTimeoutDuration}, ` +
        `inactivityTimeoutDuration: ${sessionSettings.inactivityTimeoutDuration}`,
    );
    console.log(
      `[BlinkIdSample] showOnboardingDialog: ${modulesConfig.showOnboardingDialog}`,
    );
    console.log(
      `[BlinkIdSample] modules enabled: ` +
        `documentCapture=${modulesConfig.documentCaptureEnabled}, ` +
        `barcode=${modulesConfig.barcodeEnabled}, ` +
        `mrz=${modulesConfig.mrzEnabled}, ` +
        `viz=${modulesConfig.vizEnabled}`,
    );
    console.log(
      `[BlinkIdSample] scanningSettings:`,
      JSON.stringify(sessionSettings.scanningSettings),
    );
    console.log(
      `[BlinkIdSample] full sessionSettings:`,
      JSON.stringify(sessionSettings),
    );
    console.log(
      `[BlinkIdSample] classFilter:`,
      JSON.stringify(modulesConfig.toClassFilter() ?? null),
    );
    console.log(
      `[BlinkIdSample] redactionSettingsResolver:`,
      JSON.stringify(modulesConfig.toRedactionSettingsResolver() ?? null),
    );
    console.log(
      `[BlinkIdSample] directApiRedaction:`,
      JSON.stringify(modulesConfig.toDirectApiRedactionSettings() ?? null),
    );
    console.log(
      `[BlinkIdSample] otaResourcesConfig:`,
      JSON.stringify(modulesConfig.toOtaResourcesConfig() ?? null),
    );
  };

  const handlePerformScan = async () => {
    try {
      logScanConfiguration("Scan with camera");
      await performScan({
        sdkSettings: buildSdkSettings(),
        sessionSettings: modulesConfig.toSessionSettings(),
        scanningUxSettings: modulesConfig.toUxSettings(),
        classFilter: modulesConfig.toClassFilter(),
        redactionSettingsResolver: modulesConfig.toRedactionSettingsResolver(),
      })
        .then((scanResult: BlinkIdScanningResult) => {
          resetImages();
          setResult(BlinkIdResultBuilder.getIdResultString(scanResult));
          setImages(scanResult);
        })
        .catch((error) => {
          setResult(`BlinkID scanning error: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`BlinkID scanning error: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiMultiSideScan = async () => {
    try {
      logScanConfiguration("DirectAPI MultiSide");
      const pickerResult = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 2,
        includeBase64: true,
      });

      if (pickerResult.didCancel) {
        return;
      }

      const assets = pickerResult.assets;
      if (
        !assets ||
        assets.length < 2 ||
        !assets[0]?.base64 ||
        !assets[1]?.base64
      ) {
        setResult(
          "Select two images. The first must be the front side, the second the back side.",
        );
        return;
      }

      await performDirectApiScan({
        sdkSettings: buildSdkSettings(),
        sessionSettings: modulesConfig.toSessionSettings(),
        firstImage: assets[0].base64,
        secondImage: assets[1].base64,
        redactionSettings: modulesConfig.toDirectApiRedactionSettings(),
      })
        .then((scanResult: BlinkIdScanningResult) => {
          resetImages();
          setResult(BlinkIdResultBuilder.getIdResultString(scanResult));
          setImages(scanResult);
        })
        .catch((error) => {
          setResult(`BlinkID scanning error: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`BlinkID scanning error: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiSingleSideScan = async () => {
    try {
      logScanConfiguration("DirectAPI SingleSide");
      const pickerResult = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (pickerResult.didCancel || !pickerResult.assets?.[0]?.base64) {
        return;
      }

      await performDirectApiScan({
        sdkSettings: buildSdkSettings(),
        sessionSettings: modulesConfig.toSessionSettings(),
        firstImage: pickerResult.assets[0].base64,
        redactionSettings: modulesConfig.toDirectApiRedactionSettings(),
      })
        .then((scanResult: BlinkIdScanningResult) => {
          resetImages();
          setResult(BlinkIdResultBuilder.getIdResultString(scanResult));
          setImages(scanResult);
        })
        .catch((error) => {
          setResult(`BlinkID scanning error: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`BlinkID scanning error: ${error}`);
      resetImages();
    }
  };

  const handleRefreshLicenseLease = async () => {
    try {
      await refreshLicenseLease();
      setResult("License lease refreshed");
    } catch (error) {
      setResult(`Error refreshing license lease: ${error}`);
    }
  };

  const showInstructions = (title: string, message: string, onOk: () => void) => {
    Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
  };

  function setImages(scanResult: BlinkIdScanningResult) {
    setFirstCroppedImage(scanResult.firstDocumentImage);
    setSecondCroppedImage(scanResult.secondDocumentImage);
    setFaceImage(scanResult.faceImage?.image);
    setSignatureImage(scanResult.signatureImage?.image);
    setFirstInputImage(scanResult.firstInputImage);
    setSecondInputImage(scanResult.secondInputImage);
    setBarcodeImage(scanResult.barcodeImage);
  }

  function resetImages() {
    setFirstCroppedImage(undefined);
    setSecondCroppedImage(undefined);
    setFaceImage(undefined);
    setSignatureImage(undefined);
    setFirstInputImage(undefined);
    setSecondInputImage(undefined);
    setBarcodeImage(undefined);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BlinkID Sample</Text>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ModuleSettingsPanel
            config={modulesConfig}
            onChanged={onConfigChanged}
          />

          <View style={styles.buttonBlock}>
            <Button title="Scan with camera" onPress={handlePerformScan} />
          </View>
          <View style={styles.buttonBlock}>
            <Button
              title="DirectAPI MultiSide"
              onPress={() =>
                showInstructions(
                  "DirectAPI MultiSide instructions",
                  "Select two images for processing.\nThe first selected image needs to be front side of the document.\nThe second image needs to be the back side of the document.",
                  handlePerformDirectApiMultiSideScan,
                )
              }
            />
          </View>
          <View style={styles.buttonBlock}>
            <Button
              title="DirectAPI SingleSide"
              onPress={() =>
                showInstructions(
                  "DirectAPI SingleSide instructions",
                  "Select one image for processing.\nThe image can be either the front or the back side of the document.",
                  handlePerformDirectApiSingleSideScan,
                )
              }
            />
          </View>
          <View style={styles.buttonBlock}>
            <Pressable onPress={handleRefreshLicenseLease}>
              <Text style={styles.secondaryButtonText}>Refresh License Lease</Text>
            </Pressable>
          </View>

          <Text style={styles.resultText}>{result}</Text>

          {firstCroppedImage ? (
            <DocumentImageContainer
              label="First document image:"
              imageUri={`data:image/jpeg;base64,${firstCroppedImage}`}
            />
          ) : null}
          {secondCroppedImage ? (
            <DocumentImageContainer
              label="Second document image:"
              imageUri={`data:image/jpeg;base64,${secondCroppedImage}`}
            />
          ) : null}
          {firstInputImage ? (
            <DocumentImageContainer
              label="First input image:"
              imageUri={`data:image/jpeg;base64,${firstInputImage}`}
            />
          ) : null}
          {secondInputImage ? (
            <DocumentImageContainer
              label="Second input image:"
              imageUri={`data:image/jpeg;base64,${secondInputImage}`}
            />
          ) : null}
          {barcodeImage ? (
            <DocumentImageContainer
              label="Barcode image:"
              imageUri={`data:image/jpeg;base64,${barcodeImage}`}
            />
          ) : null}
          {faceImage ? (
            <DocumentImageContainer
              label="Face Image:"
              imageUri={`data:image/jpeg;base64,${faceImage}`}
              compact
            />
          ) : null}
          {signatureImage ? (
            <DocumentImageContainer
              label="Signature Image:"
              imageUri={`data:image/jpeg;base64,${signatureImage}`}
              compact
            />
          ) : null}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

type DocumentImageContainerProps = {
  label: string;
  imageUri: string;
  compact?: boolean;
};

const DocumentImageContainer: React.FC<DocumentImageContainerProps> = ({
  label,
  imageUri,
  compact,
}) => (
  <View style={styles.imageBlock}>
    <Text style={styles.imageLabel}>{label}</Text>
    <Image
      source={{ uri: imageUri }}
      style={compact ? styles.imageCompact : styles.image}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#1565C0",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  buttonBlock: { marginBottom: 16 },
  resultText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  imageBlock: { alignItems: "center", marginBottom: 16 },
  imageLabel: { fontSize: 14, marginBottom: 8 },
  image: {
    width: 350,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  imageCompact: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  secondaryButtonText: {
    color: "#1565C0",
    fontSize: 15,
    textAlign: "center",
  },
});
