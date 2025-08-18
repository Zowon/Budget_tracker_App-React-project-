import expensesReducer, { 
  addExpense, 
  updateExpense, 
  removeExpense,
  selectMonthlyTotal,
  selectIsOverBudget 
} from './expensesSlice';

describe('expensesSlice', () => {
  const initialState = {
    expenses: [],
    loading: false,
    error: null
  };

  describe('reducers', () => {
    test('should handle initial state', () => {
      expect(expensesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle addExpense', () => {
      const expense = {
        userId: 'user1',
        dateISO: '2024-01-15T00:00:00.000Z',
        name: 'Test Expense',
        amount: 100
      };

      const actual = expensesReducer(initialState, addExpense(expense));
      expect(actual.expenses).toHaveLength(1);
      expect(actual.expenses[0]).toMatchObject({
        id: expect.any(String),
        userId: 'user1',
        dateISO: '2024-01-15T00:00:00.000Z',
        name: 'Test Expense',
        amount: 100
      });
    });

    test('should handle updateExpense', () => {
      const state = {
        ...initialState,
        expenses: [{
          id: 'expense1',
          userId: 'user1',
          dateISO: '2024-01-15T00:00:00.000Z',
          name: 'Old Name',
          amount: 100
        }]
      };

      const update = {
        id: 'expense1',
        dateISO: '2024-01-16T00:00:00.000Z',
        name: 'New Name',
        amount: 150
      };

      const actual = expensesReducer(state, updateExpense(update));
      expect(actual.expenses[0]).toMatchObject({
        id: 'expense1',
        userId: 'user1',
        dateISO: '2024-01-16T00:00:00.000Z',
        name: 'New Name',
        amount: 150
      });
    });

    test('should handle removeExpense', () => {
      const state = {
        ...initialState,
        expenses: [{
          id: 'expense1',
          userId: 'user1',
          dateISO: '2024-01-15T00:00:00.000Z',
          name: 'Test Expense',
          amount: 100
        }]
      };

      const actual = expensesReducer(state, removeExpense({ id: 'expense1' }));
      expect(actual.expenses).toHaveLength(0);
    });
  });

  describe('selectors', () => {
    test('selectMonthlyTotal should calculate total correctly', () => {
      const state = {
        expenses: {
          expenses: [
            {
              id: 'expense1',
              userId: 'user1',
              dateISO: '2024-01-15T00:00:00.000Z',
              name: 'Expense 1',
              amount: 100
            },
            {
              id: 'expense2',
              userId: 'user1',
              dateISO: '2024-01-20T00:00:00.000Z',
              name: 'Expense 2',
              amount: 200
            }
          ]
        }
      };

      // Mock the selectExpensesByMonth selector to return the expenses
      const mockExpenses = state.expenses.expenses;
      const total = selectMonthlyTotal.resultFunc(mockExpenses);
      expect(total).toBe(300);
    });

    test('selectIsOverBudget should return true when over budget', () => {
      const monthlyTotal = 1000;
      const budgetLimit = 500;
      const isOver = selectIsOverBudget.resultFunc(monthlyTotal, budgetLimit);
      expect(isOver).toBe(true);
    });

    test('selectIsOverBudget should return false when under budget', () => {
      const monthlyTotal = 300;
      const budgetLimit = 500;
      const isOver = selectIsOverBudget.resultFunc(monthlyTotal, budgetLimit);
      expect(isOver).toBe(false);
    });
  });
}); 