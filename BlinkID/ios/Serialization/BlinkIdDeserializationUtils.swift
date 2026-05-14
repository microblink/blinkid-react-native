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
        
        if let downloadResources = sdkSettingsDict?["downloadResources"] as? Bool {
            blinkidSdkSettings?.downloadResources = downloadResources
        }
        
        if let resourceDownloadUrl = sdkSettingsDict?["resourceDownloadUrl"] as? String {
            blinkidSdkSettings?.resourceDownloadUrl = resourceDownloadUrl
        }
        
        if let resourceLocalFolder = sdkSettingsDict?["resourceLocalFolder"] as? String {
            blinkidSdkSettings?.resourceLocalFolder = resourceLocalFolder
        }
        
        if let bundleURL = sdkSettingsDict?["bundleIdentifier"] as? String,
           let bundle: Bundle = Bundle.init(identifier: bundleURL) {
            blinkidSdkSettings?.bundleURL = bundle.bundleURL
        }

        if let resourceRequestTimeout = sdkSettingsDict?["resourceRequestTimeout"] as? Int {
            blinkidSdkSettings?.resourceRequestTimeout = BlinkID.RequestTimeout.default
        }
        
        if let microblinkProxyUrl = sdkSettingsDict?["microblinkProxyUrl"] as? String {
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
        
        if let barcodeModuleDict = scanningSettingsDict?["barcodeModule"] as? Dictionary<String, Any> {
            scanningSettings.barcodeModule = deserializeBarcodeModule(barcodeModuleDict)
        }
        
        if let documentCaptureDict = scanningSettingsDict?["documentCaptureModule"] as? Dictionary<String, Any> {
            scanningSettings.documentCaptureModule = deserializeDocumentCaptureModule(documentCaptureDict)
        }
        
        if let mrzModuleDict = scanningSettingsDict?["mrzModule"] as? Dictionary<String, Any> {
            scanningSettings.mrzModule = deserializeMrzModule(mrzModuleDict)
        }
        
        if let vizModuleDict = scanningSettingsDict?["vizModule"] as? Dictionary<String, Any> {
            scanningSettings.vizModule = deserializeVizModule(vizModuleDict)
            
        }
        
        if let maxAllowedMismatchesPerField = scanningSettingsDict?["maxAllowedMismatchesPerField"] as? Int {
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
        
        if let inputImageCropped = documentCaptureModuleDict["inputImageCropped"] as? Bool {
            documentCaptureSettings.inputImageCropped = inputImageCropped
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

        if let redactBarcodeResult = redactionDict["redactBarcodeResult"] as? Bool {
            redactionSettings?.redactBarcodeResult = redactBarcodeResult
        }

        if let redactMrzResult = redactionDict["redactMrzResult"] as? Bool {
            redactionSettings?.redactMrzResult = redactMrzResult
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
        if let scanningUxSettingsDict = scanningUxSettingsDict,
           let allowHapticFeedback = scanningUxSettingsDict["allowHapticFeedback"] as? Bool,
           let preferredCameraPosition = scanningUxSettingsDict["preferredCamera"] as? String,
           let showHelpButton = scanningUxSettingsDict["showHelpButton"] as? Bool,
           let showIntroductionAlert = scanningUxSettingsDict["showOnboardingDialog"] as? Bool {
            return ScanningUXSettings(
                showIntroductionAlert: showIntroductionAlert,
                showHelpButton: showHelpButton,
                preferredCameraPosition: deserializePrefferedCameraPosition(preferredCameraPosition),
                allowHapticFeedback: allowHapticFeedback)
        }
        return ScanningUXSettings()
    }
    
    static func deserializePrefferedCameraPosition(_ value: String) -> Camera.CameraPosition {
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
        guard let documentFilters = redactionDict["documentFilter"] as? [[String: Any]] else {
            return true
        }

        if documentFilters.isEmpty {
            return true
        }

        return documentFilters.contains { filterDict in
            matchClassFilter(filterDict, classInfo: classInfo)
        }
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
        
        return (country == nil || classInfo.country == Country.init(rawValue: country!)) &&
        (type == nil || classInfo.documentType == DocumentType.init(rawValue: type!) &&
         (region == nil || classInfo.region == Region.init(rawValue: region!)))
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
