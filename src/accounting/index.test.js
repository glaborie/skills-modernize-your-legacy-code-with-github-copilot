/**
 * Unit Tests for Account Management System
 * Based on Test Plan documented in docs/TESTPLAN.md
 * 
 * Tests validate business logic parity with COBOL implementation:
 * - Initial balance: $1,000.00
 * - Overdraft protection
 * - Credit/Debit operations
 * - 2 decimal place precision
 */

const { DataManager, OperationsManager } = require('./index.js');

// Helper function to suppress console output during tests
const suppressConsoleOutput = () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });
};

describe('Account Management System - Test Suite', () => {
    
    // ========================================================================
    // SYSTEM INITIALIZATION TESTS
    // Test Cases: TC-001, TC-002
    // ========================================================================
    
    describe('System Initialization', () => {
        suppressConsoleOutput();

        test('TC-001: Verify initial account balance is $1,000.00', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1000.00');
        });

        test('TC-002: Verify DataManager initializes with correct balance', () => {
            const dataManager = new DataManager();
            
            expect(dataManager.read()).toBe(1000.00);
        });
    });

    // ========================================================================
    // BALANCE INQUIRY OPERATIONS
    // Test Cases: TC-011 to TC-014
    // ========================================================================
    
    describe('Balance Inquiry Operations', () => {
        suppressConsoleOutput();

        test('TC-011: View balance with no transactions', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1000.00');
        });

        test('TC-012: View balance after credit transaction', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(500.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1500.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1500.00');
        });

        test('TC-013: View balance after debit transaction', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.debit(200.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(800.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 800.00');
        });

        test('TC-014: View balance after multiple transactions', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(250.00);
            operations.debit(100.00);
            operations.credit(50.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1200.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1200.00');
        });
    });

    // ========================================================================
    // CREDIT TRANSACTION PROCESSING
    // Test Cases: TC-015 to TC-021
    // ========================================================================
    
    describe('Credit Transaction Processing', () => {
        suppressConsoleOutput();

        test('TC-015: Credit account with valid amount ($250.00)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.credit(250.00);
            
            expect(newBalance).toBe(1250.00);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1250.00');
        });

        test('TC-016: Credit account with small amount ($0.01)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.credit(0.01);
            
            expect(newBalance).toBe(1000.01);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1000.01');
        });

        test('TC-017: Credit account with large amount ($50,000.00)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.credit(50000.00);
            
            expect(newBalance).toBe(51000.00);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 51000.00');
        });

        test('TC-018: Credit account with zero amount', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.credit(0.00);
            
            expect(newBalance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1000.00');
        });

        test('TC-019: Credit account with decimal precision ($123.45)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.credit(123.45);
            
            expect(newBalance).toBe(1123.45);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1123.45');
        });

        test('TC-020: Multiple consecutive credits', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(100.00);
            operations.credit(200.00);
            const finalBalance = operations.credit(300.00);
            
            expect(finalBalance).toBe(1600.00);
            expect(console.log).toHaveBeenLastCalledWith('Amount credited. New balance: 1600.00');
        });

        test('TC-021: Credit near maximum balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            // Set balance to 999,000.00
            dataManager.write(999000.00);
            
            const newBalance = operations.credit(999.99);
            
            expect(newBalance).toBe(999999.99);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 999999.99');
        });
    });

    // ========================================================================
    // DEBIT TRANSACTION PROCESSING - SUFFICIENT FUNDS
    // Test Cases: TC-022 to TC-027
    // ========================================================================
    
    describe('Debit Transaction Processing - Sufficient Funds', () => {
        suppressConsoleOutput();

        test('TC-022: Debit account with valid amount ($250.00)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.debit(250.00);
            
            expect(newBalance).toBe(750.00);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 750.00');
        });

        test('TC-023: Debit account with small amount ($0.01)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.debit(0.01);
            
            expect(newBalance).toBe(999.99);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 999.99');
        });

        test('TC-024: Debit full balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.debit(1000.00);
            
            expect(newBalance).toBe(0.00);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
        });

        test('TC-025: Debit with decimal precision ($123.45)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const newBalance = operations.debit(123.45);
            
            expect(newBalance).toBe(876.55);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 876.55');
        });

        test('TC-026: Multiple consecutive debits', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.debit(100.00);
            operations.debit(200.00);
            const finalBalance = operations.debit(300.00);
            
            expect(finalBalance).toBe(400.00);
            expect(console.log).toHaveBeenLastCalledWith('Amount debited. New balance: 400.00');
        });

        test('TC-027: Debit leaving minimal balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            // Set balance to 100.00
            dataManager.write(100.00);
            
            const newBalance = operations.debit(99.99);
            
            expect(newBalance).toBe(0.01);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 0.01');
        });
    });

    // ========================================================================
    // DEBIT TRANSACTION PROCESSING - INSUFFICIENT FUNDS (OVERDRAFT PROTECTION)
    // Test Cases: TC-028 to TC-032
    // ========================================================================
    
    describe('Debit Transaction Processing - Insufficient Funds', () => {
        suppressConsoleOutput();

        test('TC-028: Debit exceeding balance by small amount ($1,000.01)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.debit(1000.01);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
        });

        test('TC-029: Debit exceeding balance significantly ($5,000.00)', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.debit(5000.00);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
        });

        test('TC-030: Debit from zero balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            // Set balance to 0
            dataManager.write(0.00);
            
            const balance = operations.debit(0.01);
            
            expect(balance).toBe(0.00);
            expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
        });

        test('TC-031: Debit from minimal balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            // Set balance to 0.50
            dataManager.write(0.50);
            
            const balance = operations.debit(1.00);
            
            expect(balance).toBe(0.50);
            expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
        });

        test('TC-032: Verify balance unchanged after insufficient funds', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            // Set balance to 250.00
            dataManager.write(250.00);
            
            operations.debit(500.00); // Attempt debit that should fail
            const balance = operations.viewBalance();
            
            expect(balance).toBe(250.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 250.00');
        });
    });

    // ========================================================================
    // EDGE CASES AND BOUNDARY CONDITIONS
    // Test Cases: TC-033 to TC-036
    // ========================================================================
    
    describe('Edge Cases and Boundary Conditions', () => {
        suppressConsoleOutput();

        test('TC-033: Zero amount credit', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.credit(0);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1000.00');
        });

        test('TC-034: Zero amount debit', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.debit(0);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 1000.00');
        });

        test('TC-035: Maximum balance boundary', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            dataManager.write(999999.99);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(999999.99);
            expect(console.log).toHaveBeenCalledWith('Current balance: 999999.99');
        });

        test('TC-036: Minimum balance boundary', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            dataManager.write(0.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(0.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 0.00');
        });
    });

    // ========================================================================
    // DATA PERSISTENCE AND INTEGRITY
    // Test Cases: TC-037 to TC-040
    // ========================================================================
    
    describe('Data Persistence and Integrity', () => {
        suppressConsoleOutput();

        test('TC-037: Balance persists across operations', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(500.00);
            let balance = operations.viewBalance();
            expect(balance).toBe(1500.00);
            
            operations.debit(200.00);
            balance = operations.viewBalance();
            expect(balance).toBe(1300.00);
        });

        test('TC-038: Balance accuracy after mixed transactions', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(250.75);
            operations.credit(100.25);
            operations.debit(150.50);
            operations.debit(50.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1150.50);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1150.50');
        });

        test('TC-039: Failed transaction does not corrupt balance', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            dataManager.write(500.00);
            
            operations.debit(1000.00); // Should fail
            operations.credit(100.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(600.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 600.00');
        });

        test('TC-040: Balance consistency check', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance1 = operations.viewBalance();
            const balance2 = operations.viewBalance();
            const balance3 = dataManager.read();
            
            expect(balance1).toBe(1000.00);
            expect(balance2).toBe(1000.00);
            expect(balance3).toBe(1000.00);
        });
    });

    // ========================================================================
    // COMPLEX TRANSACTION SCENARIOS
    // Test Cases: TC-041 to TC-045
    // ========================================================================
    
    describe('Complex Transaction Scenarios', () => {
        suppressConsoleOutput();

        test('TC-041: Credit after insufficient funds rejection', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            dataManager.write(100.00);
            
            operations.debit(200.00); // Should fail
            operations.credit(150.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(250.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 250.00');
        });

        test('TC-042: Debit exact amount after credit', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(500.00);
            operations.debit(1500.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(0.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 0.00');
        });

        test('TC-043: Multiple operations in single session', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            let balance = operations.viewBalance();
            expect(balance).toBe(1000.00);
            
            operations.credit(200.00);
            balance = operations.viewBalance();
            expect(balance).toBe(1200.00);
            
            operations.debit(150.00);
            balance = operations.viewBalance();
            expect(balance).toBe(1050.00);
            
            operations.credit(50.00);
            balance = operations.viewBalance();
            expect(balance).toBe(1100.00);
        });

        test('TC-044: Alternating credits and debits', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(100.00);
            operations.debit(50.00);
            operations.credit(200.00);
            operations.debit(75.00);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1175.00);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1175.00');
        });

        test('TC-045: Precision test with multiple decimals', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            operations.credit(0.99);
            operations.debit(0.33);
            operations.credit(0.11);
            operations.debit(0.22);
            const balance = operations.viewBalance();
            
            expect(balance).toBe(1000.55);
            expect(console.log).toHaveBeenCalledWith('Current balance: 1000.55');
        });
    });

    // ========================================================================
    // DATAMANAGER SPECIFIC TESTS
    // Additional tests for DataManager functionality
    // ========================================================================
    
    describe('DataManager Functionality', () => {
        test('formatCurrency ensures 2 decimal precision', () => {
            const dataManager = new DataManager();
            
            expect(dataManager.formatCurrency(123.456)).toBe(123.46);
            expect(dataManager.formatCurrency(123.454)).toBe(123.45);
            expect(dataManager.formatCurrency(0.999)).toBe(1.00);
            expect(dataManager.formatCurrency(0.001)).toBe(0.00);
        });

        test('read and write operations work correctly', () => {
            const dataManager = new DataManager();
            
            expect(dataManager.read()).toBe(1000.00);
            
            dataManager.write(2500.50);
            expect(dataManager.read()).toBe(2500.50);
            
            dataManager.write(0.00);
            expect(dataManager.read()).toBe(0.00);
        });
    });

    // ========================================================================
    // INPUT VALIDATION TESTS
    // Additional tests for input validation
    // ========================================================================
    
    describe('Input Validation', () => {
        suppressConsoleOutput();

        test('Credit with negative amount rejected', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.credit(-100.00);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
        });

        test('Debit with negative amount rejected', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.debit(-100.00);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
        });

        test('Credit with NaN rejected', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.credit(NaN);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
        });

        test('Debit with NaN rejected', () => {
            const dataManager = new DataManager();
            const operations = new OperationsManager(dataManager);
            
            const balance = operations.debit(NaN);
            
            expect(balance).toBe(1000.00);
            expect(console.log).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
        });
    });
});
