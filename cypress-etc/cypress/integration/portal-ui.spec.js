describe('portal-ui', () => {
  context('macbook-size', () => {
    beforeEach(() => {
      cy.viewport('macbook-15')
    })
    it('has nice 404', () => {
      // Homepage
      cy.visit('/no-such-page', {failOnStatusCode: false});
      cy.contains('404: Not Found');
      cy.contains('If this page should exist');
    });

    it('handles click-through', () => {
      // Homepage
      cy.visit('/');
      cy.contains('Human Biomolecular Atlas Program');
    
      // Donors
      cy.contains('Donors');
      // Samples
      cy.contains('Samples');
      // Datasets
      cy.contains('Datasets');
      // CCF-UI
      cy.contains('CCF');
      // Showcases
      cy.contains('Showcases');
      // Docs
      cy.contains('Documentation').click();
      cy.contains('Overview');
      cy.contains('FAQ');
      cy.contains('About');
      // login
      cy.contains('login');
      // Don't click! We shouldn't depend on Globus in tests.

      // TODO: nexus_token is now required for search results, so we can pass it
      // back to the client to make the Elasticsearch request. I don't want to go
      // too far into mocking server state, since it would be tricky,
      // and much of this may be moving to the client, in any case.
      // // Donors browse
      // cy.contains('Donors').click();
      // cy.contains('Browse donor')
      //
      // // Donors details
      // cy.contains('TODO: name').click();
      // cy.contains('Warning!');
      // cy.contains('Mock Entity');
      // // Provenance
      // cy.contains('undefined - Input');
      // // Vitessce
      // cy.contains('Scatterplot (UMAP)')
      // cy.contains('1 cells');
      //
      // // Samples browse
      // cy.contains('Samples').click();
      // cy.contains('Browse sample');
      //
      // // Sample details
      // cy.contains('TODO: name').click();
      // cy.contains('Warning!');
      // cy.contains('Mock Entity');
    });
  });
});
