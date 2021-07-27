const path = require("path");
const vueSrc = "./src";
// const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin")
module.exports = {
  runtimeCompiler: true,
  css: {
    requireModuleExtension: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, vueSrc)
      },
      extensions: ['.js', '.vue', '.json']
    },
    plugins: [
     /*  new GoogleFontsPlugin({
          fonts: [
              { family: "Source Sans Pro", variants: [ "300", "400", "600", "700", "900" ] },
              { family: "Noto Sans", variants: [ "400", "700" ] }
          ]
          /* ...options
      })*/
  ],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "org.stealthsend.desktop",
        "productName": "StealthSend",
        "copyright": "Copyright © 2021 ${author}",
        "afterSign": "scripts/notarize.js",
        "dmg": {
          "sign": false
        },
        "linux": {
          "target": ["deb", "AppImage"],
          "maintainer": "Stealth R&D LLC",
          "icon": "src/assets/logo.png",
          "description": "Stealth is the fastest cryptographically private digital currency. With blazing fast 5 second blocks, Junaeth is a game-changer and offers what state-of-the-art payment systems of the future require: a fast, feeless, private and scalable crypto.",
          "category": "Development, Science, Utility"
        },
        "win": {
          "target": ["nsis", "msi"],
          "icon": "src/assets/logo.png"
        },
        "mac": {
          "target": ['dmg'],
          "icon": "src/assets/icon.icns",
          "type": "distribution",
          "entitlements": "build/entitlements.mac.plist",
          "extendInfo": {
            "NSCameraUsageDescription": "This app requires camera access to record video.",
            "NSMicrophoneUsageDescription": "This app requires microphone access to record audio."
          },
        }
      },
      // nodeIntegration: true,
      // customFileProtocol: './'
    }
  },
};
