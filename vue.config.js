const path = require("path");
const vueSrc = "./src";
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
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "org.stealthsend.desktop",
        "productName": "StealthSend-Desktop",
        "copyright": "Copyright © 2021 ${author}",
        "linux": {
          "target": ["deb", "AppImage"],
          "maintainer": "Stealth R&D LLC",
          "icon": "src/assets/logo.png",
          "description": "Stealth will soon be the fastest cryptographically private digital currency. With blazing fast 5 second blocks, Junaeth is a game-changer and offers what state-of-the-art payment systems of the future require: a fast, feeless, private and scalable crypto.",
          "category": "Development, Science, Utility"
        },
        "win": {
          "target": "msi",
          "icon": "src/assets/logo.png"
        },
        "mac": {
          "target": ["dmg", "pkg"],
          "icon": "src/assets/logo_512.png",
          "type": "development"
        }
      },
    }
  },
};
