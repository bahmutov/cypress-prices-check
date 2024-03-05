/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

// https://github.com/bahmutov/cy-spok
import spok from 'cy-spok'

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

it('shows the expected fees (one object)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .apply((values) => Cypress._.zipObject(names, values))
    .should('deep.equal', {
      price: '$10.99',
      shipping: '$6.99',
      handling: '$1.39',
      tips: '$1.99',
      total: '$21.36',
    })
})

it.skip('has wrong fees', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .apply((values) => Cypress._.zipObject(names, values))
    .should('deep.equal', {
      price: '$10.99',
      shipping: '$6.99',
      handling: '$1.39',
      tips: '$0.99',
      total: '$25.36',
    })
})

it.skip('has wrong fees (cy-spok)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .apply((values) => Cypress._.zipObject(names, values))
    .should(
      spok({
        price: '$10.99',
        shipping: '$6.99',
        handling: '$1.39',
        tips: '$0.99',
        total: '$25.36',
      }),
    )
})

Cypress.Commands.addQuery('difference', (expected) => {
  const names = Object.keys(expected)
  return (subject) => {
    const diff = {}
    names.forEach((name) => {
      const actual = subject[name]
      const expectedValue = expected[name]
      if (actual !== expectedValue) {
        diff[name] = { actual, expected: expectedValue }
      }
    })
    return diff
  }
})

it.skip('has wrong fees (custom difference)', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    // partially apply the zip callback
    .apply(Cypress._.zipObject.bind(null, names))
    .difference({
      price: '$10.99',
      shipping: '$6.99',
      handling: '$1.39',
      tips: '$0.99',
      total: '$25.36',
    })
    .should('be.empty')
})
