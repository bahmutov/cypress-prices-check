/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

beforeEach(() => {
  cy.visit('total.html')
})

it('adds up all fees to equal the total', () => {
  const names = ['price', 'shipping', 'handling', 'coupon', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    .print()
    .should((numbers) => {
      const [price, shipping, handling, coupon, total] = numbers
      expect(price + shipping + handling + coupon)
        .to.be.greaterThan(100)
        .and.to.equal(total)
    })
})
