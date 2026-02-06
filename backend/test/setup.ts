import 'jest';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock PDFKit
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => ({
    pipe: jest.fn(),
    fontSize: jest.fn(),
    text: jest.fn(),
    moveDown: jest.fn(),
    addPage: jest.fn(),
    end: jest.fn(),
  }));
});

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore specific console logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
