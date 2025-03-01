require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, packager, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = packager.appInfo.productFilename;

  return await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.NOTARIZE_APPLE_ID,
    appleIdPassword: process.env.NOTARIZE_APPLE_ID_PASSWORD,
    teamId: process.env.NOTARIZE_ASC_PROVIDER,
  });
};
