describe("Create Notes", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/create-note/");
  });

  it("should allow user to edit title", () => {
    cy.get("[data-id='title']").type("Random file name");
  });
});
