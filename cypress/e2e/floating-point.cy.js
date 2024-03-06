/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'
// https://v2.dinerojs.com/docs
import { dinero, add, equal, toDecimal } from 'dinero.js'
import { USD } from '@dinero.js/currencies'

beforeEach(() => {
  cy.visit('float.html')
})

it('adds up all floating-point fees to equal the total', () => {
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
        .and.be.closeTo(total, 0.001)
    })
})

it('adds up all fees using cents', () => {
  const names = ['price', 'shipping', 'handling', 'coupon', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    .map((n) => n * 100)
    .map(Math.round)
    .print()
    .should((numbers) => {
      const [price, shipping, handling, coupon, total] = numbers
      expect(price + shipping + handling + coupon)
        .to.be.greaterThan(10_000)
        .and.to.equal(total)
    })
})

function dineroFromFloat(amountString) {
  const cleaned = amountString.replace('$', '').replace(',', '')
  const amount = Math.round(Number(cleaned * 100))

  return dinero({ amount, currency: USD })
}

it('adds up all fees using Dinero.js', () => {
  const names = ['price', 'shipping', 'handling', 'coupon', 'total']
  const selectors = names.map((name) => `[data-cy=${name}] dd`)
  cy.getInOrder(...selectors)
    .map('innerText')
    .print()
    .map(dineroFromFloat)
    .should((numbers) => {
      const [price, shipping, handling, coupon, total] = numbers
      const sum = [price, shipping, handling, coupon].reduce(add)
      expect(equal(sum, total), `${toDecimal(sum)} = ${toDecimal(total)}`).to.be
        .true
    })
})
