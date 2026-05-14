import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * The implementation of `blinkid-react-native` that uses method channels.
 *
 * Here, the {@link TurboModule} exposes the appropriate native BlinkID module as a React-Native module,
 * based on the detected platform: Android or iOS.
 *
 * The Turbo Module contains the functions `performScan` and `performDirectApiScan` which enable the BlinkID scanning process, with the default UX properties, and with static images.
 */
export interface Spec extends TurboModule {
  /**  The `loadBlinkIdSdk` Turbo Module method creates or retrieves the instance of the BlinkID SDK.
   *
   * Initializes and loads the BlinkID SDK if it is not already loaded.
   *
   * This method handles:
   * - SDK initialization
   * - Resource downloading
   * - License verification
   *
   * It ensures that only one SDK instance exists at any time.
   *
   * You can call this method in advance to **preload** the SDK before starting a scanning session.
   * Doing so reduces loading time for the {@link performScan} and {@link performDirectApiScan} methods,
   * since all resources will already be available and the license verified.
   *
   * If you do not call this method beforehand, it will still be automatically invoked on the native platform channels
   * when a scan starts. However, the initial scan may take longer due to resource loading and license checks.
   *
   * @param blinkIdSdkSettings - {@link BlinkIdSdkSettings} - the class that contains all of the available SDK settings.
   * It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.
   *
   * To obtain a valid license key, please visit https://developer.microblink.com/ or contact us directly at https://help.microblink.com.
   */
  loadBlinkIdSdk(blinkIdSdkSettings: string): Promise<void>;

  /**
   * The `unloadBlinkIdSdk` method terminates the BlinkID SDK and releases all associated resources.
   *
   * This method safely shuts down the SDK instance and frees any allocated memory.
   * After calling this method, you must reinitialize the SDK (by calling {@link loadBlinkIdSdk}
   * or any of the scanning methods) before using it again.
   *
   * This method is automatically called after each successful scan session.
   *
   * @param deleteCachedResources - if set to `true` (`false` is default), the method performs a **complete cleanup**,
   * including deletion of all downloaded and cached SDK resources from the device.
   */
  unloadBlinkIdSdk(deleteCachedResources: boolean): Promise<void>;

  /**
   * The `performScan` Turbo Module method launches the BlinkID scanning process with the default UX properties.
   *
   * It takes the following parameters: `BlinkIdSdkSettings`, `BlinkIdSessionSettings` and the optional `ClassFilter` class.
   *
   * @param blinkIdSdkSettings - BlinkID SDK Settings - the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK
   * needs for the scanning process, should be obtained.
   * To obtain a valid license key, please visit https://developer.microblink.com/ or contact us directly at https://help.microblink.com.
   *
   * @param blinkIdSessionSettings - BlinkID Session Settings - the class that contains various settings for the scanning session. It contains the settings for the {@link ScanningMode} and
   * {@link BlinkIdScanningSettings}, which define various parameters that control the scanning process.
   *
   * @param blinkIdUiSettings - BlinkID Scanning UX Settings - the class that allows customization of various aspects of the UI & UX used during the scanning process.
   *
   * @param classFilter - The optional `ClassFilter` class - the class which controls which documents will be accepted or reject for information extraction during the scanning session.
   * See {@link ClassFilter} for more implementation information.
   *
   * @param redactionSettingsResolver - The optional Redaction Settings Resolver- Represents the document redaction settings. Use this when need per-document redaction behavior is neede — for example,
   * anonymizing different fields depending on the document's country or type.
   *
   * The resolver is invoked by the SDK immediately before the scanning result is finalized.
   * See {@link RedactionSettingsResolver} for more implementation information.
   *
   * @returns `BlinkIdScanningResult` - BlinkID scanning result - Represents the results of scanning a document.
   * This class contains the results of scanning a document, including the extracted data and images from the document.
   *
   */
  performScan(
    blinkIdSdkSettings: string,
    blinkIdSessionSettings: string,
    blinkIdScanningUxSettings?: string,
    classFilter?: string,
    redactionSettingsResolver?: string,
  ): Promise<string>;

  /**
   * The `performDirectApiScan` platform channel method launches the BlinkID scanning process inteded for information extraction from static images.
   *
   * It takes the following parameters: `BlinkIdSdkSettings`, `BlinkIdSessionSettings`, `firstImage` string in the Base64 format and the optional `secondImage` string in the Base64 format.
   *
   * @param blinkIdSdkSettings - BlinkID SDK Settings - the class that contains all of the available SDK settings. It contains settings for the license key, and how the models, that the SDK needs for the scanning process, should be obtained.
   *
   * @param blinkIdSessionSettings - BlinkID Session Settings - the class that contains various settings for the scanning session. It contains the settings for the `ScanningMode` and `BlinkIdScanningSettings`, which define various parameters that control the scanning process.
   *
   * @param redactionSettings - The optional Redaction settings - Represents the document redaction settings. Use this when need per-document redaction behavior is neede — for example,
   * anonymizing different fields depending on the document's country or type.
   *
   * @param firstImage - The `firstImage` Base64 string - image that represents one side of the document.
   * If the document contains two sides and the `ScanningMode` is set to `automatic`, this should contain the image of the front side of the document. In case the [ScanningMode] is set to `single`, it can
   * be either the front or the back side of the document.
   *
   * @param secondImage - The optional `secondImage` Base64 string: needed if the information from back side of the document is required and the `ScanningMode` is set to `automatic`.
   *
   * @returns `BlinkIdScanningResult` - BlinkID scanning result - Represents the results of scanning a document.
   * This class contains the results of scanning a document, including the extracted data and images from the document.
   */
  performDirectApiScan(
    blinkIdSdkSettings: string,
    blinkIdSessionSettings: string,
    firstImage: string,
    secondImage?: string,
    redactionSettings?: string,
  ): Promise<string>;
}

const BlinkidReactNative: Spec =
  TurboModuleRegistry.getEnforcing<Spec>("BlinkidReactNative");

export default BlinkidReactNative;
