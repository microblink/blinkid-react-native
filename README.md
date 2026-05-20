<p align="center" >
  <img src="https://raw.githubusercontent.com/wiki/blinkid/blinkid-android/images/logo-microblink.png" alt="Microblink" title="Microblink">
</p>

# _BlinkID_ React Native plugin

The BlinkID SDK is a comprehensive solution for implementing secure document scanning on the React Native cross-platform.
It offers powerful capabilities for capturing and analyzing a wide range of identification documents. The Flutter plugin consists of BlinkID, which serves as the core module, and the BlinkIDUX package that provides a complete, ready-to-use solution with a user-friendly interface.

**Please note that, for maximum performance and full access to all features, it’s best to go with one of our native SDKs (for [iOS](https://github.com/microblink/blinkid-ios) or [Android](https://github.com/microblink/blinkid-android)).**

However, since the wrapper is open source, you can add the features you need on your own.


# Table of contents
- [Licensing](#licensing)
- [Requirements](#requirements)
- [Quickstart with the sample application](#quickstart-with-the-sample-application)
  - [Android sample application](#android-sample-application)
    - [On an emulator](#on-an-emulator)
    - [On a physical device via USB](#on-a-physical-device-via-usb)
  - [iOS sample application](#ios-sample-application)
- [Plugin integration](#plugin-integration)
- [Plugin usage](#plugin-usage)
- [Plugin specifics](#plugin-specifics)
  - [Scanning methods](#scanning-methods)
  - [SDK loading & unloading](#sdk-loading--unloading)
  - [BlinkID Settings](#blinkid-settings)
  - [BlinkID Results](#blinkid-results)
- [Additional information and Support](#additional-information-and-support)

## <a name="licensing"></a> Licensing
A valid license key is required to initialize the BlinkID plugin. A free trial license key can be requested after registering at the [Microblink Developer Hub](https://developer.microblink.com/).


## <a name="requirements"></a> Requirements

- BlinkID React Native was built and tested with [React Native v0.82.1](https://github.com/facebook/react-native/releases/tag/v0.82.1)
  - The BlinkID React Native SDK is also compatible with React Native applications running on the old architecture as it contains backward compatibility with Native Module implementation.
- For additional help with React-Native setup, view the official documentation [here](https://reactnative.dev/docs/set-up-your-environment).

**Device requirements**

The BlinkID React Native plugin requires:
- iOS version 16.0 and above
- Android API version 24 and above

- For more detailed information about the BlinkID Android and iOS requirements, view the native SDK documentation here ([Android](https://github.com/microblink/blinkid-android?tab=readme-ov-file#-device-requirements) & [iOS](https://github.com/microblink/blinkid-ios?tab=readme-ov-file#requirements)).

## <a name="quickstart-with-the-sample-application"></a> Quickstart with the sample application
The sample application demonstrates how the BlinkID plugin is implemented, used and shows how to obtain the scanned results. 

It contains the implementation for:
1. The **default implementation** with the default BlinkID UX scanning experience.
2. **Multiside DirectAPI scanning** - extracting the document information from multiple static images (from the gallery).
3. **Singleside DirectAPI scanning** - extracting the document information from a single static images (from the gallery).

To obtain and run the sample application, follow the steps below:
Make sure you have Node & Watchman installed before running the sample application:
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
2. Position to the obtained BlinkID folder and run the `initBlinkIdReactNativeSample.sh` script:
```bash
cd blinkid-react-native && ./initBlinkIdReactNativeSample.sh
```
3. After the script finishes running, position to the `BlinkIdSample` folder.

**Running the sample application on Android**

## <a name="android-sample-application"></a> Android sample application

### <a name="on-an-emulator"></a> On an emulator:

Simply execute the following command:

```bash
npx react-native start
```

Then in another terminal, run:

```bash
npx react-native run-android
```

**Alternative: Run directly via Android Studio:**

1. Execute the following command:
```bash
npx react-native start
```
2. Open the `android` folder via Android Studio in the `BlinkIdSample` folder to run the Android sample application.

### <a name="on-a-physical-device-via-usb"></a> On a physical device via USB:

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

## <a name="ios-sample-application"></a> iOS sample application

**Running the sample application on iOS**

1. For running the sample application on iOS, execute the following command:
```bash
npx react-native start
```
2. Open the `BlinkIdSample.xcworkspace` located in the `ios` folder
3. Set your development team
4. Press run

## <a name="plugin-integration"></a> Plugin integration

1. To add the BlinkID plugin to a React Native project, first create empty project if needed:
```bash
npx @react-native-community/cli init YourAppName --package-name YourPackageName --title YourAppTitle --version "React Native version"
```

3. Install the `@microblink/blinkid-react-native` dependency:
```bash
  npm install --save @microblink/blinkid-react-native
```

4. Android: the BlinkID library is available on Maven Central repository.

In your project root, add `mavenCentral()` repository to the repositories list, if not already present:
```bash
repositories {
    // ... other repositories
    mavenCentral()
}
```

5. iOS: position to the `ios` folder and run `pod install` to install the iOS dependency.

## <a name="plugin-usage"></a> Plugin usage
1. After the dependency has been added to the project, first add the necessary import:
```typescript
import {
  performScan,
  performDirectApiScan,
} from '@microblink/blinkid-react-native';
```
2. Add the license key, for each platform, obtained from the [Developer Hub portal](https://developer.microblink.com/):
```typescript
  const licenseKey = Platform.select({
    ios: 'your-ios-key',
    android:
      'your-android-key',
  });
```
**Default BlinkID UX**
1. Set all of the necessary BlinkID settings (SDK settings, session settings, and the scanning settings). If the mentioned settings are not modified, the default values will be used:
```typescript

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
      sessionSettings.scanningMode = ScanningMode.Automatic;
      /**
       * Create and modify the scanning settings
       */
      const scanningSettings = new BlinkIdScanningSettings();
      scanningSettings.glareDetectionLevel = DetectionLevel.Mid;
      scanningSettings.anonymizationMode = AnonymizationMode.FullResult;

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
       * Modify the BlinkID UI settings for UI customization.
       * This parameter is optional.
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
```

2. Call the `performScan` scanning method, handle the results and catch any errors:
```typescript
      /**
       * Call the performScan method, where the SDK and session settings 
       * need to be passed.
       * 
       * Here, you can also pass the optional BlinkIdUiSettings and ClassFilter
       * parameters.
       */
      await performScan(sdkSettings, sessionSettings, blinkIdScanningUxSettings) 
        .then((result: BlinkIdScanningResult) => {
          // handle the results here.
          console.log(result.firstName?.value);
        })
        .catch((error) => {
          // handle any errors here.
          console.log(`Error during scan: ${error}`);
        });
```
**BlinkID DirectAPI**
1. Set all of the necessary BlinkID settings (SDK settings, session settings, and the scanning settings). If the mentioned settings are not modified, the default values will be used:
```typescript

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
       * if the input images consist solely 
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
       * Add the Base64 string of the first side of the document
       */
      const firstImageBase64 = "your-base64-image";

      /**
       * Add the Base64 string of the second side of the document
       * This paramater is optional if only one side 
       * of the document is requred.
       */
      const secondImageBase64 = "your-base64-image";
```

2. Call the `performDirectApiScan` scanning method, handle the results and catch any errors:
```typescript
      /**
       * Call the `performDirectApiScan` method, 
       * where the SDK and session settings need to be passed,
       *  along with the Base64 images.
       */
      await performDirectApiScan(
        sdkSettings,
        sessionSettings,
        firstImageBase64,
        secondImageBase64
      )
        .then((result: BlinkIdScanningResult) => {
          //handle the results here.
          console.log(result.firstName?.value);
        })
        .catch((error) => {
          // handle any errors here.
          console.log(`Error during scan: ${error}`);
        });
```
**Note:**
- The whole integration process can be found in the sample app `App.tsx` file [here](https://github.com/microblink/blinkid-react-native/blob/master/sample_files/App.tsx).
- The settings and the results that can be used with the BlinkID plugin can be found in the paragraphs below, but also in the comments of each BlinkID TS file.

## <a name="plugin-specifics"></a> Plugin specifics
The BlinkID plugin implementation is located in the `src` folder [here](https://github.com/microblink/blinkid-react-native/tree/master/BlinkID/src), while platform-specific implementation is located in the `android` and `ios` folders.

### <a name="scanning-methods"></a> Scanning methods
Currently, the BlinkID plugin contains the two main methods of scanning: `performScan` and `performDirectApiScan`.

**The `performScan` method**

The `performScan` method launches the BlinkID scanning process with the default UX properties.\
It takes the following parameters: 
1. BlinkID SDK settings
2. BlinkID session settings
4. The optional BlinkID UI settings for UI customization.
3. The optional ClassFilter object for filtering documents.

**BlinkID SDK Settings** - `BlinkIdSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.

**BlinkID Session Settings** - `BlinkIdSessionSettings`: the class that contains various settings for the scanning session. It contains the settings for the `ScanningMode` and `BlinkIdScanningSettings`, which define various parameters that control the scanning process.

**BlinkID UI Settings** - `BlinkIdUiSettings`: the class that allows customization of various aspects of the UI used during the scanning process.

The optional **ClassFilter** class - `ClassFilter`: the class which controls which documents will be accepted or reject for information extraction during the scanning session.

- The implementation of the `performScan` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx) file.

**The `performDirectApiScan` method**

The `performDirectApiScan` method launches the BlinkID scanning process intended for information extraction from static images.\
It takes the following parameters: 
1. BlinkID SDK settings
2. BlinkID session settings
3. First image string in the Base64 format
4. The optional second image string in the Base64 format

**BlinkID SDK Settings** - `BlinkIdSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.

**BlinkID Session Settings** - `BlinkIdSessionSettings`: the class that contains various settings for the scanning session. It contains the settings for the `ScanningMode` and `BlinkIdScanningSettings`, which define various parameters that control the scanning process.

The first image Base64 string - `String`: image that represents one side of the document. If the document contains two sides and the `ScanningMode` is set to `automatic`, this should contain the image of the front side of the document. In case the `ScanningMode` is set to `single`, it can be either the front or the back side of the document. If the document contains only one side (for example, various passports), the SDK will automatically detect it, and will not look for the other side.

The optional second image Base64 string - `String`: needed if the information from back side of the document is required and the `ScanningMode` is set to `automatic`.

- The implementation of the `performDirectApiScanning` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/index.tsx) file.

### <a name="sdk-loading--unloading"></a> SDK loading & unloading
The BlinkID SDK also contains methods for loading and unloading. These methods can be called before the scanning methods (mentioned above), and are helpful to preload the neccessary resources and decrease the waiting time for the scanning session, but also to remove any resources after the scanning sessions ends.

**The `loadBlinkIdSdk` method**

The `loadBlinkIdSdk` method creates or retrieves the instance of the BlinkID SDK It initializes and loads the BlinkID SDK if it is not already loaded.

It can be called in advance to **preload** the SDK before starting a scanning session. Doing so reduces loading time for the `performScan` and `performDirectApiScan` methods, since all resources will already be available and the license verified.

If the method is not called beforehand, it will still be automatically invoked on the native platform channels when a scan starts. However, the initial scan may take longer due to resource loading and license checks.

It takes the following parameter: [BlinkIdSdkSettings](#blinkid-settings), which is explained in more details below.

**The `unloadBlinkIdSdk` method**

The `unloadBlinkIdSdk` platform method terminates the BlinkID SDK and releases all associated resources. It safely shuts down the SDK instance and frees any allocated memory.
After calling this method, you must reinitialize the SDK (by calling `loadBlinkIdSdk` or any of the scanning methods) before using it again.

If set to `true` (`false` is default), the method performs a **complete cleanup**, including deletion of all downloaded and cached SDK resources from the device.

This method is automatically called after each successful scan session.

### <a name="blinkid-settings"></a> BlinkID Settings
The BlinkID SDK contains various settings, modifying different parts of scanning process:
1. [BlinkID SDK settings](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts#L14) - `BlinkIdSdkSettings` \
These settings are used for the initialization of the BlinkID SDK.

2. [BlinkID session settings](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts#L92) - `BlinkIdSessionSettings`\
These settings represent the configuration settings for a scanning session.\
This class holds the settings related to the resources initialization, scanning mode, and specific scanning configurations that define how the scanning session should behave.

3. [BlinkID scanning settings](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts#L141) - `BlinkIdScanningSettings`\
These settings represent the configurable settings for scanning a document.`
This class defines various parameters and policies related to the scanning process, including image quality handling, data extraction and anonymization, along with options for frame processing and image extraction.

4. [BlinkID UI settings](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts#L468) - `BlinkIdUiSettings`\
Allows customization of various aspects of the UI used during the scanning process.

5. [Cropped image settings](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts#L468) - `CroppedImageSettings`\
These settings represent the image cropping settings.

**Additional notes:**

- The [blinkIdSettings.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdSettings.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts) files contains all the settings that can be modified and explains what each setting does in more detail.

- The native documentation for the above mentioned settings can be found here for [Android](https://blinkid.github.io/blinkid-android/blinkid-core/com.microblink.blinkid.core/index.html) & [iOS](https://blinkid.github.io/blinkid-swift-package/documentation/blinkid/).

- The native Kotlin & Swift implementation of all BlinkID settings can be found here for [Android](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/android/src/main/java/com/blinkidreactnative/BlinkIdDeserializationUtilities.kt) & [iOS](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/ios/BlinkIdDeserializationUtilities.swift) in the BlinkID deserialization utilities.

### <a name="blinkid-result"></a> BlinkID Results

The result of the scanning process is stored in the `BlinkIdScanningResult`. It contains the results of scanning a document, including the extracted data and images from the document.

Along with the information scanned from the document, the BlinkID also provides additional details that was obtained during the scanning process:

1. **Recognition mode**- `RecognitionMode`\
Scanning mode used to scan the current document.

2. **Document class info** - `DocumentClassInfo`\
The document class information.

3. **Data match informatoin** - `DataMatchResult`\
Info on whether the data extracted from multiple sides matches.

4. **Singleside scanning result** - `SingleSideScanningResult`\
Represents the result of scanning a single side of the document.\
Contains the data extracted from the Visual Inspection Zone, Machine Readable Zone, barcode, the input image, and the cropped document, face, and signature images.

5. **Detailed cropped image result** - `DetailedCroppedImageResult`\
Represents the result of the image crop transformation with additional details.

**Additional notes:**

- The [blinkIdResult.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/blinkIdResult.ts) and [types.ts](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/src/types.ts) files contain all the results after the scanning process finishes.

- The native documentation for the above mentioned results can be found here for [Android](https://blinkid.github.io/blinkid-android/blinkid-core/com.microblink.blinkid.core.result/index.html) & [iOS](https://blinkid.github.io/blinkid-swift-package/documentation/blinkid/blinkidscanningresult).

- The native Kotlin & Swift implementation of all BlinkID settings can be found here for [Android](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/android/src/main/java/com/blinkidreactnative/BlinkIdSerializationUtilities.kt) & [iOS](https://github.com/microblink/blinkid-react-native/blob/master/BlinkID/ios/BlinkIdSerializationUtilities.swift) in the BlinkID deserialization utilities.

## <a name="additional-information-and-support"></a> Additional information and Support
For any additional questions and information, feel free to contact us [here](https://help.microblink.com), or directly to the Support team via mail support@microblink.com.
