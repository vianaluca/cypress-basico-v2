const IDfirstName = 'input[id=firstName]'
const IDlastName = 'input[id=lastName]'
const IDemail = 'input[id=email]'
const IDphone = 'input[id=phone]'
const IDtextArea = 'textarea[id=open-text-area]'

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (user) => {
    cy.get(IDfirstName).type(user.firstName)
    cy.get(IDlastName).type(user.lastName)
    cy.get(IDemail).type(user.email)
    cy.get(IDphone).type(user.phone)
    cy.get(IDtextArea).type(user.textarea)
})