/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

beforeEach(() => {
  cy.visit('index.html')
})

it('shows the expected fees', () => {
  cy.contains('[data-cy=price] dd', '$10.99')
  cy.contains('[data-cy=shipping] dd', '$6.99')
  cy.contains('[data-cy=handling] dd', '$1.39')
  cy.contains('[data-cy=tips] dd', '$1.99')
  cy.contains('[data-cy=total] dd', '$21.36')
})

const fee = (name, value) => {
  cy.contains(`[data-cy=${name}] dd`, value)
}

it('shows the expected fees (simple selectors)', () => {
  fee('price', '$10.99')
  fee('shipping', '$6.99')
  fee('handling', '$1.39')
  fee('tips', '$1.99')
  fee('total', '$21.36')
})

chai.config.truncateThreshold = 300

it('shows the expected fees (one array)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  // cy.getInOrder and cy.map are custom commands
  // from the cypress-map plugin
  cy.getInOrder(...selectors)
    .map('innerText')
    .should('deep.equal', ['$10.99', '$6.99', '$1.39', '$1.99', '$21.36'])
})
