describe('Loan Application Wizard E2E', () => {
  beforeEach(() => {
    // Clear local storage for a fresh start
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('completes the first step successfully', () => {
    // Title check
    cy.contains('h1', 'Loan Application Wizard');
    
    // Check first step is active
    cy.contains('h2', 'Loan Requirements');

    // Select Loan Type
    cy.get('input[name="loanType"][value="personal"]').click({ force: true });
    
    // Type loan amount
    cy.get('input[name="loanAmount"]').type('500000');
    
    // Type tenure
    cy.get('input[name="tenure"]').type('36');
    
    // Select purpose
    cy.get('select[name="purpose"]').select('home_renovation');
    
    // Click Next
    cy.contains('button', 'Next Step').click();
    
    // Check if second step is active
    cy.contains('h2', 'Identity Details');
  });

  it('validates minimum loan amount', () => {
    // Select Loan Type
    cy.get('input[name="loanType"][value="personal"]').click({ force: true });
    
    // Type small loan amount
    cy.get('input[name="loanAmount"]').type('100');
    
    // Blur to trigger validation
    cy.get('input[name="loanAmount"]').blur();
    
    // Check validation error
    cy.contains('Minimum loan amount is');
    
    // Next button should be disabled
    cy.contains('button', 'Next Step').should('be.disabled');
  });
});
