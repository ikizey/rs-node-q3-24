import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
  BankAccount,
} from './index';

describe('BankAccount', () => {
  let accountOne: BankAccount;
  let accountTwo: BankAccount;
  const initialAccountOneBalance = 100;
  const initialAccountTwoBalance = 50;
  const tooMuchMoney = 999999999;
  const smallAmountMoney = 25;

  beforeEach(() => {
    accountOne = getBankAccount(initialAccountOneBalance);
    accountTwo = getBankAccount(initialAccountTwoBalance);
  });

  test('should create account with initial balance', () => {
    expect(accountOne.getBalance()).toBe(initialAccountOneBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => accountOne.withdraw(tooMuchMoney)).toThrow(
      InsufficientFundsError,
    );
    expect(() => accountOne.withdraw(tooMuchMoney)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => accountOne.transfer(tooMuchMoney, accountTwo)).toThrow(
      InsufficientFundsError,
    );
    expect(() => accountOne.transfer(tooMuchMoney, accountTwo)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => accountOne.transfer(smallAmountMoney, accountOne)).toThrow(
      TransferFailedError,
    );
    expect(() => accountOne.transfer(smallAmountMoney, accountOne)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    accountOne.deposit(smallAmountMoney);
    expect(accountOne.getBalance()).toBe(
      initialAccountOneBalance + smallAmountMoney,
    );
  });

  test('should withdraw money', () => {
    accountOne.withdraw(smallAmountMoney);
    expect(accountOne.getBalance()).toBe(
      initialAccountOneBalance - smallAmountMoney,
    );
  });

  test('should transfer money', () => {
    accountOne.transfer(smallAmountMoney, accountTwo);

    expect(accountOne.getBalance()).toBe(
      initialAccountOneBalance - smallAmountMoney,
    );
    expect(accountTwo.getBalance()).toBe(
      initialAccountTwoBalance + smallAmountMoney,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedBalance = await accountOne.fetchBalance();
    if (fetchedBalance !== null) {
      expect(fetchedBalance).toBeGreaterThanOrEqual(0);
      expect(fetchedBalance).toBeLessThanOrEqual(100);
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchBalanceMock = jest
      .spyOn(accountOne, 'fetchBalance')
      .mockResolvedValue(initialAccountTwoBalance);

    await accountOne.synchronizeBalance();

    expect(accountOne.getBalance()).toBe(initialAccountTwoBalance);

    fetchBalanceMock.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const fetchBalanceMock = jest
      .spyOn(accountOne, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(accountOne.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    fetchBalanceMock.mockRestore();
  });
});
