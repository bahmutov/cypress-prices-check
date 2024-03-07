import 'cypress-map'

beforeEach(() => {
  cy.visit('index.html')
})

const tid = (id) => `[data-cy=${id}] dd`

chai.config.truncateThreshold = 0

it('shows the fees and the total', () => {
  const names = ['price', 'shipping', 'handling', 'tips', 'total']
  const shippingPriceCheck = (amount) => amount > 5 && amount < 10
  cy.getInOrder(names.map(tid))
    .map('innerText')
    .mapInvoke('replace', '$', '')
    .mapInvoke('replace', ',', '')
    .map(Number)
    .print()
    .apply((values) => Cypress._.zipObject(names, values))
    .difference({
      price: 10.99,
      shipping: shippingPriceCheck,
      handling: Cypress._.isNumber,
      tips: (amount) => Cypress._.inRange(amount, 0.1, 2),
      total: 21.36,
    })
    .should('be.empty')
})
