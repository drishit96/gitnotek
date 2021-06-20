describe("NotesView", () => {
  before(() => {
    indexedDB.deleteDatabase("fs");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/workspace/");
  });

  it("should have 'Enter selection mode' button", () => {
    cy.get("[data-id='btn-selectionMode']")
      .should("be.visible")
      .should("be.enabled");
  });

  it("should have 'New Folder' button", () => {
    cy.get("[data-id='btn-newFolder']")
      .should("be.visible")
      .should("be.enabled");
  });

  it("should have 'Import Notes' button", () => {
    cy.get("[data-id='btn-importNotes']")
      .should("be.visible")
      .should("be.enabled");
  });

  it("should not have 'Delete' button", () => {
    cy.get("[data-id='btn-delete']").should("not.exist");
  });

  it("should open create notes page on click of create button", () => {
    cy.get("[data-id='btn-createNote']").should("be.visible");
    // .should("be.enabled");
    cy.get("[data-id='btn-createNote']").click({ force: true });
    cy.url().should("include", `/create-note/`);
  });

  it("should create new folder when 'New folder' button  is clicked", () => {
    const folderName = "folder1";

    cy.get("[data-id='btn-newFolder']").click();
    cy.get("[data-id='folderName']").type(folderName);
    cy.get("[data-id='dlg-btn-primary']").click();
    cy.get("[data-id='btn-newFolder']").should("have.focus");

    cy.get(`[data-id='lnk-file${folderName}']`).click();
    cy.url().should("include", `/workspace/${folderName}`);
  });

  it("should allow user to select and unselect notes and folders to delete", () => {
    cy.get("[data-id='btn-selectionMode']").click();
    cy.get("[data-id='btn-selectionMode']").should(
      "have.text",
      "Exit selection mode"
    );
    cy.get("input[type='checkbox'][name='folder1']").check();
    cy.get("input[type='checkbox'][name='folder1']").should("be.checked");

    cy.get("input[type='checkbox'][name='folder1']").uncheck();
    cy.get("input[type='checkbox'][name='folder1']").should("not.be.checked");
  });

  it("should allow user to exit selection mode", () => {
    cy.get("[data-id='btn-selectionMode']").click();
    cy.get("[data-id='btn-selectionMode']").click();
    cy.get("[data-id='btn-selectionMode']").should(
      "have.text",
      "Enter selection mode"
    );

    cy.get("input[type='checkbox'][name='folder1']").should("not.exist");
  });

  it("should allow user to delete selected notes and folders", () => {
    cy.get("[data-id='btn-selectionMode']").click();
    cy.get("input[type='checkbox'][name='folder1']").check();
    cy.get("[data-id='btn-delete']").click();

    cy.get("[data-id='snackbar'").should(
      "have.text",
      "Deleted notes successfully"
    );
    cy.get(`[data-id='lnk-filefolder1']`).should("not.exist");
  });

  it("should allow user to create notes", () => {
    const fileName = "file 1";
    const noteContent = "ok content";
    cy.get("[data-id='btn-createNote']").click({ force: true });
    cy.url().should("include", `/create-note`);
    cy.get("[data-id='title']").clear().type("file 1");
    cy.get("div[contenteditable]")
      .type("{ctrl+a}")
      .type("{backspace}")
      .type(noteContent);
    cy.get("[data-id='btn-saveNote']").click();
    cy.get(`[data-id='lnk-file${fileName}.md']`).click();
    cy.url().should("include", `/notes/${encodeURI(fileName)}`);
    cy.get("div[contenteditable]").should("contain.text", noteContent);
  });

  it("should allow user to edit notes", () => {
    const fileName = "file 1";
    const prevContent = "ok content";
    const newContent = ", version 2";
    cy.get(`[data-id='lnk-file${fileName}.md']`).click();
    cy.get("div[contenteditable]")
      .type("{ctrl+a}")
      .type("{rightarrow}")
      .type(newContent);
    cy.get("[data-id='btn-saveNote']").click();
    cy.get(`[data-id='lnk-file${fileName}.md']`).click();
    cy.get("div[contenteditable]").should(
      "contain.text",
      prevContent + newContent
    );
  });
});
