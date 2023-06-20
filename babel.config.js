module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-proposal-private-methods', {loose: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
  ],
};
