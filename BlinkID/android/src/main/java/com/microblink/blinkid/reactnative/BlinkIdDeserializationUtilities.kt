package com.microblink.blinkid.reactnative

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.microblink.blinkid.core.BlinkIdSdkSettings
import com.microblink.blinkid.core.settings.ResourcesConfig
import com.microblink.blinkid.core.settings.OtaResourcesConfig
import com.microblink.blinkid.core.result.FieldType
import com.microblink.blinkid.core.result.classinfo.CountryId
import com.microblink.blinkid.core.result.classinfo.DocumentClassInfo
import com.microblink.blinkid.core.result.classinfo.RegionId
import com.microblink.blinkid.core.result.classinfo.DocumentTypeId
import com.microblink.blinkid.core.session.BlinkIdSessionSettings
import com.microblink.blinkid.core.session.ScanningMode
import com.microblink.blinkid.core.settings.DocumentNumberRedactionSettings
import com.microblink.blinkid.core.settings.RedactionSettings
import com.microblink.blinkid.core.settings.RedactionSettingsResolver
import com.microblink.blinkid.core.settings.ScanningSettings
import com.microblink.blinkid.core.settings.SensitivityLevel
import com.microblink.blinkid.core.image.InputImageCropType
import com.microblink.blinkid.core.image.InputImageSelectionStrategy
import com.microblink.blinkid.core.settings.scanning.BarcodeModuleSettings
import com.microblink.blinkid.core.settings.scanning.DocumentCaptureModuleSettings
import com.microblink.blinkid.core.settings.scanning.MrzModuleSettings
import com.microblink.blinkid.core.settings.scanning.VizModuleSettings
import com.microblink.blinkid.ux.settings.BlinkIdUxSettings
import com.microblink.blinkid.ux.settings.ClassFilter
import com.microblink.blinkid.core.network.RequestTimeout
import com.microblink.blinkid.core.session.InputImageSource
import com.microblink.blinkid.core.settings.RedactionMode
import com.microblink.blinkid.ux.camera.CameraLensFacing
import com.microblink.blinkid.ux.camera.CameraSettings
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import org.json.JSONArray
import org.json.JSONObject

object BlinkIdDeserializationUtilities {

  private const val DEFAULT_RESOURCE_DOWNLOAD_URL = "https://models.cdn.microblink.com/resources"
  private const val DEFAULT_RESOURCES_LOCAL_FOLDER = "microblink/blinkid"

  private const val DEFAULT_OTA_DOWNLOAD_URL = "https://blinkid-ota.microblink.com"
  private const val DEFAULT_OTA_RESOURCES_LOCAL_FOLDER = "microblink/blinkid/ota"

  fun deserializeBlinkIdSdkSettings(blinkIdSdkSettingsMap: JSONObject?): BlinkIdSdkSettings? {
    val licenseKey = blinkIdSdkSettingsMap?.optString("licenseKey")?.takeIf { it.isNotBlank() }
      ?: return null

    val resourcesMap = blinkIdSdkSettingsMap.optJSONObject("resourcesConfig")
    val otaResourcesMap = blinkIdSdkSettingsMap.optJSONObject("otaResourcesConfig")

    return BlinkIdSdkSettings(
      licenseKey = licenseKey,
      licensee = blinkIdSdkSettingsMap.optString("licensee").takeIf { it.isNotBlank() },
      resourcesConfig = ResourcesConfig(
        download = resourcesMap?.optBoolean("download", true) ?: true,
        serviceUrl = resourcesMap?.optString("serviceUrl")
          ?.takeIf { it.isNotBlank() }
          ?: DEFAULT_RESOURCE_DOWNLOAD_URL,
        localFolder = resourcesMap?.optString("localFolder")
          ?.takeIf { it.isNotBlank() }
          ?: DEFAULT_RESOURCES_LOCAL_FOLDER,
        requestTimeout = deserializeResourceRequestTimeout(
          resourcesMap?.opt("requestTimeout")
        ),
      ),
      otaResourcesConfig = OtaResourcesConfig(
        checkForUpdates = otaResourcesMap?.optBoolean("checkForUpdates", true) ?: true,
        strict = otaResourcesMap?.optBoolean("strict", false) ?: false,
        serviceUrl = otaResourcesMap?.optString("serviceUrl")
          ?.takeIf { it.isNotBlank() }
          ?: DEFAULT_OTA_DOWNLOAD_URL,
        localFolder = otaResourcesMap?.optString("localFolder")
          ?.takeIf { it.isNotBlank() }
          ?: DEFAULT_OTA_RESOURCES_LOCAL_FOLDER,
        requestTimeout = deserializeResourceRequestTimeout(
          otaResourcesMap?.opt("requestTimeout")
        ),
      ),
      microblinkProxyUrl = blinkIdSdkSettingsMap.optString("microblinkProxyURL")
        .takeIf { it.isNotBlank() },
    )
  }

  fun deserializeBlinkIdSessionSettings(
    sessionSettingsMap: JSONObject?,
    isDirectApi: Boolean
  ): BlinkIdSessionSettings {
    if (sessionSettingsMap == null) {
      return BlinkIdSessionSettings(
        inputImageSource = if (isDirectApi) InputImageSource.Photo else InputImageSource.Video
      )
    }

    return BlinkIdSessionSettings(
      inputImageSource = if (isDirectApi) InputImageSource.Photo else InputImageSource.Video,
      scanningMode = deserializeScanningMode(sessionSettingsMap.optString("scanningMode")),
      scanningSettings = deserializeScanningSettings(
        sessionSettingsMap.optJSONObject("scanningSettings")
      ),
    )
  }

  fun deserializeBlinkIdUxSettings(
    scanningUxSettingsMap: JSONObject?,
    sessionSettingsMap: JSONObject?,
    classFilterMap: JSONObject?,
    redactionSettingsResolverMap: JSONObject?
  ): BlinkIdUxSettings {
    val stepTimeoutMs = sessionSettingsMap?.optInt("stepTimeoutDuration")
      ?: scanningUxSettingsMap?.optInt("stepTimeoutDuration")
      ?: 60_000
    val inactivityTimeoutMs = sessionSettingsMap?.optInt("inactivityTimeoutDuration")
      ?: scanningUxSettingsMap?.optInt("inactivityTimeoutDuration")
      ?: 10_000

    return BlinkIdUxSettings(
      stepTimeoutDuration = stepTimeoutMs.milliseconds,
      inactivityTimeoutDuration = inactivityTimeoutMs.milliseconds,
      allowHapticFeedback = scanningUxSettingsMap?.optBoolean("allowHapticFeedback", true) ?: true,
      classFilter = classFilterMap?.let { CustomClassFilter(it.toString()) },
      redactionSettingsResolver = redactionSettingsResolverMap?.let {
        CustomRedactionSettingsResolver(it.toString())
      },
    )
  }

  fun deserializeCameraSettings(scanningUxSettingsMap: JSONObject?): CameraSettings {
    if (scanningUxSettingsMap == null) return CameraSettings()
    return CameraSettings(
      lensFacing = deserializeLensFacingCamera(
        scanningUxSettingsMap.optString("preferredCamera")
      )
    )
  }

  fun deserializeRedactionSettings(redactionSettingsMap: JSONObject?): RedactionSettings? {
    if (redactionSettingsMap == null || redactionSettingsMap.length() == 0) return null

    val fieldsArray = redactionSettingsMap.optJSONArray("fields") ?: return null
    val fields = mutableListOf<FieldType>()
    for (i in 0 until fieldsArray.length()) {
      parseFieldType(fieldsArray.optString(i))?.let { fields.add(it) }
    }
    if (fields.isEmpty()) return null

    return RedactionSettings(
      redactionMode = parseRedactionMode(redactionSettingsMap.optString("mode", "fullResult")),
      fields = fields,
      documentNumberRedactionSettings = redactionSettingsMap
        .optJSONObject("documentNumberRedactionSettings")
        ?.let { deserializeDocumentNumberRedactionSettings(it) },
      redactMrz = redactionSettingsMap.optBoolean(
        "redactMrz",
        redactionSettingsMap.optBoolean("redactMrzResult", false)
      ),
      redactBarcode = redactionSettingsMap.optBoolean(
        "redactBarcode",
        redactionSettingsMap.optBoolean("redactBarcodeResult", false)
      ),
    )
  }

  fun deserializeClassFilter(
    classFilterMap: JSONObject?,
    classInfo: DocumentClassInfo
  ): Boolean {
    if (classFilterMap == null || classFilterMap.length() == 0) return true

    var includeClass = false
    var excludeClass = true

    val includedClasses = classFilterMap.optJSONArray("includeDocuments")
    if (includedClasses != null && includedClasses.length() > 0) {
      for (i in 0 until includedClasses.length()) {
        includeClass = includeClass || matchClassFilter(includedClasses.optJSONObject(i), classInfo)
      }
    } else {
      includeClass = true
    }

    val excludedClasses = classFilterMap.optJSONArray("excludeDocuments")
    if (excludedClasses != null && excludedClasses.length() > 0) {
      for (i in 0 until excludedClasses.length()) {
        excludeClass =
          excludeClass && !matchClassFilter(excludedClasses.optJSONObject(i), classInfo)
      }
    }

    return includeClass && excludeClass
  }

  fun resolveRedactionSettings(
    redactionResolverMap: JSONObject?,
    classInfo: DocumentClassInfo
  ): RedactionSettings? {
    if (redactionResolverMap == null || redactionResolverMap.length() == 0) return null

    val documentRedactionList =
      redactionResolverMap.optJSONArray("documentRedactionList") ?: return null

    for (i in 0 until documentRedactionList.length()) {
      val redactionEntry = documentRedactionList.optJSONObject(i) ?: continue
      if (shouldUseRedactionSettings(redactionEntry, classInfo)) {
        return deserializeRedactionSettings(redactionEntry)
      }
    }
    return null
  }

  fun base64ToBitmap(base64Str: String?): Bitmap? {
    return try {
      val decodedBytes = Base64.decode(base64Str, Base64.DEFAULT)
      BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    } catch (_: IllegalArgumentException) {
      null
    }
  }

  private fun deserializeScanningSettings(scanningSettingsMap: JSONObject?): ScanningSettings {
    if (scanningSettingsMap == null) return ScanningSettings()

    return ScanningSettings(
      documentCaptureModule = scanningSettingsMap.optJSONObject("documentCaptureModule")
        ?.let { deserializeDocumentCaptureModule(it) },
      barcodeModule = scanningSettingsMap.optJSONObject("barcodeModule")
        ?.let { deserializeBarcodeModule(it) },
      mrzModule = scanningSettingsMap.optJSONObject("mrzModule")
        ?.let { deserializeMrzModule(it) },
      vizModule = scanningSettingsMap.optJSONObject("vizModule")
        ?.let { deserializeVizModule(it) },
      maxAllowedMismatchesPerField = scanningSettingsMap
        .optInt("maxAllowedMismatchesPerField", 0)
        .toUInt(),
    )
  }

  private fun deserializeDocumentCaptureModule(
    moduleMap: JSONObject
  ): DocumentCaptureModuleSettings {
    return DocumentCaptureModuleSettings(
      cropType = parseInputImageCropType(moduleMap.optString("cropType", "not-cropped")),
      inputImageSelectionStrategy = parseInputImageSelectionStrategy(moduleMap.optString("inputImageSelectionStrategy", "balanced")),
      unsupportedDocumentsAllowed = moduleMap.optBoolean("unsupportedDocumentsAllowed", false),
      secondSideWithNoExtractableDataSkipped = moduleMap.optBoolean(
        "secondSideWithNoExtractableDataSkipped",
        true
      ),
      passportDataPageScanOnly = moduleMap.optBoolean("passportDataPageScanOnly", true),
      faceImageExtractionEnabled = moduleMap.optBoolean("faceImageExtractionEnabled", false),
      faceImagePresenceMandatory = moduleMap.optBoolean("faceImagePresenceMandatory", false),
      inputImageReturnEnabled = moduleMap.optBoolean("inputImageReturnEnabled", false),
      documentImageReturnEnabled = moduleMap.optBoolean("documentImageReturnEnabled", false),
      inputImageMargin = moduleMap.optDouble("inputImageMargin", 0.02).toFloat(),
      dotsPerInch = moduleMap.optInt("dotsPerInch", 250),
      extensionFactor = moduleMap.optDouble("extensionFactor", 0.0).toFloat(),
      blurSensitivityLevel = parseSensitivityLevel(
        moduleMap.optString("blurSensitivityLevel", "mid")
      ),
      imageWithBlurRejected = moduleMap.optBoolean("imageWithBlurRejected", true),
      glareSensitivityLevel = parseSensitivityLevel(
        moduleMap.optString("glareSensitivityLevel", "mid")
      ),
      imageWithGlareRejected = moduleMap.optBoolean("imageWithGlareRejected", true),
      tiltSensitivityLevel = parseSensitivityLevel(
        moduleMap.optString("tiltSensitivityLevel", "mid")
      ),
      imageWithPoorLightingRejected = moduleMap.optBoolean("imageWithPoorLightingRejected", true),
      imageWithHandOcclusionRejected = moduleMap.optBoolean("imageWithHandOcclusionRejected", true),
    )
  }

  private fun deserializeBarcodeModule(moduleMap: JSONObject): BarcodeModuleSettings {
    return BarcodeModuleSettings(
      presenceMandatory = moduleMap.optBoolean("presenceMandatory", false),
      barcodeImageReturnEnabled = moduleMap.optBoolean("barcodeImageReturnEnabled", false),
      pdf417ScanningEnabled = moduleMap.optBoolean("pdf417ScanningEnabled", true),
      qrScanningEnabled = moduleMap.optBoolean("qrScanningEnabled", true),
      upceScanningEnabled = moduleMap.optBoolean("upceScanningEnabled", false),
      upcaScanningEnabled = moduleMap.optBoolean("upcaScanningEnabled", false),
      code128ScanningEnabled = moduleMap.optBoolean("code128ScanningEnabled", false),
      code39ScanningEnabled = moduleMap.optBoolean("code39ScanningEnabled", false),
      ean8ScanningEnabled = moduleMap.optBoolean("ean8ScanningEnabled", false),
      ean13ScanningEnabled = moduleMap.optBoolean("ean13ScanningEnabled", false),
      itfScanningEnabled = moduleMap.optBoolean("itfScanningEnabled", false),
      dataMatrixScanningEnabled = moduleMap.optBoolean("dataMatrixScanningEnabled", false),
      aztecScanningEnabled = moduleMap.optBoolean("aztecScanningEnabled", false),
    )
  }

  private fun deserializeMrzModule(moduleMap: JSONObject): MrzModuleSettings {
    return MrzModuleSettings(
      presenceMandatory = moduleMap.optBoolean("presenceMandatory", false)
    )
  }

  private fun deserializeVizModule(moduleMap: JSONObject): VizModuleSettings {
    return VizModuleSettings(
      presenceMandatory = moduleMap.optBoolean("presenceMandatory", false),
      signatureImageExtractionEnabled = moduleMap.optBoolean(
        "signatureImageExtractionEnabled",
        false
      ),
      characterValidationEnabled = moduleMap.optBoolean("characterValidationEnabled", true),
      resultAggregationEnabled = if (moduleMap.has("resultAggregationEnabled")) {
        moduleMap.optBoolean("resultAggregationEnabled")
      } else {
        true
      },
    )
  }

  private fun deserializeDocumentNumberRedactionSettings(
    settingsMap: JSONObject
  ): DocumentNumberRedactionSettings {
    return DocumentNumberRedactionSettings(
      prefixDigitsVisible = settingsMap.optInt("prefixDigitsVisible", 0).toUByte(),
      suffixDigitsVisible = settingsMap.optInt("suffixDigitsVisible", 0).toUByte(),
    )
  }

  private fun deserializeResourceRequestTimeout(timeoutValue: Any?): RequestTimeout {
    val resourceRequestTimeoutMap = timeoutValue as? JSONObject ?: return RequestTimeout.DEFAULT
    val defaultTimeout = RequestTimeout.DEFAULT
    return RequestTimeout(
      connectionTimeout = deserializeTimeoutMilliseconds(
        resourceRequestTimeoutMap.opt("connectionTimeoutMilliseconds"),
        defaultTimeout.connectionTimeout,
      ),
      writeTimeout = deserializeTimeoutMilliseconds(
        resourceRequestTimeoutMap.opt("writeTimeoutMilliseconds"),
        defaultTimeout.writeTimeout,
      ),
      readTimeout = deserializeTimeoutMilliseconds(
        resourceRequestTimeoutMap.opt("readTimeoutMilliseconds"),
        defaultTimeout.readTimeout,
      ),
    )
  }

  private fun deserializeTimeoutMilliseconds(value: Any?, default: Duration): Duration {
    return when (value) {
      is Number -> value.toInt().milliseconds
      else -> default
    }
  }

  private fun deserializeScanningMode(value: String?): ScanningMode {
    return when (value?.lowercase()) {
      "single" -> ScanningMode.Single
      else -> ScanningMode.Automatic
    }
  }

  private fun parseInputImageCropType(value: String): InputImageCropType {
    return when (value.lowercase()) {
      "cropped" -> InputImageCropType.Cropped
      "unknown" -> InputImageCropType.Unknown
      else -> InputImageCropType.NotCropped
    }
  }

  private fun parseInputImageSelectionStrategy(value: String): InputImageSelectionStrategy {
    return when (value.lowercase()) {
      "single-image" -> InputImageSelectionStrategy.SingleImage
      "optimize-for-speed" -> InputImageSelectionStrategy.OptimizeForSpeed
      "balanced" -> InputImageSelectionStrategy.Balanced
      "optimize-for-quality" -> InputImageSelectionStrategy.OptimizeForQuality
      else -> InputImageSelectionStrategy.Balanced
    }
  }

  private fun parseSensitivityLevel(value: String): SensitivityLevel {
    return when (value.lowercase()) {
      "off" -> SensitivityLevel.Off
      "low" -> SensitivityLevel.Low
      "high" -> SensitivityLevel.High
      else -> SensitivityLevel.Mid
    }
  }

  private fun parseRedactionMode(value: String): RedactionMode {
    return when (value) {
      "none" -> RedactionMode.None
      "imageOnly" -> RedactionMode.ImageOnly
      "resultFieldsOnly" -> RedactionMode.ResultFieldsOnly
      else -> RedactionMode.FullResult
    }
  }

  private fun parseFieldType(value: String?): FieldType? {
    if (value.isNullOrBlank()) return null
    val normalized = value.replaceFirstChar { it.lowercase() }
    return FieldType.entries.find {
      it.name.replaceFirstChar { char -> char.lowercase() } == normalized
    }
  }

  private fun deserializeLensFacingCamera(lens: String?): CameraLensFacing {
    return when (lens?.lowercase()) {
      "front" -> CameraLensFacing.LensFacingFront
      else -> CameraLensFacing.LensFacingBack
    }
  }

  private fun shouldUseRedactionSettings(
    redactionMap: JSONObject,
    classInfo: DocumentClassInfo
  ): Boolean {
    val documentFilters = redactionMap.optJSONArray("documentFilter")
    if (documentFilters != null) {
      if (documentFilters.length() == 0) return true
      for (i in 0 until documentFilters.length()) {
        if (matchClassFilter(documentFilters.optJSONObject(i), classInfo)) {
          return true
        }
      }
      return false
    }

    if (redactionMap.has("documentFilter")) {
      return matchClassFilter(redactionMap.optJSONObject("documentFilter"), classInfo)
    }

    return true
  }

  private fun matchClassFilter(
    filteredClass: JSONObject?,
    classInfo: DocumentClassInfo
  ): Boolean {
    if (filteredClass == null) return true

    val country = filteredClass.optString("country").takeIf { it.isNotBlank() }
    val region = filteredClass.optString("region").takeIf { it.isNotBlank() }
    val documentType = filteredClass.optString("documentType").takeIf { it.isNotBlank() }

    return (country == null || parseCountryId(country) == classInfo.country?.id) &&
      (region == null || parseRegionId(region) == classInfo.region?.id) &&
      (documentType == null || parseDocumentTypeId(documentType) == classInfo.documentType?.id)
  }

  private fun parseCountryId(value: String): CountryId? =
    BlinkIdClassInfoIdMappings.parseCountryId(value)

  private fun parseRegionId(value: String): RegionId? =
    BlinkIdClassInfoIdMappings.parseRegionId(value)

  private fun parseDocumentTypeId(value: String): DocumentTypeId? =
    BlinkIdClassInfoIdMappings.parseDocumentTypeId(value)
}

@Parcelize
private class CustomClassFilter(
  private val classFilterMap: String
) : ClassFilter, Parcelable {
  override fun classAllowed(documentClass: DocumentClassInfo): Boolean {
    return BlinkIdDeserializationUtilities.deserializeClassFilter(
      JSONObject(classFilterMap),
      documentClass
    )
  }
}

@Parcelize
private class CustomRedactionSettingsResolver(
  private val redactionResolverMap: String
) : RedactionSettingsResolver, Parcelable {
  override fun resolveRedactionSettings(
    classInfo: DocumentClassInfo
  ): RedactionSettings? {
    return BlinkIdDeserializationUtilities.resolveRedactionSettings(
      JSONObject(redactionResolverMap),
      classInfo
    )
  }
}
