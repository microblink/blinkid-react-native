//
//  BlinkIdDeserializationUtilities.swift
//  BlinkidReactNative
//
//  Created by Milan Parađina on 22.05.2025..
//

import Foundation
import BlinkID
import UIKit
import BlinkIDUX

struct BlinkIdDeserializationUtils {
    private static let defaultResourceDownloadUrl = "https://models.cdn.microblink.com/resources"
    private static let defaultResourceLocalFolder = "MLModels"

    private static let defaultOtaDownloadUrl = "https://blinkid-ota.microblink.com"
    private static let defaultOtaResourcesLocalFolder = "OTAMLModels"
    private static let defaultTimeoutSeconds: TimeInterval = 30

    private static func deserializeResourceRequestTimeout(_ value: Any?) -> RequestTimeout {
        guard let map = value as? [String: Any] else {
            return .default
        }

        return RequestTimeout(
            connectionTimeout: deserializeTimeoutSeconds(
                map["connectionTimeoutMilliseconds"],
                defaultSeconds: defaultTimeoutSeconds
            ),
            readTimeout: deserializeTimeoutSeconds(
                map["readTimeoutMilliseconds"],
                defaultSeconds: defaultTimeoutSeconds
            ),
            writeTimeout: deserializeTimeoutSeconds(
                map["writeTimeoutMilliseconds"],
                defaultSeconds: defaultTimeoutSeconds
            )
        )
    }

    private static func deserializeTimeoutSeconds(
        _ value: Any?,
        defaultSeconds: TimeInterval
    ) -> TimeInterval {
        guard let milliseconds = parseTimeoutMilliseconds(value) else {
            return defaultSeconds
        }
        return Double(milliseconds) / 1000.0
    }

    private static func parseTimeoutMilliseconds(_ value: Any?) -> Int? {
        if let intValue = value as? Int {
            return intValue
        }
        if let doubleValue = value as? Double {
            return Int(doubleValue)
        }
        if let numberValue = value as? NSNumber {
            return numberValue.intValue
        }
        return nil
    }

    static func deserializeBlinkIdSdkSettings(_ sdkSettingsDict: Dictionary<String, Any>?) -> BlinkIDSdkSettings? {
        var blinkidSdkSettings: BlinkIDSdkSettings?
        
        if let licenseKey = sdkSettingsDict?["licenseKey"] as? String {
            blinkidSdkSettings = BlinkIDSdkSettings(licenseKey: licenseKey)
        }
        
        if let licensee = sdkSettingsDict?["licensee"] as? String {
            blinkidSdkSettings?.licensee = licensee
        }
        
        if let helloLogEnabled = sdkSettingsDict?["helloLogEnabled"] as? Bool {
            blinkidSdkSettings?.helloLogEnabled = helloLogEnabled
        }

        let resourcesDict = sdkSettingsDict?["resourcesConfig"] as? Dictionary<String, Any>

        let download = resourcesDict?["download"] as? Bool ?? true

        let serviceUrl = resourcesDict?["serviceUrl"] as? String
            ?? defaultResourceDownloadUrl

        let localFolder = resourcesDict?["localFolder"] as? String
            ?? defaultResourceLocalFolder

        var bundleUrl: URL? = nil
        if let bundleIdentifier = resourcesDict?["bundleIdentifier"] as? String,
        let bundle = Bundle(identifier: bundleIdentifier) {
            bundleUrl = bundle.bundleURL
        }

        blinkidSdkSettings?.resourcesConfiguration = ResourcesConfig(
            download: download,
            serviceUrl: serviceUrl,
            localFolder: localFolder,
            requestTimeout: deserializeResourceRequestTimeout(resourcesDict?["requestTimeout"]),
            bundleUrl: bundleUrl
        )

        let otaResourcesDict = sdkSettingsDict?["otaResourcesConfig"] as? Dictionary<String, Any>

        let otaCheckForUpdates = otaResourcesDict?["checkForUpdates"] as? Bool ?? true
        let otaStrict = otaResourcesDict?["strict"] as? Bool ?? false
        let otaServiceUrl = otaResourcesDict?["serviceUrl"] as? String
            ?? defaultOtaDownloadUrl
        let otaLocalFolder = otaResourcesDict?["localFolder"] as? String
            ?? defaultOtaResourcesLocalFolder

        var otaBundleUrl: URL? = nil
        if let otaBundleIdentifier = otaResourcesDict?["bundleIdentifier"] as? String,
           let otaBundle = Bundle(identifier: otaBundleIdentifier) {
            otaBundleUrl = otaBundle.bundleURL
        }

        blinkidSdkSettings?.otaResourcesConfiguration = OTAResourcesConfig(
            checkForUpdates: otaCheckForUpdates,
            strict: otaStrict,
            serviceUrl: otaServiceUrl,
            localFolder: otaLocalFolder,
            requestTimeout: deserializeResourceRequestTimeout(otaResourcesDict?["requestTimeout"]),
            bundleUrl: otaBundleUrl
        )
        
        if let microblinkProxyUrl = sdkSettingsDict?["microblinkProxyURL"] as? String
            ?? sdkSettingsDict?["microblinkProxyUrl"] as? String {
            blinkidSdkSettings?.microblinkProxyURL = microblinkProxyUrl
        }
        
        return blinkidSdkSettings
    }
    
    static func deserializeBlinkIdSessionSettings(_ sessionSettingsDict: Dictionary<String, Any>?, isFromDirectApi: Bool = false) -> BlinkIDSessionSettings {
        var blinkidSessionSettings = BlinkIDSessionSettings()
        
        if let scanningSettings = sessionSettingsDict?["scanningSettings"] as? Dictionary<String, Any> {
            blinkidSessionSettings.scanningSettings = deserializeBlinkIdScanningSettings(scanningSettings)
        }
        
        if let scanningMode = sessionSettingsDict?["scanningMode"] as? String {
            blinkidSessionSettings.scanningMode = deseralizeScanningMode(scanningMode)
        }
        
        if let stepTimeoutDuration = sessionSettingsDict?["stepTimeoutDuration"] as? Int {
            blinkidSessionSettings.stepTimeoutDuration = Double(stepTimeoutDuration) / 1000.0
        }
        
        if let inactivityTimeoutDuration = sessionSettingsDict?["inactivityTimeoutDuration"] as? Int {
            blinkidSessionSettings.inactivityTimeoutDuration = Double(inactivityTimeoutDuration) / 1000.0
        }
        
        if isFromDirectApi {
            blinkidSessionSettings.inputImageSource = .photo
        }
        
        return blinkidSessionSettings
    }
    
    static func deserializeBlinkIdScanningSettings(_ scanningSettingsDict: Dictionary<String, Any>?) -> ScanningSettings {
        var scanningSettings = ScanningSettings()
        guard let scanningSettingsDict else {
            return scanningSettings
        }

        if scanningSettingsDict.keys.contains("barcodeModule") {
            if let barcodeModuleDict = scanningSettingsDict["barcodeModule"] as? Dictionary<String, Any> {
                scanningSettings.barcodeModule = deserializeBarcodeModule(barcodeModuleDict)
            } else {
                scanningSettings.barcodeModule = nil
            }
        }

        if scanningSettingsDict.keys.contains("documentCaptureModule") {
            if let documentCaptureDict = scanningSettingsDict["documentCaptureModule"] as? Dictionary<String, Any> {
                scanningSettings.documentCaptureModule = deserializeDocumentCaptureModule(documentCaptureDict)
            } else {
                scanningSettings.documentCaptureModule = nil
            }
        }

        if scanningSettingsDict.keys.contains("mrzModule") {
            if let mrzModuleDict = scanningSettingsDict["mrzModule"] as? Dictionary<String, Any> {
                scanningSettings.mrzModule = deserializeMrzModule(mrzModuleDict)
            } else {
                scanningSettings.mrzModule = nil
            }
        }

        if scanningSettingsDict.keys.contains("vizModule") {
            if let vizModuleDict = scanningSettingsDict["vizModule"] as? Dictionary<String, Any> {
                scanningSettings.vizModule = deserializeVizModule(vizModuleDict)
            } else {
                scanningSettings.vizModule = nil
            }
        }

        if let maxAllowedMismatchesPerField = scanningSettingsDict["maxAllowedMismatchesPerField"] as? Int {
            scanningSettings.maxAllowedMismatchesPerField = maxAllowedMismatchesPerField
        }

        return scanningSettings
    }
    
    static func deserializeBarcodeModule(_ barcodeModuleDict: Dictionary<String, Any>) -> BarcodeModuleSettings {
        var barodeModuleSettings = BarcodeModuleSettings()
        
        if let barcodeImageReturnEnabled = barcodeModuleDict["barcodeImageReturnEnabled"] as? Bool {
            barodeModuleSettings.barcodeImageReturnEnabled = barcodeImageReturnEnabled
        }
        
        if let code128ScanningEnabled = barcodeModuleDict["code128ScanningEnabled"] as? Bool {
            barodeModuleSettings.code128ScanningEnabled = code128ScanningEnabled
        }
        
        if let code39ScanningEnabled = barcodeModuleDict["code39ScanningEnabled"] as? Bool {
            barodeModuleSettings.code39ScanningEnabled = code39ScanningEnabled
        }
        
        if let dataMatrixScanningEnabled = barcodeModuleDict["dataMatrixScanningEnabled"] as? Bool {
            barodeModuleSettings.dataMatrixScanningEnabled = dataMatrixScanningEnabled
        }

        if let aztecScanningEnabled = barcodeModuleDict["aztecScanningEnabled"] as? Bool {
            barodeModuleSettings.aztecScanningEnabled = aztecScanningEnabled
        }
        
        if let ean13ScanningEnabled = barcodeModuleDict["ean13ScanningEnabled"] as? Bool {
            barodeModuleSettings.ean13ScanningEnabled = ean13ScanningEnabled
        }
        
        if let ean8ScanningEnabled = barcodeModuleDict["ean8ScanningEnabled"] as? Bool {
            barodeModuleSettings.ean8ScanningEnabled = ean8ScanningEnabled
        }
        
        if let itfScanningEnabled = barcodeModuleDict["itfScanningEnabled"] as? Bool {
            barodeModuleSettings.itfScanningEnabled = itfScanningEnabled
        }
        
        if let pdf417ScanningEnabled = barcodeModuleDict["pdf417ScanningEnabled"] as? Bool {
            barodeModuleSettings.pdf417ScanningEnabled = pdf417ScanningEnabled
        }
        
        if let presenceMandatory = barcodeModuleDict["presenceMandatory"] as? Bool {
            barodeModuleSettings.presenceMandatory = presenceMandatory
        }
        
        if let qrScanningEnabled = barcodeModuleDict["qrScanningEnabled"] as? Bool {
            barodeModuleSettings.qrScanningEnabled = qrScanningEnabled
        }
        
        if let upcaScanningEnabled = barcodeModuleDict["upcaScanningEnabled"] as? Bool {
            barodeModuleSettings.upcaScanningEnabled = upcaScanningEnabled
        }
        
        if let upceScanningEnabled = barcodeModuleDict["upceScanningEnabled"] as? Bool {
            barodeModuleSettings.upceScanningEnabled = upceScanningEnabled
        }
        
        return barodeModuleSettings
    }
    
    static func deserializeDocumentCaptureModule(_ documentCaptureModuleDict: Dictionary<String, Any>) -> DocumentCaptureModuleSettings {
        var documentCaptureSettings = DocumentCaptureModuleSettings()
        
        if let blurSensitivityLevel = documentCaptureModuleDict["blurSensitivityLevel"] as? String {
            documentCaptureSettings.blurSensitivityLevel = deserializeSensitivityLevel(blurSensitivityLevel)
        }
        
        if let glareSensitivityLevel = documentCaptureModuleDict["glareSensitivityLevel"] as? String {
            documentCaptureSettings.glareSensitivityLevel = deserializeSensitivityLevel(glareSensitivityLevel)
        }
        
        if let tiltSensitivityLevel = documentCaptureModuleDict["tiltSensitivityLevel"] as? String {
            documentCaptureSettings.tiltSensitivityLevel = deserializeSensitivityLevel(tiltSensitivityLevel)
        }
        
        if let documentImageReturnEnabled = documentCaptureModuleDict["documentImageReturnEnabled"] as? Bool {
            documentCaptureSettings.documentImageReturnEnabled = documentImageReturnEnabled
        }
        
        if let dotsPerInch = documentCaptureModuleDict["dotsPerInch"] as? Int {
            documentCaptureSettings.dotsPerInch = DPI(dotsPerInch)
        }
        
        if let extensionFactor = documentCaptureModuleDict["extensionFactor"] as? Double {
            documentCaptureSettings.extensionFactor = Float(extensionFactor)
        }
        
        if let faceImageExtractionEnabled = documentCaptureModuleDict["faceImageExtractionEnabled"] as? Bool {
            documentCaptureSettings.faceImageExtractionEnabled = faceImageExtractionEnabled
        }
        
        if let faceImagePresenceMandatory = documentCaptureModuleDict["faceImagePresenceMandatory"] as? Bool {
            documentCaptureSettings.faceImagePresenceMandatory = faceImagePresenceMandatory
        }
        
        if let imageWithBlurRejected = documentCaptureModuleDict["imageWithBlurRejected"] as? Bool {
            documentCaptureSettings.imageWithBlurRejected = imageWithBlurRejected
        }
        
        if let imageWithGlareRejected = documentCaptureModuleDict["imageWithGlareRejected"] as? Bool {
            documentCaptureSettings.imageWithGlareRejected = imageWithGlareRejected
        }
        
        if let imageWithHandOcclusionRejected = documentCaptureModuleDict["imageWithHandOcclusionRejected"] as? Bool {
            documentCaptureSettings.imageWithHandOcclusionRejected = imageWithHandOcclusionRejected
        }
        
        if let imageWithPoorLightingRejected = documentCaptureModuleDict["imageWithPoorLightingRejected"] as? Bool {
            documentCaptureSettings.imageWithPoorLightingRejected = imageWithPoorLightingRejected
        }
        
        if let cropType = documentCaptureModuleDict["cropType"] as? String {
            documentCaptureSettings.cropType = deserializeInputImageCropType(cropType)
        }

        if let inputImageSelectionStrategy = documentCaptureModuleDict["inputImageSelectionStrategy"] as? String {
            documentCaptureSettings.inputImageSelectionStrategy = deserializeInputImageSelectionStrategy(inputImageSelectionStrategy)
        }
        
        if let inputImageReturnEnabled = documentCaptureModuleDict["inputImageReturnEnabled"] as? Bool {
            documentCaptureSettings.inputImageReturnEnabled = inputImageReturnEnabled
        }
        
        if let passportDataPageScanOnly = documentCaptureModuleDict["passportDataPageScanOnly"] as? Bool {
            documentCaptureSettings.passportDataPageScanOnly = passportDataPageScanOnly
        }
        
        if let secondSideWithNoExtractableDataSkipped = documentCaptureModuleDict["secondSideWithNoExtractableDataSkipped"] as? Bool {
            documentCaptureSettings.secondSideWithNoExtractableDataSkipped = secondSideWithNoExtractableDataSkipped
        }
        
        if let unsupportedDocumentsAllowed = documentCaptureModuleDict["unsupportedDocumentsAllowed"] as? Bool {
            documentCaptureSettings.unsupportedDocumentsAllowed = unsupportedDocumentsAllowed
        }
        
        if let inputImageMargin = documentCaptureModuleDict["inputImageMargin"] as? Double {
            documentCaptureSettings.inputImageMargin = Float(inputImageMargin)
        }
        
        if let tiltSensitivityLevel = documentCaptureModuleDict["tiltSensitivityLevel"] as? String {
            documentCaptureSettings.tiltSensitivityLevel = deserializeSensitivityLevel(tiltSensitivityLevel)
        }
        return documentCaptureSettings
    }

    static func deserializeInputImageCropType(_ value: String) -> InputImageCropType {
        switch value {
        case "cropped": return InputImageCropType.cropped
        case "unknown": return InputImageCropType.unknown
        case "not-cropped": return InputImageCropType.notCropped
        default: return InputImageCropType.notCropped
        }
    }

    static func deserializeInputImageSelectionStrategy(_ value: String) -> InputImageSelectionStrategy {
        switch value {
        case "single-image": return InputImageSelectionStrategy.singleImage
        case "optimize-for-speed": return InputImageSelectionStrategy.optimizeForSpeed
        case "balanced": return InputImageSelectionStrategy.balanced
        case "optimize-for-quality": return InputImageSelectionStrategy.optimizeForQuality
        default: return InputImageSelectionStrategy.balanced
        }
    }
    
    static func deserializeSensitivityLevel(_ sensitivityLevelRawValue: String) -> SensitivityLevel {
        switch sensitivityLevelRawValue {
        case "off": return .off
        case "low": return .low
        case "mid": return .mid
        case "high": return .high
        default: return .mid
        }
    }
    
    static func deserializeMrzModule(_ mrzModuleDict: Dictionary<String, Any>) -> MrzModuleSettings {
        
        var mrzModuleSettings = MrzModuleSettings()
        
        if let presenceMandatory = mrzModuleDict["presenceMandatory"] as? Bool {
            mrzModuleSettings.presenceMandatory = presenceMandatory
        }
        
        return mrzModuleSettings
    }
    
    static func deserializeVizModule(_ vizModuleDict: Dictionary<String, Any>) -> VizModuleSettings {
        var vizModuleSettings = VizModuleSettings()
        
        if let characterValidationEnabled = vizModuleDict["characterValidationEnabled"] as? Bool {
            vizModuleSettings.characterValidationEnabled = characterValidationEnabled
        }
        
        if let presenceMandatory = vizModuleDict["presenceMandatory"] as? Bool {
            vizModuleSettings.presenceMandatory = presenceMandatory
        }
        
        if let signatureImageExtractionEnabled = vizModuleDict["signatureImageExtractionEnabled"] as? Bool {
            vizModuleSettings.signatureImageExtractionEnabled = signatureImageExtractionEnabled
        }
        
        if let resultAggregationEnabled = vizModuleDict["resultAggregationEnabled"] as? Bool {
            vizModuleSettings.resultAggregationEnabled = resultAggregationEnabled
        }
        
        return vizModuleSettings
    }
    
    static func deserializeRedactionSettings(_ redactionDict: Dictionary<String, Any>) -> RedactionSettings? {
        var redactionSettings: RedactionSettings?
        if let fieldsRaw = redactionDict["fields"] as? [String] {
            let fieldTypes: [FieldType] = fieldsRaw.compactMap { FieldType(rawValue: $0) }
            redactionSettings = RedactionSettings(fields: fieldTypes)
        } else {
            return nil
        }

        if let modeRaw = redactionDict["mode"] as? String,
           let mode = RedactionMode(rawValue: modeRaw) {
            redactionSettings?.mode = mode
        }

        if let redactBarcode = redactionDict["redactBarcode"] as? Bool
            ?? redactionDict["redactBarcodeResult"] as? Bool {
            redactionSettings?.redactBarcode = redactBarcode
        }

        if let redactMrz = redactionDict["redactMrz"] as? Bool
            ?? redactionDict["redactMrzResult"] as? Bool {
            redactionSettings?.redactMrz = redactMrz
        }

        if let documentNumberRedactionDict = redactionDict["documentNumberRedactionSettings"] as? Dictionary<String, Any> {
            redactionSettings?.documentNumberRedactionSettings =
                deserializeDocumentNumberRedactionSettings(documentNumberRedactionDict)
        }

        return redactionSettings
    }
    
    static func deserializeDocumentNumberRedactionSettings(_ documentNumberRedactionSettingsDict: Dictionary<String, Any>) -> DocumentNumberRedactionSettings {
        var documentNumberRedactionSettings = DocumentNumberRedactionSettings()
        
        if let prefixDigitsVisible = documentNumberRedactionSettingsDict["prefixDigitsVisible"] as? Int {
            documentNumberRedactionSettings.prefixDigitsVisible = UInt8(prefixDigitsVisible)
        }
        
        if let suffixDigitsVisible = documentNumberRedactionSettingsDict["suffixDigitsVisible"] as? Int {
            documentNumberRedactionSettings.suffixDigitsVisible = UInt8(suffixDigitsVisible)
        }
        
        return documentNumberRedactionSettings
    }
    
    
    static func deserializeBlinkIdUxScanningSettings(_ scanningUxSettingsDict: Dictionary<String, Any>?) -> ScanningUXSettings {
        guard let scanningUxSettingsDict = scanningUxSettingsDict,
              !scanningUxSettingsDict.isEmpty else {
            return ScanningUXSettings()
        }

        let preferredCameraRaw = scanningUxSettingsDict["preferredCamera"] as? String
        return ScanningUXSettings(
            showIntroductionAlert: scanningUxSettingsDict["showOnboardingDialog"] as? Bool ?? true,
            showHelpButton: scanningUxSettingsDict["showHelpButton"] as? Bool ?? true,
            preferredCameraPosition: deserializePreferredCameraPosition(preferredCameraRaw ?? "back"),
            allowHapticFeedback: scanningUxSettingsDict["allowHapticFeedback"] as? Bool ?? true)
    }
    
    static func deserializePreferredCameraPosition(_ value: String) -> Camera.CameraPosition {
        switch value {
        case "front":
            return Camera.CameraPosition.front
        case "back":
            return Camera.CameraPosition.back
        default:
            return Camera.CameraPosition.back
        }
    }
    
    static func deseralizeScanningMode(_ value: String) -> ScanningMode {
        switch value {
        case "single":
            return ScanningMode.single
        case "automatic":
            return ScanningMode.automatic
        default:
            return ScanningMode.automatic
        }
    }
    
    
    static func deserializeDetailedFieldType(_ detailedFieldTypeDict: Dictionary<String, Any>?) -> DetailedFieldType? {
        if let fieldType = detailedFieldTypeDict?["fieldType"] as? String,
           let alphabetType = detailedFieldTypeDict?["alphabetType"] as? String,
           let fieldTypeValue = FieldType.init(rawValue: fieldType),
           let alphabetTypeValue = AlphabetType(rawValue: alphabetType) {
            return DetailedFieldType(
                fieldType: fieldTypeValue,
                alphabetType: alphabetTypeValue)
        }
        return nil
    }
    
    static func deserializeRedactionSettingsResolver(
        _ redactionResolverDict: Dictionary<String, Any>?,
        _ classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo
    ) -> RedactionSettings? {

        guard let redactionResolverDict,
              let documentRedactionList = redactionResolverDict["documentRedactionList"] as? [[String: Any]] else { return nil }
        
        for redactionDict in documentRedactionList {
            if shouldUseRedactionSettings(redactionDict, classInfo: classInfo) {
                return deserializeRedactionSettings(redactionDict)
            }
        }

        return nil
    }
    
    private static func shouldUseRedactionSettings(
        _ redactionDict: [String: Any],
        classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo
    ) -> Bool {
        if let documentFilters = redactionDict["documentFilter"] as? [[String: Any]] {
            if documentFilters.isEmpty {
                return true
            }
            return documentFilters.contains { filterDict in
                matchClassFilter(filterDict, classInfo: classInfo)
            }
        }

        if let documentFilter = redactionDict["documentFilter"] as? Dictionary<String, Any> {
            return matchClassFilter(documentFilter, classInfo: classInfo)
        }

        return true
    }
    
    static func deserializeClassFilter(_ classFilterDictArr: Dictionary<String, Any>?, _ classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo) -> Bool {
        guard let sanitizedDict = sanitizeDictionary(classFilterDictArr) else { return true}
        var includeClass = false
        var excludeClass = true
        
        if let includedClasses = sanitizedDict["includeDocuments"] as? Array<Dictionary<String, Any>> {
            for includedClass in includedClasses {
                includeClass = includeClass || matchClassFilter(includedClass, classInfo: classInfo)
            }
        } else {
            includeClass = true
        }
        
        if let excludedClasses = sanitizedDict["excludeDocuments"] as? Array<Dictionary<String, Any>> {
            for excludedClass in excludedClasses {
                excludeClass = excludeClass && !matchClassFilter(excludedClass, classInfo: classInfo)
            }
        }
        
        return includeClass && excludeClass
    }
    
    static func matchClassFilter(_ filteredClass: Dictionary<String, Any>, classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo) -> Bool {
        let country = filteredClass["country"] as? String
        let type = filteredClass["documentType"] as? String
        let region = filteredClass["region"] as? String
        
        return (country == nil || classInfo.country?.countryId == parseCountryId(country!)) &&
        (type == nil || classInfo.documentType?.documentTypeId == parseDocumentTypeId(type!)) &&
        (region == nil || classInfo.region?.regionId == parseRegionId(region!))
    }

    private static func parseCountryId(_ value: String) -> CountryID? {
        switch value {
        case "schengenArea":
            return .schengen_area
        default:
            return CountryID(rawValue: value)
        }
    }

    private static func parseRegionId(_ value: String) -> RegionID? {
        RegionID(rawValue: value)
    }

    private static func parseDocumentTypeId(_ value: String) -> DocumentTypeID? {
        DocumentTypeID(rawValue: value)
    }
    
    static func sanitizeDictionary(_ dictionary: Dictionary<String, Any>?) -> Dictionary<String, Any>? {
        if let dictionary = dictionary {
            var sanitized = dictionary
            for (key, value) in dictionary {
                if value is NSNull {
                    sanitized[key] = nil
                }
            }
            return sanitized
        }
        return dictionary
    }
    
    static func deserializeBase64Image(_ base64Image: String?) -> UIImage? {
        if let base64Image = base64Image,
        let data = Data(base64Encoded: base64Image, options: .ignoreUnknownCharacters) {
            return UIImage(data: data)
        }
        return nil
    }
}
