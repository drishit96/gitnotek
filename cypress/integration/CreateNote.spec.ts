describe("Create Notes", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/create-note/");
  });

  it("should allow user to edit title", () => {
    cy.get("[data-id='title']").clear().type("Random file name");
    cy.get("[data-id='title']").should("have.value", "Random file name");
  });

  it("should allow user to edit content", () => {
    cy.get("[data-id='title']").clear().type("file 1");
    cy.get("div[contenteditable]")
      .type("/Big")
      .type("{enter}")
      .type("Big heading title")
      .type("{enter}")
      .type("## some secondary text")
      .type("{enter}")
      .type("/Bullet")
      .type("{enter}")
      .type("one")
      .type("{enter}")
      .type("two")
      .type("{enter}")
      .type("{enter}")
      .type("{enter}")
      .type("/todo")
      .type("{enter}")
      .type("tomato")
      .type("{enter}")
      .type("onion");

    cy.get("div[contenteditable]").should("contain.text", "Big heading title");
    cy.get("div[contenteditable]").should(
      "contain.text",
      "some secondary text"
    );
    cy.get("div[contenteditable]").should(
      "not.contain.text",
      "## some secondary text"
    );
    cy.get("div[contenteditable]").should("not.contain.text", "/Bullet");
  });
});
