module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier', 'vue'],
  extends: [
    // 'plugin:vue/vue3-recommended',
    // // 'eslint:recommended',
    // 'prettier/vue',
    // 
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'prettier/vue',
  ],
  // parserOptions: {
  //   ecmaVersion: 2018,
  //   sourceType: 'module',
  //   allowImportExportEverywhere: true,
  //   experimentalObjectRestSpread: true
  // },
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
