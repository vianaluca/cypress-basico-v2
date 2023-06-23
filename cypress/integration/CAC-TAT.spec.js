/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function(){
    const IDfirstName = 'input[id=firstName]'
    const IDlastName = 'input[id=lastName]'
    const IDemail = 'input[id=email]'
    const IDphone = 'input[id=phone]'
    const IDtextArea = 'textarea[id=open-text-area]'
    const IDphoneCheckBox = 'input[id=phone-checkbox]'
    const buttonSubmit = 'Enviar'
    const classSuccess = 'span[class=success]'
    const classError = 'span[class=error]'
    const user = {}

    beforeEach(() => {
        cy.visit('./src/index.html');

        user.firstName = "lufodao"
        user.lastName = "d"
        user.email = "email@email.com"
        user.phone = 934566
        user.textarea = "texto livre"
    })

    it('Verifica o titulo da aplicacao', function(){
        cy.title().should('eq','Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function(){
        cy.get(IDfirstName).type('lucas')
        cy.get(IDlastName).type('d')
        cy.get(IDemail).type('lu@lu.com')
        cy.get(IDtextArea).type('de nenhum jeito!', {delay: 0})
        cy.contains(buttonSubmit).click()
        cy.get(classSuccess).should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get(IDfirstName).type('lucas')
        cy.get(IDlastName).type('d')
        cy.get(IDemail).type('luquinha')
        cy.get(IDtextArea).type('de nenhum jeito!', {delay: 0})
        cy.contains(buttonSubmit).click()
        cy.get(classError).should('be.visible')
    })

    it('Não preenche o campo de telefone quando é digitado valores não numericos', () => { 
        cy.get(IDphone)
            .type('lucas')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get(IDfirstName).type('lucas')
        cy.get(IDlastName).type('d')
        cy.get(IDemail).type('luquinha@luquinha.com')
        cy.get(IDtextArea).type('de nenhum jeito!', {delay: 0})
        cy.get(IDphoneCheckBox).check()
        cy.contains(buttonSubmit).click()
        cy.get(classError).should('be.visible')
    })

    it('Preenche e apaga os campos', () => {
        cy.get(IDfirstName)
            .should('have.value', '')
            .type('lucas')
            .should('have.value', 'lucas')
            .clear()
            .should('have.value', '')
        cy.get(IDlastName)
            .should('have.value', '')
            .type('luquinhas')
            .should('have.value', 'luquinhas')
            .clear()
            .should('have.value', '')
        cy.get(IDemail)
            .should('have.value', '')
            .type('email@email.com')
            .should('have.value', 'email@email.com')
            .clear()
            .should('have.value', '')
        cy.get(IDphone)
            .should('have.value', '')
            .type('1234')
            .should('have.value', '1234')
            .clear()
            .should('have.value', '')
    })
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains(buttonSubmit).click()
        cy.get(classError).should('be.visible')
    })

    // exercicio extra 7

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit(user)

        cy.contains(buttonSubmit).click()
        cy.get(classSuccess).should('be.visible')
    })


    it('seleciona um produto aleatorio no select box ', () => {
        cy.get('select option')
        .as('options')
        .its('length').then(num => {
            cy.get('@options').then($options => {
                const randomOptionIndex = Cypress._.random(num - 1)
                const randomNumSelect =  (randomOptionIndex !== 1 && randomOptionIndex !== 0) ? randomOptionIndex : 1
                const randomOptionText = $options[randomNumSelect].innerText
                cy.get('select').select(randomOptionText)
            })
        })
    })

    it('seleciona um produto aleatorio no select box pelo indice mais simples', () => {
        cy.get('select option')
        .its('length').then(num => {
            const randomNum = Cypress._.random(num - 1)
            const randomNumSelect = (randomNum !== 1 && randomNum !== 0) ? randomNum : 1
            cy.get('select').select(randomNumSelect)
        })
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value','youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona umproduto(blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .should('not.be.checked')
            .check()
            .should('have.value', 'feedback')
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(($radio) => {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes depois desmarca o ultimo', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo sumilando um drag-and-drop', () => {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('samplefile')
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('@samplefile')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })


    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
            .invoke('removeAttr', 'target')
            .click()
        
        cy.contains('Talking About Testing').should('be.visible')
    })



    /*
        it('', () => {
            cy.get('')
        })
    */

})