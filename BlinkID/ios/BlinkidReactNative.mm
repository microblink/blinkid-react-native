#import "BlinkidReactNative.h"
#import "BlinkidReactNative-Swift.h"
#import <React/RCTUtils.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <BlinkidReactNativeSpec/BlinkidReactNativeSpec.h>
#endif

@implementation BlinkidReactNative {
  BlinkidReactNativeModule *moduleImplementation;
}

- (instancetype)init
{
  if (self = [super init]) {
    moduleImplementation = [BlinkidReactNativeModule new];
  }
  return self;
}

RCT_EXPORT_MODULE(BlinkidReactNative);

RCT_EXPORT_METHOD(loadBlinkIdSdk:(NSString *)blinkIdSdkSettings
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self->moduleImplementation loadSdk: [self createDictionaryFromBlinkIdObject:blinkIdSdkSettings] onResolve:^(NSString * _Nonnull) {
        resolve(@"");
    } onReject:^(NSString * _Nonnull error) {
        reject(@"BlinkIdIosError", error, nil);
    }];
}

RCT_EXPORT_METHOD(unloadBlinkIdSdk:(BOOL)deleteCachedResources
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [self->moduleImplementation
     unloadSdk:deleteCachedResources
     onResolve:^(NSString * _Nonnull) {
        resolve(@"");
    } onReject:^(NSString * _Nonnull error) {
        reject(@"BlinkIdIosError", error, nil);
    }];
}

RCT_EXPORT_METHOD(performDirectApiScan:(nonnull NSString *)blinkIdSdkSettings blinkIdSessionSettings:(nonnull NSString *)blinkIdSessionSettings firstImage:(nonnull NSString *)firstImage secondImage:(nonnull NSString *)secondImage redactionSettings:(nonnull NSString *)redactionSettings resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [self->moduleImplementation
     performDirectApiScanWithBlinkIdSdkSettings: [self createDictionaryFromBlinkIdObject: blinkIdSdkSettings]
     blinkIdSessionSettings: [self createDictionaryFromBlinkIdObject: blinkIdSessionSettings]
     redactionSettings: [self createDictionaryFromBlinkIdObject:redactionSettings]
     firstImage:firstImage
     secondImage:secondImage
     onResolve:^(NSString * _Nonnull result) {
        resolve(result);
    } onReject:^(NSString * _Nonnull error) {
        reject(@"BlinkIdIosError", error, nil);
    }];
}

RCT_EXPORT_METHOD(refreshLicenseLease:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [self->moduleImplementation refreshLicenseLeaseOnResolve:^(NSString * _Nonnull) {
        resolve(@"");
    } onReject:^(NSString * _Nonnull error) {
        reject(@"BlinkIdIosError", error, nil);
    }];
}

RCT_EXPORT_METHOD(performScan:(NSString *)blinkIdSdkSettings blinkIdSessionSettings:(NSString *)blinkIdSessionSettings blinkIdScanningUxSettings:(NSString *)blinkIdScanningUxSettings classFilter:(NSString *)classFilter redactionSettingsResolver:(NSString *)redactionSettingsResolver resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = RCTPresentedViewController();
        if (rootViewController == nil) {
            reject(@"BlinkIdIosError", @"No view controller is available to present the BlinkID scanning UI.", nil);
            return;
        }

        [self->moduleImplementation
         performScan:rootViewController
         blinkIdSdkSettings:[self createDictionaryFromBlinkIdObject:blinkIdSdkSettings]
         blinkIdSessionSettings:[self createDictionaryFromBlinkIdObject:blinkIdSessionSettings]
         blinkIdScanningUxSettings:[self createDictionaryFromBlinkIdObject:blinkIdScanningUxSettings]
         classFilterSettings:[self createDictionaryFromBlinkIdObject:classFilter]
         redactionSettingsResolver: [self createDictionaryFromBlinkIdObject:redactionSettingsResolver]
         onResolve:^(NSString * _Nonnull result) {
            resolve(result);
        } onReject:^(NSString * _Nonnull error) {
            NSString *message = error.length > 0 ? error : @"Unknown BlinkID iOS error.";
            reject(@"BlinkIdIosError", message, nil);
        }];
    });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeBlinkidReactNativeSpecJSI>(params);
}
#endif // RCT_NEW_ARCH_ENABLED

- (NSDictionary *)createDictionaryFromBlinkIdObject:(NSString *)jsonString
{
  if (jsonString == nil || jsonString.length == 0) {
    return @{};
  }

  NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  if (data == nil) {
    return @{};
  }

  NSError *jsonError = nil;
  id parsed = [NSJSONSerialization JSONObjectWithData:data
                                              options:NSJSONReadingMutableContainers
                                                error:&jsonError];
  if (![parsed isKindOfClass:[NSDictionary class]]) {
    return @{};
  }

  return (NSDictionary *)parsed;
}

@end
