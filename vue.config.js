const path = require("path");
const vueSrc = "./src";
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin")
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
      new GoogleFontsPlugin({
          fonts: [
              { family: "Source Sans Pro", variants: [ "300", "400", "600", "700", "900" ] },
              { family: "Noto Sans", variants: [ "400", "700" ] }
          ]
          /* ...options */
      })
  ],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "org.stealthsend.desktop",
        "productName": "StealthSend",
        "copyright": "Copyright © 2021 ${author}",
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
          "target": ["dmg", "pkg"],
          "icon": "src/assets/logo_512.png",
          "type": "development"
        }
      },
    }
  },
};
