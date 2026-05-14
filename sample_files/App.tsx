import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";


import { BlinkIdResultBuilder } from "./BlinkIdResultBuilder";
import { launchImageLibrary } from "react-native-image-picker";

export default function App() {
  const [result, setResult] = useState<string | undefined>(
    'Press the "Perform scan" button to scan documents with the Default BlinkID UX experience.\n\nPress the "Direct API MultiSide Scan" button to extract document information from multiple static images.\n\nPress the "Direct API SingleSide Scan" button to extract document information from a single static image.'
  );

  const [firstCroppedImage, setFirstCroppedImage] = useState<
    string | undefined
  >();
  const [secondCroppedImage, setSecondCroppedImage] = useState<
    string | undefined
  >();
  const [faceImage, setFaceImage] = useState<string | undefined>();
  const [signatureImage, setSignatureImage] = useState<string | undefined>();
  const [firstInputImage, setFirstInputImage] = useState<string | undefined>();
  const [secondInputImage, setSecondInputImage] = useState<
    string | undefined
  >();
  const [barcodeInputImage, setBarcodeInputImage] = useState<
    string | undefined
  >();

  const licenseKey = Platform.select({
    ios: "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTmpJeE56QTROVE01Tnpnc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PYp8/JA4wSFGiNehLMfx8e5TtiIcdUR0YKx2/x/XlY+a10Qzw9Jsm/+aZS0QMqn14qrI6pmDxwkACGS4XkicR81ECuJIKtxe+7Tc/rLcmO2wjnFwuATJm69ERvdGDPw=",
    android:
      "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUAbGV5SkRjbVZoZEdWa1QyNGlPakUzTmpJeE56QTRNakF3TkRRc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PRpURkVPwuO0koYgtsId0UoOnkvZdrc5+ewfldLFcoG9SoE1NurAQ6fYusivk5aUxIRrbWM7ak7bZfr/Y8ud9ayh2GEgB96T6uufqumXoW22/XJDPAcU4Mp8uzbIjps=",
  })!;

  /**
   * NOTE: if needed, the SDK can be pre-loaded before the scanning session starts.
   * This will ensure that the SDK is initialized, that the resources have been obtained, and the license verified.
   * This results in reducing the loading time of the scanning sessions.
   * To do this, call the loadBlinkIdMethod:
   * loadBlinkIdSdk(new BlinkIdSdkSettings(licenseKey));
   *
   * To unload the SDK, or to be more precise, terminate the BlinkID SDK and releases all associated resources, call:
   * await unloadBlinkIdSdk(true);
   */

  const handlePerformScan = async () => {
    try {
      /**
       * Set the BlinkID SDK settings
       * Add the license key here from the code above
       */
      const sdkSettings = 
      sdkSettings.downloadResources = true;

      /**
       * Create and modify the Session Settings
       */
      const sessionSettings = new BlinkIdSessionSettings();
      sessionSettings.scanningMode = ScanningMode.Automatic;

      /**
       * Create and modify the scanning settings
       */
      const scanningSettings = new BlinkIdScanningSettings();
      scanningSettings.glareDetectionLevel = DetectionLevel.Mid;
      scanningSettings.anonymizationMode = AnonymizationMode.FullResult;
      scanningSettings.returnInputImages = true;

      /**
       * Create and modify the Image settings
       */
      const croppedImageSettings = new CroppedImageSettings();
      croppedImageSettings.returnDocumentImage = true;
      croppedImageSettings.returnFaceImage = true;
      croppedImageSettings.returnSignatureImage = true;

      /**
       * Place the image settings in the scanning settings
       */
      scanningSettings.croppedImageSettings = croppedImageSettings;

      /**
       * Place the scanning settings in the session settings
       */
      sessionSettings.scanningSettings = scanningSettings;

      /**
       * Modify BlinkID UI settings.
       * This parameter is optional
       */
      const blinkIdScanningUxSettings = new BlinkIdScanningUxSettings();
      blinkIdScanningUxSettings.showHelpButton = true;
      blinkIdScanningUxSettings.showOnboardingDialog = true;
      blinkIdScanningUxSettings.allowHapticFeedback = true;
      blinkIdScanningUxSettings.preferredCamera = PreferredCamera.Back;

      /**
       * Add the document class filter. This parameter is optional.
       */
      const classFilter = new ClassFilter();
      classFilter.includeDocuments = [
        new DocumentFilter(Country.Croatia, undefined, DocumentType.Id),
        new DocumentFilter(Country.USA, Region.Texas, DocumentType.Dl),
      ];

      /**
       * Call the performScan method, where the SDK and session settings need to be passed
       * Here, you can also pass the optional ClassFilter.
       */
      await performScan(sdkSettings, sessionSettings, blinkIdScanningUxSettings) // -> classFilter
        .then((result: BlinkIdScanningResult) => {
          //handle the results here.
          setResult(BlinkIdResultBuilder.getIdResultString(result));
          setImages(result);
        })
        .catch((error) => {
          // handle any errors here.
          setResult(`Error during scan: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`Error with setting the SDK: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiMultiSideScan = async () => {
    try {
      /**
       * Pick the first image of the document
       * Make sure it is the front side
       */
      const firstImage = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (firstImage.assets == null || !firstImage.assets[0]?.base64) {
        setResult("First image not selected or invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const firstImageBase64 = firstImage.assets[0].base64;

      /**
       * Pick the second image of the document
       * Make sure it is the back side of the document
       */
      const secondImage = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (secondImage.assets == null || !secondImage.assets[0]?.base64) {
        setResult("Second image not selected or invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const secondImageBase64 = secondImage.assets[0].base64;

      /**
       * Set the BlinkID SDK settings
       * Add the license key here from the code above
       */
      const sdkSettings = new BlinkIdSdkSettings(licenseKey);
      sdkSettings.downloadResources = true;

      /**
       * Create and modify the Session Settings
       */
      const sessionSettings = new BlinkIdSessionSettings();

      /**
       * Important: if two images are being passed, use the `Automatic`
       * scanning mode
       * if just one image is being passed, use the `Single` scanning mode.
       */
      sessionSettings.scanningMode = ScanningMode.Automatic;

      /**
       * Create and modify the scanning settings
       */
      const scanningSettings = new BlinkIdScanningSettings();
      scanningSettings.glareDetectionLevel = DetectionLevel.Mid;

      /**
       * If the input images consist solely
       * of the cropped document image, set the
       * `scanCroppedDocumentImage` to true.
       */
      // scanningSettings.scanCroppedDocumentImage = true;

      /**
       * Create and modify the Image settings
       */
      const croppedImageSettings = new CroppedImageSettings();
      croppedImageSettings.returnDocumentImage = true;
      croppedImageSettings.returnFaceImage = true;
      croppedImageSettings.returnSignatureImage = true;

      /**
       * Place the image settings in the scanning settings
       */
      scanningSettings.croppedImageSettings = croppedImageSettings;

      /**
       * Place the scanning settings in the session settings
       */
      sessionSettings.scanningSettings = scanningSettings;

      /**
       * Call the performDirectApiScan method, where the SDK and session settings need to
       * be passed, along with the Base64 images.
       */
      await performDirectApiScan(
        sdkSettings,
        sessionSettings,
        firstImageBase64,
        secondImageBase64
      )
        .then((result: BlinkIdScanningResult) => {
          setResult(BlinkIdResultBuilder.getIdResultString(result));
          setImages(result);
        })
        .catch((error) => {
          setResult(`Error during scan: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`SDK error: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiSingleSideScan = async () => {
    try {
      /**
       * Pick an image of the document
       * It can either be the front of the back side of the document
       */
      const image = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (image.assets == null || !image.assets[0]?.base64) {
        setResult("The selected image is not selected or is invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const imageBase64 = image.assets[0].base64;

      /**
       * Set the BlinkID SDK settings
       * Add the license key here from the code above
       */
      const sdkSettings = new BlinkIdSdkSettings(licenseKey);
      sdkSettings.downloadResources = true;

      /**
       * Create and modify the Session Settings
       */
      const sessionSettings = new BlinkIdSessionSettings();

      /**
       * Important: if only one image is being passed, use the `Single`
       * scanning mode
       */
      sessionSettings.scanningMode = ScanningMode.Single;

      /**
       * Create and modify the scanning settings
       */
      const scanningSettings = new BlinkIdScanningSettings();
      scanningSettings.glareDetectionLevel = DetectionLevel.Mid;
      scanningSettings.returnInputImages = true;

      /**
       * If the input images consist solely
       * of the cropped document image, set the
       * `scanCroppedDocumentImage` to true.
       */
      // scanningSettings.scanCroppedDocumentImage = true;

      /**
       * Create and modify the Image settings
       */
      const croppedImageSettings = new CroppedImageSettings();
      croppedImageSettings.returnDocumentImage = true;
      croppedImageSettings.returnFaceImage = true;
      croppedImageSettings.returnSignatureImage = true;
      /**
       * Place the image settings in the scanning settings
       */
      scanningSettings.croppedImageSettings = croppedImageSettings;

      /**
       * Place the scanning settings in the session settings
       */
      sessionSettings.scanningSettings = scanningSettings;

      /**
       * Call the performDirectApiScan method, where the SDK and session settings need to
       * be passed, along with the Base64 images.
       */
      await performDirectApiScan(sdkSettings, sessionSettings, imageBase64)
        .then((result: BlinkIdScanningResult) => {
          setResult(BlinkIdResultBuilder.getIdResultString(result));
          setImages(result);
        })
        .catch((error) => {
          setResult(`Error during DirectAPI scan: ${error}`);
          resetImages();
        });
    } catch (error) {
      setResult(`SDK error: ${error}`);
      resetImages();
    }
  };

  function setImages(result: BlinkIdScanningResult) {
    setFirstCroppedImage(result.firstDocumentImage);
    setSecondCroppedImage(result.secondDocumentImage);
    setFaceImage(result.faceImage?.image);
    setSignatureImage(result.signatureImage?.image);
    setFirstInputImage(result.firstInputImage);
    setSecondInputImage(result.secondInputImage);
    setBarcodeInputImage(result.barcodeInputImage);
  }

  function resetImages() {
    setFirstCroppedImage(undefined);
    setSecondCroppedImage(undefined);
    setFaceImage(undefined);
    setSignatureImage(undefined);
    setFirstInputImage(undefined);
    setSecondInputImage(undefined);
    setBarcodeInputImage(undefined);
  }

  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView></SafeAreaView>
        <View style={styles.spacer} />
        <Button title="Perform Scan" onPress={handlePerformScan} />
        <View style={styles.spacer} />
        <Button
          title="Direct API MultiSide Scan"
          onPress={handlePerformDirectApiMultiSideScan}
        />
        <View style={styles.spacer} />
        <Button
          title="Direct API SingleSide Scan"
          onPress={handlePerformDirectApiSingleSideScan}
        />
      </View>
      <ScrollView style={styles.resultBox}>
        <Text>{result}</Text>
      </ScrollView>

      <ScrollView style={styles.imageScroll} horizontal>
        {firstCroppedImage && (
          <DocumentImageContainer
            label="Front Document Image"
            imageUri={`data:image/jpeg;base64,${firstCroppedImage}`}
          />
        )}
        {secondCroppedImage && (
          <DocumentImageContainer
            label="Back Document Image"
            imageUri={`data:image/jpeg;base64,${secondCroppedImage}`}
          />
        )}
        {faceImage && (
          <DocumentImageContainer
            label="Face Image"
            imageUri={`data:image/jpeg;base64,${faceImage}`}
          />
        )}
        {signatureImage && (
          <DocumentImageContainer
            label="Signature Image"
            imageUri={`data:image/jpeg;base64,${signatureImage}`}
          />
        )}
        {firstInputImage && (
          <DocumentImageContainer
            label="First Input Image"
            imageUri={`data:image/jpeg;base64,${firstInputImage}`}
          />
        )}
        {secondInputImage && (
          <DocumentImageContainer
            label="Second Input Image"
            imageUri={`data:image/jpeg;base64,${secondInputImage}`}
          />
        )}
        {barcodeInputImage && (
          <DocumentImageContainer
            label="Barcode Input Image"
            imageUri={`data:image/jpeg;base64,${barcodeInputImage}`}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  spacer: {
    height: 25,
  },

  resultBox: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    maxHeight: "auto",
  },

  imageScroll: {
    marginTop: 20,
    maxHeight: 300,
  },
  imageContainer: {
    margin: 10,
    marginTop: 20,
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});

type DocumentImageContainerProps = {
  label: string;
  imageUri: string;
};

const DocumentImageContainer: React.FC<DocumentImageContainerProps> = ({
  label,
  imageUri,
}) => {
  return (
    <View style={styles.imageContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
