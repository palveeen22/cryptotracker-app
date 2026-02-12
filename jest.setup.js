// Provide structuredClone polyfill for test environment
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

// Mock Expo runtime to prevent import errors in tests
jest.mock('expo/src/winter/runtime.native', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
