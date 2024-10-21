import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  return {
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
    unmockedFunction: jest.requireActual('./index').unmockedFunction,
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spy = jest.spyOn(global.console, 'log');

    mockOne();
    mockTwo();
    mockThree();

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const spy = jest.spyOn(global.console, 'log');

    unmockedFunction();

    expect(spy).toHaveBeenCalledWith('I am not mocked');

    spy.mockRestore();
  });
});
