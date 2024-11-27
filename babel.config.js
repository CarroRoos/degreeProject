module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // For Expo projects
    // or for non-Expo projects:
    // presets: ['@babel/preset-env', '@babel/preset-react'],
  };
};
