const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin that ensures the Android splashscreen_logo drawable exists.
 * The splash theme references @drawable/splashscreen_logo; prebuild may not create it.
 */
function withSplashScreenDrawable(config) {
  const { withDangerousMod } = require('@expo/config-plugins');
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const projectRoot = cfg.modRequest.platformProjectRoot;
      const drawableDir = path.join(projectRoot, 'app', 'src', 'main', 'res', 'drawable');
      const drawablePath = path.join(drawableDir, 'splashscreen_logo.xml');
      const content = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_background" />
</layer-list>
`;
      await fs.promises.mkdir(drawableDir, { recursive: true });
      await fs.promises.writeFile(drawablePath, content, 'utf8');
      return cfg;
    },
  ]);
}

module.exports = withSplashScreenDrawable;
