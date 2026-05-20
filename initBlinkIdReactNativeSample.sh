#!/bin/bash

blink_id_plugin_path=`pwd`/BlinkID
appName=BlinkIdSample
appId=com.microblink.sample
rn_version="0.82.0"

# Remove any existing code
rm -rf $appName


# Create a sample application via @react-native-community/cli init
npx @react-native-community/cli init $appName --package-name $appId --title "BlinkID React-Native Sample" --version "$rn_version" || exit 1

# Enter into demo project folder
pushd $appName || exit 1

# Inject esModuleInterop into tsconfig.json
# Add "esModuleInterop": true into compilerOptions in tsconfig.json
sed -i '' '/"compilerOptions": {/a\
\    "esModuleInterop": true,\
\    "allowSyntheticDefaultImports": true,\
\    "skipLibCheck": true,
' tsconfig.json

IS_LOCAL_BUILD=false || exit 1
if [ "$IS_LOCAL_BUILD" = true ]; then
  echo "Using blinkid-react-native from this repo instead from NPM"
  # Enter the BlinkID folder
  pushd "$blink_id_plugin_path" > /dev/null

  # Run npm install for react-native-builder-bob to prepare the build
  npm i

  # Pack the libary
  npm pack

  # Go the sample folder and install the library
  popd > /dev/null
  npm i --save $blink_id_plugin_path/microblink-blinkid-react-native-7.7.0.tgz

else
  # Download BlinkID React Native via NPM
  echo "Downloading blinkid-react-native module"
  npm i --save @microblink/blinkid-react-native
fi

# React-native-image-picker plugin needed only for sample application with DirectAPI to get the document images
npm i react-native-image-picker

# Enter into android project folder
pushd android || exit 1

# Patch the build.gradle to add "maven { url https://maven.microblink.com }"" repository
perl -i~ -pe "BEGIN{$/ = undef;} s/maven \{/maven \{ url 'https:\\/\\/maven.microblink.com' }\n        maven {/" build.gradle

# Fix node/npx path resolution for Android Studio (Gradle daemon doesn't inherit shell PATH)
# Use process.execPath to get the real node binary path, not a symlink that the JVM may fail to resolve
NODE_EXEC=$(node -e "console.log(process.execPath)")
NODE_DIR=$(dirname "$NODE_EXEC")

# Patch settings.gradle to use the full npx path for autolinking
sed -i '' "s|ex.autolinkLibrariesFromCommand()|ex.autolinkLibrariesFromCommand([\"$NODE_DIR/npx\", \"@react-native-community/cli\", \"config\"])|" settings.gradle

# Patch app/build.gradle to use the full node path for codegen and bundling
sed -i '' "s|// nodeExecutableAndArgs = \[\"node\"\]|nodeExecutableAndArgs = [\"$NODE_DIR/node\"]|" app/build.gradle

# Return from the android project folder
popd

# Enter into the ios project folder
pushd ios || exit 1

# Force minimal iOS version
sed -i '' "s/platform :ios, min_ios_version_supported/platform :ios, '16.0'/" Podfile

# Fix fmt compilation errors with newer Xcode/Clang:
# React Native 0.82 uses C++20, which causes the fmt library to use a C++20 feature called
# 'consteval' that doesn't work reliably on iOS. By compiling just the fmt pod with C++17,
# fmt disables consteval and uses a compatible fallback instead. The rest of the app still
# uses C++20. This is like using a different NDK C++ standard for a single native library.
python3 << 'PYEOF'
with open('Podfile', 'r') as f:
    content = f.read()

fmt_fix = """
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++17'
        end
      end
    end
"""

old = "      # :ccache_enabled => true\n    )\n  end\nend"
new = "      # :ccache_enabled => true\n    )" + fmt_fix + "  end\nend"
content = content.replace(old, new)

with open('Podfile', 'w') as f:
    f.write(content)
PYEOF

# Add the camera and photo usage descriptions into Info.plist to enable camera scanning and the image upload via gallery
sed -i '' '/<dict>/a\
  <key>NSCameraUsageDescription</key>\
  <string>Enable the camera usage for BlinkID default UX scanning</string>\
  <key>NSPhotoLibraryUsageDescription</key>\
  <string>Enable photo gallery usage for BlinkID DirectAPI scanning</string>\
' $appName/Info.plist

# Disable Flipper since it spams console with errors
export NO_FLIPPER=1

# to install the iOS application with old architecture run: RCT_NEW_ARCH_ENABLED=0 pod install
pod install

# pod install

# Return from the ios project folder
popd

# Add the sample files with the BlinkID integration code to the sample application
cp ../sample_files/App.tsx ./
cp ../sample_files/BlinkIdResultBuilder.ts ./

# Return to the root folder
popd
echo "
Instruction for running the $appName sample application:
 
Go to the React Native project folder: cd $appName

----- Android instructions -----

Execute: npx react-native run-android

----- iOS instructions -----

1. Execute npx react-native start
2. Open $appName/ios/$appName.xcworkspace
3. Set your development team
4. Press run
"
