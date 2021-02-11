const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');

module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
  },
  plugins: [autoprefixer, postcssNested],
};
