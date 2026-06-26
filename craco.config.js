// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOf = webpackConfig.module.rules.find(r => Array.isArray(r.oneOf)).oneOf;
      oneOf.forEach(rule => {
        // find the babel-loader rule(s)
        if (rule.loader && rule.loader.includes('babel-loader')) {
          // ensure include is an array and add docx
          if (!rule.include) rule.include = [];
          rule.include = Array.isArray(rule.include) ? rule.include : [rule.include];
          rule.include.push(path.resolve('node_modules/docx'));
        }
      });
      return webpackConfig;
    }
  }
};