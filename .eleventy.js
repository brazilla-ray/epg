module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/scss/');
  eleventyConfig.addPassthroughCopy('src/css/style.css');
  eleventyConfig.addPassthroughCopy('src/index.js');
  eleventyConfig.setUseGitIgnore(false);
  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
