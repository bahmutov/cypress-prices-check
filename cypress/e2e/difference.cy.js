/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

chai.config.truncateThreshold = 300

beforeEach(() => {
  cy.visit('index.html')
})

it('checks the fees', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    // partially apply the zip callback
    .apply(Cypress._.zipObject.bind(null, names))
    .difference({
      price: 10.99,
      shipping: 6.99,
      handling: 1.39,
      tips: 1.99,
      total: 21.36,
    })
    .should('be.empty')
})

it.skip('has wrong fees (cy.difference)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    // partially apply the zip callback
    .apply(Cypress._.zipObject.bind(null, names))
    .difference({
      price: 10.99,
      shipping: 6.99,
      handling: 1.39,
      tips: 0.99,
      total: 25.36,
    })
    .should('be.empty')
})

it.skip('has wrong fees (cy.difference with predicates)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)

  const tipsCheck = (amount) => Cypress._.inRange(amount, 1, 3)

  cy.getInOrder(...selectors)
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    // partially apply the zip callback
    .apply(Cypress._.zipObject.bind(null, names))
    .difference({
      price: 10.99,
      shipping: 6.99,
      handling: (amount) => amount > 1.3 && amount < 1.4,
      tips: tipsCheck,
      total: 25.36,
    })
    .should('be.empty')
})
