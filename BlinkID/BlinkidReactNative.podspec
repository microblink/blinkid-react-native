require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "BlinkidReactNative"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => 16.0 }
  s.source       = { :git => "https://github.com/BlinkID/blinkid-react-native.git", :tag => "#{s.version}" }
  s.requires_arc     = true

  s.source_files = [
    "ios/*.{swift,h,m,mm,cpp}",
    "ios/Serialization/*.{swift,h,m,mm,cpp}",
    "ios/generated/**/*.{swift,h,m,mm,cpp}",
    "ios/Frameworks/Source/**/*.{swift,h,m,mm,cpp}"
  ]

  s.private_header_files = "ios/**/*.h"

  # Vendored frameworks
  s.vendored_frameworks = ["ios/Frameworks/*.xcframework"]

  s.swift_version = '5.0'

install_modules_dependencies(s)
end
