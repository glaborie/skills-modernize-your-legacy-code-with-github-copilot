#!/usr/bin/env node

/**
 * Account Management System - Node.js Implementation
 * Converted from COBOL legacy application
 * 
 * This application preserves the original business logic:
 * - Initial balance: $1,000.00
 * - Overdraft protection (balance cannot go negative)
 * - Credit and debit operations
 * - 2 decimal place precision for currency
 */

const readline = require('readline');

/**
 * DataProgram - Data access layer
 * Equivalent to data.cob
 * Handles balance storage and retrieval
 */
class DataManager {
    constructor() {
        // Initial balance: $1,000.00 (matching COBOL: PIC 9(6)V99 VALUE 1000.00)
        this.storageBalance = 1000.00;
    }

    /**
     * READ operation - retrieves current balance
     * @returns {number} Current balance
     */
    read() {
        return this.storageBalance;
    }

    /**
     * WRITE operation - updates stored balance
     * @param {number} balance - New balance value
     */
    write(balance) {
        this.storageBalance = balance;
    }

    /**
     * Ensures currency precision (2 decimal places)
     * @param {number} amount - Amount to format
     * @returns {number} Amount with 2 decimal precision
     */
    formatCurrency(amount) {
        return Math.round(amount * 100) / 100;
    }
}

/**
 * Operations - Business logic layer
 * Equivalent to operations.cob
 * Handles account operations: TOTAL, CREDIT, DEBIT
 */
class OperationsManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    /**
     * TOTAL operation - View current balance
     * Equivalent to COBOL 'TOTAL ' operation
     */
    viewBalance() {
        const balance = this.dataManager.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
        return balance;
    }

    /**
     * CREDIT operation - Add funds to account
     * Equivalent to COBOL 'CREDIT' operation
     * @param {number} amount - Amount to credit
     * @returns {number} New balance after credit
     */
    credit(amount) {
        // Validate amount
        if (isNaN(amount) || amount < 0) {
            console.log('Invalid amount. Please enter a positive number.');
            return this.dataManager.read();
        }

        // Read current balance
        let balance = this.dataManager.read();
        
        // Add amount to balance
        balance = this.dataManager.formatCurrency(balance + amount);
        
        // Write updated balance
        this.dataManager.write(balance);
        
        console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
        return balance;
    }

    /**
     * DEBIT operation - Withdraw funds from account
     * Equivalent to COBOL 'DEBIT ' operation
     * Includes overdraft protection
     * @param {number} amount - Amount to debit
     * @returns {number} Balance after debit (or unchanged if insufficient funds)
     */
    debit(amount) {
        // Validate amount
        if (isNaN(amount) || amount < 0) {
            console.log('Invalid amount. Please enter a positive number.');
            return this.dataManager.read();
        }

        // Read current balance
        let balance = this.dataManager.read();
        
        // Check for sufficient funds (Overdraft protection)
        if (balance >= amount) {
            // Sufficient funds - process debit
            balance = this.dataManager.formatCurrency(balance - amount);
            
            // Write updated balance
            this.dataManager.write(balance);
            
            console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
        } else {
            // Insufficient funds - reject transaction
            console.log('Insufficient funds for this debit.');
        }
        
        return balance;
    }
}

/**
 * MainProgram - User interface and main program loop
 * Equivalent to main.cob
 * Handles menu display and user input
 */
class AccountManagementSystem {
    constructor() {
        this.dataManager = new DataManager();
        this.operations = new OperationsManager(this.dataManager);
        this.continueFlag = true;
        
        // Create readline interface for user input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Display main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Process user menu choice
     * @param {string} choice - User's menu selection
     */
    async processChoice(choice) {
        const userChoice = parseInt(choice);

        switch (userChoice) {
            case 1:
                // View Balance
                this.operations.viewBalance();
                break;

            case 2:
                // Credit Account
                await this.promptForAmount('credit');
                break;

            case 3:
                // Debit Account
                await this.promptForAmount('debit');
                break;

            case 4:
                // Exit
                this.continueFlag = false;
                console.log('Exiting the program. Goodbye!');
                break;

            default:
                // Invalid choice
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }

    /**
     * Prompt user for transaction amount
     * @param {string} operation - 'credit' or 'debit'
     */
    promptForAmount(operation) {
        return new Promise((resolve) => {
            const promptText = operation === 'credit' 
                ? 'Enter credit amount: ' 
                : 'Enter debit amount: ';

            this.rl.question(promptText, (answer) => {
                const amount = parseFloat(answer);
                
                if (operation === 'credit') {
                    this.operations.credit(amount);
                } else {
                    this.operations.debit(amount);
                }
                
                resolve();
            });
        });
    }

    /**
     * Main program loop
     * Continues until user selects Exit option
     */
    async run() {
        console.log('\n=== Account Management System Started ===\n');

        while (this.continueFlag) {
            this.displayMenu();
            
            const choice = await new Promise((resolve) => {
                this.rl.question('Enter your choice (1-4): ', resolve);
            });

            await this.processChoice(choice);
            console.log(); // Blank line for readability
        }

        this.rl.close();
        process.exit(0);
    }
}

// Start the application
if (require.main === module) {
    const app = new AccountManagementSystem();
    app.run().catch(error => {
        console.error('Error running application:', error);
        process.exit(1);
    });
}

// Export for testing purposes
module.exports = {
    DataManager,
    OperationsManager,
    AccountManagementSystem
};
