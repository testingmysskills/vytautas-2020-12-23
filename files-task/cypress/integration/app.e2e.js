/* globals cy */

describe('Home page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/uploads', {
      statusCode: 200,
      body: [
        {
          name: 'Name1',
          size: 123 * 1024
        },
        {
          name: 'Name2',
          size: 800
        },
        {
          name: 'Name3',
          size: 5 * 1024 * 1024
        }
      ]
    })
  })

  it('very successful files loading', () => {
    cy.visit('/')

    cy
      .get('[data-testid="total-count"]')
      .should('have.text', '3 documents')

    cy
      .get('[data-testid="total-size"]')
      .should('have.text', 'Total size: 5.12 MB')
  })

  it('successfully removes files', () => {
    cy.intercept('DELETE', 'http://localhost:3001/uploads/Name1', {
      statusCode: 200
    })

    cy.visit('/')

    cy
      .get('[data-testid="upload-Name1"] button')
      .click()

    cy
      .contains('Delete')
      .click()

    cy
      .get('body')
      .should('contain', 'File was successfully deleted!')
  })
})
