import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
