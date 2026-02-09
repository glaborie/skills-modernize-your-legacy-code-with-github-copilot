# Test Plan - Student Account Management System

## Purpose
This test plan validates the business logic and implementation of the COBOL Account Management System. It will serve as the basis for creating unit and integration tests for the modernized Node.js application.

## Scope
- System initialization and default values
- Menu navigation and input validation
- Balance inquiry operations
- Credit transaction processing
- Debit transaction processing with overdraft protection
- Edge cases and boundary conditions
- Data persistence and integrity

---

## Test Cases

### System Initialization

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-001 | Verify initial account balance | Application freshly started | 1. Start application<br>2. Select option 1 (View Balance) | System displays "Current balance: 1000.00" | | | Initial balance should be $1,000.00 |
| TC-002 | Verify main menu displays correctly | Application freshly started | 1. Start application<br>2. Observe menu display | Menu displays all options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Menu should be clearly formatted |

---

### Menu Navigation and Input Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-003 | Valid menu selection - Option 1 | Application running at main menu | 1. Enter choice: 1 | System displays balance and returns to menu | | | |
| TC-004 | Valid menu selection - Option 2 | Application running at main menu | 1. Enter choice: 2 | System prompts for credit amount | | | |
| TC-005 | Valid menu selection - Option 3 | Application running at main menu | 1. Enter choice: 3 | System prompts for debit amount | | | |
| TC-006 | Valid menu selection - Option 4 | Application running at main menu | 1. Enter choice: 4 | System displays "Exiting the program. Goodbye!" and terminates | | | |
| TC-007 | Invalid menu selection - Zero | Application running at main menu | 1. Enter choice: 0 | System displays "Invalid choice, please select 1-4." and returns to menu | | | |
| TC-008 | Invalid menu selection - Out of range | Application running at main menu | 1. Enter choice: 5 | System displays "Invalid choice, please select 1-4." and returns to menu | | | |
| TC-009 | Invalid menu selection - Out of range high | Application running at main menu | 1. Enter choice: 9 | System displays "Invalid choice, please select 1-4." and returns to menu | | | |
| TC-010 | Menu loop functionality | Application running at main menu | 1. Enter choice: 1<br>2. Observe menu redisplays<br>3. Enter another choice | Menu redisplays after each operation until exit is selected | | | Verify loop continues until option 4 is selected |

---

### Balance Inquiry Operations

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-011 | View balance with no transactions | Application freshly started | 1. Select option 1 (View Balance) | Displays "Current balance: 1000.00" | | | |
| TC-012 | View balance after credit transaction | Balance = 1000.00, credit of 500.00 applied | 1. Select option 1 (View Balance) | Displays "Current balance: 1500.00" | | | |
| TC-013 | View balance after debit transaction | Balance = 1000.00, debit of 200.00 applied | 1. Select option 1 (View Balance) | Displays "Current balance: 800.00" | | | |
| TC-014 | View balance after multiple transactions | Multiple credits and debits applied | 1. Select option 1 (View Balance) | Displays correct calculated balance | | | Verify balance reflects all prior transactions |

---

### Credit Transaction Processing

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-015 | Credit account with valid amount | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 250.00 | 1. System displays "Amount credited. New balance: 1250.00"<br>2. Balance is updated to 1250.00 | | | |
| TC-016 | Credit account with small amount | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 0.01 | 1. System displays "Amount credited. New balance: 1000.01"<br>2. Balance is updated to 1000.01 | | | Test minimum positive amount |
| TC-017 | Credit account with large amount | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 50000.00 | 1. System displays "Amount credited. New balance: 51000.00"<br>2. Balance is updated to 51000.00 | | | |
| TC-018 | Credit account with zero amount | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 0.00 | 1. System displays "Amount credited. New balance: 1000.00"<br>2. Balance remains 1000.00 | | | Edge case: zero credit |
| TC-019 | Credit account with decimal precision | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 123.45 | 1. System displays "Amount credited. New balance: 1123.45"<br>2. Balance is updated to 1123.45 | | | Verify 2 decimal place precision |
| TC-020 | Multiple consecutive credits | Balance = 1000.00 | 1. Credit 100.00<br>2. Credit 200.00<br>3. Credit 300.00 | Final balance = 1600.00 with each transaction confirmed | | | Verify cumulative credits |
| TC-021 | Credit near maximum balance | Balance = 999000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 999.99 | 1. System displays "Amount credited. New balance: 999999.99"<br>2. Balance is updated to 999999.99 | | | Test maximum balance limit (999,999.99) |

---

### Debit Transaction Processing - Sufficient Funds

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-022 | Debit account with valid amount (sufficient funds) | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 250.00 | 1. System displays "Amount debited. New balance: 750.00"<br>2. Balance is updated to 750.00 | | | |
| TC-023 | Debit account with small amount | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 0.01 | 1. System displays "Amount debited. New balance: 999.99"<br>2. Balance is updated to 999.99 | | | Test minimum positive debit |
| TC-024 | Debit full balance | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 1000.00 | 1. System displays "Amount debited. New balance: 0.00"<br>2. Balance is updated to 0.00 | | | Balance should reach exactly zero |
| TC-025 | Debit with decimal precision | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 123.45 | 1. System displays "Amount debited. New balance: 876.55"<br>2. Balance is updated to 876.55 | | | Verify 2 decimal place precision |
| TC-026 | Multiple consecutive debits | Balance = 1000.00 | 1. Debit 100.00<br>2. Debit 200.00<br>3. Debit 300.00 | Final balance = 400.00 with each transaction confirmed | | | Verify cumulative debits |
| TC-027 | Debit leaving minimal balance | Balance = 100.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 99.99 | 1. System displays "Amount debited. New balance: 0.01"<br>2. Balance is updated to 0.01 | | | Test near-zero balance |

---

### Debit Transaction Processing - Insufficient Funds (Overdraft Protection)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-028 | Debit exceeding balance by small amount | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 1000.01 | 1. System displays "Insufficient funds for this debit."<br>2. Balance remains 1000.00 (unchanged) | | | Critical: Overdraft protection test |
| TC-029 | Debit exceeding balance significantly | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 5000.00 | 1. System displays "Insufficient funds for this debit."<br>2. Balance remains 1000.00 (unchanged) | | | |
| TC-030 | Debit from zero balance | Balance = 0.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 0.01 | 1. System displays "Insufficient funds for this debit."<br>2. Balance remains 0.00 (unchanged) | | | Test overdraft protection at zero balance |
| TC-031 | Debit from minimal balance | Balance = 0.50 | 1. Select option 3 (Debit)<br>2. Enter amount: 1.00 | 1. System displays "Insufficient funds for this debit."<br>2. Balance remains 0.50 (unchanged) | | | |
| TC-032 | Verify balance unchanged after insufficient funds | Balance = 250.00 | 1. Attempt debit of 500.00 (fails)<br>2. View balance | Balance still shows 250.00 | | | Confirm no partial debit occurs |

---

### Edge Cases and Boundary Conditions

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-033 | Zero amount credit | Balance = 1000.00 | 1. Select option 2 (Credit)<br>2. Enter amount: 0 | Balance remains 1000.00, transaction processed | | | System behavior with zero input |
| TC-034 | Zero amount debit | Balance = 1000.00 | 1. Select option 3 (Debit)<br>2. Enter amount: 0 | Balance remains 1000.00, transaction processed | | | System behavior with zero input |
| TC-035 | Maximum balance boundary | Balance = 999999.99 | 1. Select option 1 (View Balance) | System displays correct maximum balance | | | Verify system handles max value (6 digits + 2 decimals) |
| TC-036 | Minimum balance boundary | Balance = 0.00 | 1. Select option 1 (View Balance) | System displays "Current balance: 0.00" | | | Verify system handles zero balance |

---

### Data Persistence and Integrity

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-037 | Balance persists across operations | Balance = 1000.00 | 1. Credit 500.00<br>2. View balance<br>3. Debit 200.00<br>4. View balance | 1. After credit: 1500.00<br>2. After debit: 1300.00<br>Each view shows updated balance | | | Verify READ/WRITE operations maintain data |
| TC-038 | Balance accuracy after mixed transactions | Balance = 1000.00 | 1. Credit 250.75<br>2. Credit 100.25<br>3. Debit 150.50<br>4. Debit 50.00<br>5. View balance | Final balance = 1150.50 | | | Test cumulative calculation accuracy |
| TC-039 | Failed transaction doesn't corrupt balance | Balance = 500.00 | 1. Attempt debit 1000.00 (fails)<br>2. Credit 100.00<br>3. View balance | Balance = 600.00 (500 + 100) | | | Failed debit should not affect subsequent operations |
| TC-040 | Balance consistency check | Balance = 1000.00 | 1. View balance (initial)<br>2. View balance again (no transactions)<br>3. Return to menu and repeat | Balance consistently shows 1000.00 | | | Verify multiple reads don't change balance |

---

### Complex Transaction Scenarios

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-041 | Credit after insufficient funds rejection | Balance = 100.00 | 1. Attempt debit 200.00 (fails)<br>2. Credit 150.00<br>3. View balance | Balance = 250.00 | | | System recovers from failed transaction |
| TC-042 | Debit exact amount after credit | Balance = 1000.00 | 1. Credit 500.00 (balance = 1500.00)<br>2. Debit 1500.00<br>3. View balance | Balance = 0.00 | | | Full withdrawal after deposit |
| TC-043 | Multiple operations in single session | Balance = 1000.00 | 1. View balance<br>2. Credit 200.00<br>3. View balance<br>4. Debit 150.00<br>5. View balance<br>6. Credit 50.00<br>7. View balance | Final balance = 1100.00, all intermediate balances correct | | | End-to-end workflow test |
| TC-044 | Alternating credits and debits | Balance = 1000.00 | 1. Credit 100.00<br>2. Debit 50.00<br>3. Credit 200.00<br>4. Debit 75.00 | Final balance = 1175.00 | | | Test alternating transaction types |
| TC-045 | Precision test with multiple decimals | Balance = 1000.00 | 1. Credit 0.99<br>2. Debit 0.33<br>3. Credit 0.11<br>4. Debit 0.22 | Final balance = 1000.55 | | | Verify decimal calculation accuracy |

---

## Test Execution Notes

### How to Execute Tests
1. Compile the application: `cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem`
2. For each test case, start fresh: `./accountsystem`
3. Follow test steps exactly as documented
4. Record actual results and status (Pass/Fail)
5. Note any discrepancies in Comments column

### Critical Business Rules to Validate
- Initial balance must be exactly $1,000.00
- Overdraft protection must prevent balance from going negative
- All amounts must maintain 2 decimal place precision
- Balance must persist correctly across all operations within a session
- Failed transactions must not affect balance or subsequent operations

### Pass/Fail Criteria
- **Pass**: Actual result matches expected result exactly
- **Fail**: Any deviation from expected result
- Document all failures with specific details in Comments column

### Priority Levels
- **P0 (Critical)**: TC-001, TC-028, TC-029, TC-030 - Core business rules
- **P1 (High)**: TC-015, TC-022, TC-024, TC-037, TC-038 - Primary operations
- **P2 (Medium)**: All remaining transaction tests
- **P3 (Low)**: Edge cases and boundary conditions

---

## Node.js Migration Considerations

When creating unit and integration tests for the Node.js version:

1. **Unit Tests** should cover:
   - Balance initialization
   - Credit calculation logic
   - Debit calculation logic with validation
   - Overdraft protection function
   - Input validation functions

2. **Integration Tests** should cover:
   - Complete credit workflow (read-modify-write)
   - Complete debit workflow (read-validate-modify-write)
   - Balance inquiry workflow
   - Failed transaction handling
   - Session state management

3. **Test Data**:
   - Use same initial balance ($1,000.00)
   - Use same test amounts from this plan
   - Maintain 2 decimal precision
   - Test same boundary conditions

4. **Business Logic Parity**:
   - Every test case here should have equivalent automated test(s)
   - Overdraft protection logic must be identical
   - Balance calculations must match exactly
   - Error messages should convey same information

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Stakeholder | | | |
| QA Lead | | | |
| Development Lead | | | |
| Product Owner | | | |
