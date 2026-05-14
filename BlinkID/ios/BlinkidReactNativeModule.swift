//
//  BlinkidReactNativeModule.swift
//  BlinkidReactNative
//
//  Created by Milan Parađina on 15.05.2025..
//

import Foundation
import UIKit
import SwiftUI
import Combine
import BlinkID
import BlinkIDUX

@objc public final class BlinkidReactNativeModule: NSObject {
    
    private var classFilterDict: [String: Any]?
    private var redactionSettingsResolverDict: [String: Any]?
    
    private var blinkIdSdk: BlinkIDSdk?
    
    @objc public func loadSdk(_ blinkIdSdkSettings: [String: Any], onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            do {
                let _ = try await ensureLoadedSdk(blinkIdSdkSettings)
                onResolve("")
            } catch {
                onReject(error.localizedDescription)
            }
        }
    }
    
    private func ensureLoadedSdk(_ blinkIdSdkSettings: [String: Any]) async throws -> BlinkIDSdk? {
        if let blinkIdSdk = blinkIdSdk { return blinkIdSdk }
        do {
            guard let settings = BlinkIdDeserializationUtils.deserializeBlinkIdSdkSettings(blinkIdSdkSettings) else {
                throw BlinkIdReactNativeError.incorrectArgument(" BlinkID SDK settings") }
            blinkIdSdk = try await BlinkIDSdk.createBlinkIDSdk(withSettings: settings)
            return blinkIdSdk
        } catch {
            blinkIdSdk = nil
            throw error
        }
    }
    
    @objc public func unloadSdk(_ deleteCachedResources: Bool, onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            if deleteCachedResources {
                await BlinkIDSdk.terminateBlinkIDSdkAndDeleteCachedResources()
            } else {
                await BlinkIDSdk.terminateBlinkIDSdk()
            }
            blinkIdSdk = nil
            onResolve("")
        }
    }
    
    @objc public func performScan(_ rootVc: UIViewController, blinkIdSdkSettings: [String: Any], blinkIdSessionSettings: [String: Any], blinkIdScanningUxSettings: [String: Any], classFilterSettings: [String: Any], redactionSettingsResolver: [String: Any], onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task {
            do {
                
                blinkIdSdk = try await ensureLoadedSdk(blinkIdSdkSettings)
                guard let blinkIdSdk = blinkIdSdk else {
                    throw BlinkIdReactNativeError.initError("The BlinkID SDK is not initialized. Call the loadBlinkIdSdk() method to pre-load the SDK first, or try running the performScan() method with a valid internet connection.")
                }
                
                let sessionSettings = BlinkIdDeserializationUtils.deserializeBlinkIdSessionSettings(blinkIdSessionSettings)
                
                classFilterDict = classFilterSettings
                redactionSettingsResolverDict = redactionSettingsResolver
                
                let analyzer = try await BlinkIDAnalyzer(
                    sdk: blinkIdSdk,
                    blinkIdSessionSettings: sessionSettings,
                    eventStream: BlinkIDEventStream(),
                    classFilter: self,
                    redactionSettingsResolver: self
                )
                await addReactNativePinglet(with: analyzer.sessionNumber)
                
                let scanningUxModel = await BlinkIDUXModel(
                    analyzer: analyzer,
                    uxSettings: BlinkIdDeserializationUtils.deserializeBlinkIdUxScanningSettings(blinkIdScanningUxSettings), onScanCompleted: { blinkIdState in
                        if let scanningResult = blinkIdState.scanningResult {
                            DispatchQueue.main.async {
                                if let result = BlinkIdSerializationUtils.serializeBlinkIdScanningResult(scanningResult) {
                                    onResolve(result)
                                    rootVc.dismiss(animated: true)
                                }
                            }
                        }
                        else {
                            Task { await BlinkIDSdk.terminateBlinkIDSdk() }
                            DispatchQueue.main.async {
                                onReject(BlinkIdReactNativeError.scanningCancelled.localizedDescription)
                                rootVc.dismiss(animated: true)
                            }
                        }
                        
                    }
                )
                
                self.presentScanningUI(scanningUxModel, rootVc)
            } catch {
                if let sdkError = error as? InvalidLicenseKeyError {
                    onReject(sdkError.message)
                } else {
                    onReject(error.localizedDescription)
                }
            }
        }
    }
    
    @objc public func performDirectApiScan(blinkIdSdkSettings: [String: Any], blinkIdSessionSettings: [String: Any], redactionSettings: [String: Any], firstImage: String, secondImage: String?, onResolve: @escaping (String) -> Void, onReject: @escaping (String) -> Void) {
        Task{
            do {
                blinkIdSdk = try await ensureLoadedSdk(blinkIdSdkSettings)
                guard let blinkIdSdk = blinkIdSdk else {
                    throw BlinkIdReactNativeError.initError("The BlinkID SDK is not initialized. Call the loadBlinkIdSdk() method to pre-load the SDK first, or try running the performDirectApiScan() method with a valid internet connection.")
                }
                
                let sessionSettings = BlinkIdDeserializationUtils.deserializeBlinkIdSessionSettings(blinkIdSessionSettings, isFromDirectApi: true)
                let session = try await blinkIdSdk.createScanningSession(sessionSettings: sessionSettings)
                
                await addReactNativePinglet(with: session.getSessionNumber())
                
                guard let frontUIImage = BlinkIdDeserializationUtils.deserializeBase64Image(firstImage) else {
                    throw BlinkIdReactNativeError.frontImageError
                }
                
                let _ = await session.process(inputImage: InputImage(uiImage: frontUIImage))
                
                if let backUIImage = BlinkIdDeserializationUtils.deserializeBase64Image(secondImage) {
                    let _ = await session.process(inputImage: InputImage(uiImage: backUIImage))
                }
                
                let scannedResults = await session.getResult(redactionSettings: BlinkIdDeserializationUtils.deserializeRedactionSettings(redactionSettings))
                DispatchQueue.main.async {
                    if let results = BlinkIdSerializationUtils.serializeBlinkIdScanningResult(scannedResults) {
                        onResolve(results)
                    } else {
                        onReject("Could not retrive the results from DirectAPI scanning!")
                    }
                }
            } catch {
                if let sdkError = error as? InvalidLicenseKeyError {
                    onReject(sdkError.message)
                } else {
                    onReject(error.localizedDescription)
                }
            }
        }
    }
    
    private func presentScanningUI(_ model: BlinkIDUXModel, _ rootVc: UIViewController) {
        DispatchQueue.main.async {
            let viewController = UIHostingController(rootView: BlinkIDUXView(viewModel: model))
            viewController.modalPresentationStyle = .fullScreen
            rootVc.present(viewController, animated: true)
        }
    }
    
    private func addReactNativePinglet(with sessionNumber: Int) async {
        await PingManager.shared.addPinglet(pinglet: WrapperProductInfoPinglet(wrapperProduct: .crossplatformreactnative), sessionNumber: sessionNumber)
    }
}

extension BlinkidReactNativeModule: BlinkIDClassFilter {
    public func classAllowed(classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo) -> Bool {
        if let classInfoFilterDict = classFilterDict {
            return BlinkIdDeserializationUtils.deserializeClassFilter(classInfoFilterDict, classInfo)
        }
        return true
    }
}

extension BlinkidReactNativeModule: RedactionSettingsResolver {
    public func resolveRedactionSettings(classInfo: BlinkID.BlinkIDSDK.DocumentClassInfo) -> BlinkID.RedactionSettings? {
        return BlinkIdDeserializationUtils.deserializeRedactionSettingsResolver(redactionSettingsResolverDict, classInfo)
    }
}

enum BlinkIdReactNativeError: LocalizedError {
    case incorrectArgument(String)
    case settingsError
    case initError(String)
    case frontImageError
    case scanningCancelled
    
    var localizedDescription: String {
        switch self {
        case .incorrectArgument(let argument):
            return "Incorrect argument passed for \(argument)"
        case .settingsError:
            return "Invalid SDK settings provided"
        case .initError(let initErrorReason):
            return "Could not initialize the SDK. Reason: \(initErrorReason)"
        case .frontImageError:
            return "Could not extract the information from the first image! An image of a valid document needs to be sent."
        case .scanningCancelled:
            return "Scanning has been cancelled"
        }
    }
    
    static var iosErrorName : String {
        return "blinkid_ios_error"
    }
}
