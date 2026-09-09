package com.microblink.blinkid.reactnative

import android.app.Activity
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.microblink.blinkid.core.BlinkIdSdk
import com.microblink.blinkid.core.BlinkIdSdkSettings
import com.microblink.blinkid.core.session.BlinkIdProcessResult
import com.microblink.blinkid.ux.contract.BlinkIdScanActivitySettings
import com.microblink.blinkid.ux.contract.MbBlinkIdScan
import com.microblink.blinkid.core.image.InputImage
import com.microblink.blinkid.core.ping.PingManager
import com.microblink.blinkid.core.ping.pinglets.WrapperProductInfo
import com.microblink.blinkid.ux.contract.ScanActivityResultStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject

@ReactModule(name = BlinkidReactNativeModule.NAME)
class BlinkidReactNativeModule(reactContext: ReactApplicationContext) :
  NativeBlinkidReactNativeSpec(reactContext) {
  private val BLINKID_REQUEST_CODE = 1453
  private val BLINKID_ERROR_RESULT_CODE = "BlinkIdAndroidError"
  var pendingPromise: Promise? = null
  private var blinkIdSdk: BlinkIdSdk? = null

  override fun getName(): String {
    return NAME
  }

  override fun loadBlinkIdSdk(
    blinkIdSdkSettings: String?,
    promise: Promise?
  ) {
    pendingPromise = promise
    CoroutineScope(Dispatchers.Main).launch {
      try {
        val blinkIdSettingsJson = blinkIdSdkSettings?.let { JSONObject(it) }
        ensureLoadedSdk(blinkIdSettingsJson)
        pendingPromise?.resolve("")
      } catch (error: Exception) {
        blinkIdSdk = null
        pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, error.message)
      }
    }
  }

  override fun unloadBlinkIdSdk(
    deleteCachedResources: Boolean,
    promise: Promise?
  ) {
    try {
      pendingPromise = promise
      if (deleteCachedResources) {
          BlinkIdSdk.sdkInstance?.closeAndDeleteCachedAssets()
        } else {
          BlinkIdSdk.sdkInstance?.close()
        }
        blinkIdSdk = null
        pendingPromise?.resolve("")
    } catch (exception: Exception) {
      blinkIdSdk = null
      pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, exception.message, null)
    }
  }

  init {
    reactApplicationContext.addActivityEventListener(object : BaseActivityEventListener() {

      override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        if (requestCode == BLINKID_REQUEST_CODE) {

          val blinkIdResult = MbBlinkIdScan().parseResult(resultCode, data)
          when (blinkIdResult.status) {
            ScanActivityResultStatus.Scanned -> {
              blinkIdResult.result?.let { scanningResult ->
                val success = BlinkIdSerializationUtilities.serializeBlinkIdScanningResult(
                  scanningResult
                )
                pendingPromise?.resolve(success)
                blinkIdSdk = null
              } ?: pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, "BlinkID result is empty.")
            }

              ScanActivityResultStatus.Canceled -> {
              pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, "Scanning is canceled.")
              blinkIdSdk = null
              suspend {
                BlinkIdSdk.sdkInstance?.close()
              }
            }

              ScanActivityResultStatus.ErrorSdkInit -> {
              pendingPromise?.reject(
                BLINKID_ERROR_RESULT_CODE,
                "Could not initialize the SDK."
              )
              blinkIdSdk = null
              suspend {
                BlinkIdSdk.sdkInstance?.close()
              }
            }
          }
        }
      }
    })
  }

  override fun performScan(
    blinkIdSdkSettings: String?,
    blinkIdSessionSettings: String?,
    blinkIdScanningUxSettings: String?,
    classFilter: String?,
    redactionSettingsResolver: String?,
    promise: Promise?
  ) {
    CoroutineScope(Dispatchers.Main).launch {
      pendingPromise = promise
      try {
        val sdkSettingsJson = blinkIdSdkSettings?.let { JSONObject(it) }
        val sessionSettingsJson = blinkIdSessionSettings?.let { JSONObject(it) }
        val classFilterJson = parseOptionalJsonObject(classFilter)
        val redactionResolverJson = parseOptionalJsonObject(redactionSettingsResolver)
        val blinkIdScanningUxJson = parseOptionalJsonObject(blinkIdScanningUxSettings)
        val sdkSettings: BlinkIdSdkSettings = sdkSettingsJson?.let {
          BlinkIdDeserializationUtilities.deserializeBlinkIdSdkSettings(it)
        } ?: return@launch withContext(Dispatchers.Main) {
          promise?.reject(BLINKID_ERROR_RESULT_CODE, "Invalid SDK settings")
        }

        reactApplicationContext.currentActivity?.applicationContext?.let {
          val intent = MbBlinkIdScan().createIntent(
            it,
            BlinkIdScanActivitySettings(
              sdkSettings = sdkSettings,
              cameraSettings = BlinkIdDeserializationUtilities.deserializeCameraSettings(
                blinkIdScanningUxJson
              ),
              scanningSessionSettings = BlinkIdDeserializationUtilities.deserializeBlinkIdSessionSettings(
                sessionSettingsJson,
                false
              ),
              uxSettings = BlinkIdDeserializationUtilities.deserializeBlinkIdUxSettings(
                blinkIdScanningUxJson,
                sessionSettingsJson,
                classFilterJson,
                redactionResolverJson,
              ),
              showHelpButton = blinkIdScanningUxJson?.optBoolean("showHelpButton", true) ?: true,
              showOnboardingDialog = blinkIdScanningUxJson?.optBoolean("showOnboardingDialog", true)
                ?: true
            )
          )
          addReactNativePinglet(it)
          reactApplicationContext.startActivityForResult(intent, BLINKID_REQUEST_CODE, null)
        } ?: run { pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, "Activity not found.")}
      } catch (error: Exception) {
        run {
          pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, error.message)
        }
      }
    }
  }

  override fun performDirectApiScan(
    blinkIdSdkSettings: String?,
    blinkIdSessionSettings: String?,
    firstImage: String?,
    secondImage: String?,
    redactionSettings: String?,
    promise: Promise?
  ) {
    pendingPromise = promise
    CoroutineScope(Dispatchers.Default).launch {
      try {
        val sdkSettingsJson = blinkIdSdkSettings?.let { JSONObject(it) }
        val sessionSettingsJson = blinkIdSessionSettings?.let { JSONObject(it) }
        val redactionSettingsJson = parseOptionalJsonObject(redactionSettings)

        val context = reactApplicationContext.applicationContext
          ?: return@launch withContext(Dispatchers.Main) {
            promise?.reject(BLINKID_ERROR_RESULT_CODE, "No activity")
          }
        blinkIdSdk = ensureLoadedSdk(sdkSettingsJson)
        blinkIdSdk?.let {
          addReactNativePinglet(context)
          val session = it.createScanningSession(
            BlinkIdDeserializationUtilities.deserializeBlinkIdSessionSettings(
              sessionSettingsJson,
              true
            )
          ).getOrThrow()

          val inputImages = listOfNotNull(
            firstImage?.let { BlinkIdDeserializationUtilities.base64ToBitmap(it) },
            secondImage?.let { BlinkIdDeserializationUtilities.base64ToBitmap(it) }
          )

          for (img in inputImages) {
            session.process(InputImage.createFromBitmap(img)).getOrThrow()
          }

          val scanResult = session.getResult(
            BlinkIdDeserializationUtilities.deserializeRedactionSettings(redactionSettingsJson)
          ).getOrThrow()
          val resultJson =
            BlinkIdSerializationUtilities.serializeBlinkIdScanningResult(scanResult)

          withContext(Dispatchers.Main) {
            promise?.resolve(resultJson)
          }

          it.close()
          blinkIdSdk = null
        }?: return@launch withContext(Dispatchers.Main) {
          pendingPromise?.reject(BLINKID_ERROR_RESULT_CODE, "Reason: The BlinkID SDK is not initialized. Call the loadBlinkIdSdk() method to pre-load the SDK first, or try running the performDirectApiScan() method with a valid internet connection.", null)
        }
      } catch (e: Exception) {
        withContext(Dispatchers.Main) {
          promise?.reject(BLINKID_ERROR_RESULT_CODE, e.message)
        }
      }
    }
  }

  override fun refreshLicenseLease(promise: Promise?) {
    CoroutineScope(Dispatchers.Main).launch {
      try {
        val sdk = BlinkIdSdk.sdkInstance
          ?: throw IllegalStateException(
            "The BlinkID SDK is not initialized. Call loadBlinkIdSdk() first, or perform a scan."
          )
        sdk.refreshLicenseLease()
        promise?.resolve(null)
      } catch (error: Exception) {
        promise?.reject(BLINKID_ERROR_RESULT_CODE, error.message)
      }
    }
  }

  private suspend fun ensureLoadedSdk(blinkidSdkSettings: JSONObject?): BlinkIdSdk? {

    blinkIdSdk?.let { return it }

    val sdkSettings = BlinkIdDeserializationUtilities
      .deserializeBlinkIdSdkSettings(blinkidSdkSettings)?: throw IllegalStateException("Incorrect SDK Settings.")

    reactApplicationContext.currentActivity?.let {
      val maybeInstance = BlinkIdSdk.initializeSdk(it, sdkSettings)
      when {
        maybeInstance.isSuccess -> {
          blinkIdSdk = maybeInstance.getOrNull()
          return blinkIdSdk
        }

        maybeInstance.isFailure -> {
          blinkIdSdk = null
          throw maybeInstance.exceptionOrNull() ?: IllegalStateException("SDK initialization failed.")
        }
      }
    }?: throw IllegalStateException("Activity not available.")

    return null
  }

  private fun addReactNativePinglet(context: Context) {
    PingManager.getInstance(context).add(
      WrapperProductInfo(WrapperProductInfo.WrapperProduct.CROSSPLATFORMREACTNATIVE),
      0
    )
  }
  private fun parseOptionalJsonObject(value: String?): JSONObject? {
    if (value.isNullOrBlank() || value == "null" || value == "undefined") {
      return null
    }
    return JSONObject(value)
  }

  companion object {
    const val NAME = "BlinkidReactNative"
  }
}
