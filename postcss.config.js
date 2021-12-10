const autoprefixer = require('autoprefixer');
// const postcssNested = require('postcss-nested');
// const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
    autoprefixer,
  },
  // plugins: [autoprefixer],
};
