module.exports = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: require.resolve('expo/internal/babel-preset'),
        caller: {
          name: 'metro',
          bundler: 'metro',
          platform: 'ios',
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|zustand|@react-native-async-storage)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['./jest.setup.js'],
};
