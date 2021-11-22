describe("NavigationBar test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should allow user to go back using the back button", () => {
    cy.visit("http://localhost:3000/create-note/");
    cy.get("[data-id='btn-back']").should("exist");
    cy.get("[data-id='btn-back']").click();
    cy.url().should("not.include", "/create-note");
  });

  it("should allow user to toggle theme", () => {
    cy.visit("http://localhost:3000/create-note/");
    cy.get("[data-id='btn-toggleTheme']").click();
    cy.get("[data-id='btn-back']").click();

    cy.get("[data-id='txt-tagLine-1-1'")
      .should("have.css", "color")
      .and("eq", "rgb(245, 245, 255)");

    cy.visit("http://localhost:3000/create-note/");
    cy.get("[data-id='btn-toggleTheme']").click();
    cy.get("[data-id='btn-back']").click();

    cy.get("[data-id='txt-tagLine-1-1'")
      .should("have.css", "color")
      .and("eq", "rgb(66, 66, 66)");
  });
});
