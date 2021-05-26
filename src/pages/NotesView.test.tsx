import { render, screen } from "@testing-library/react";
import NotesView from "./NotesView";

test("renders learn react link", () => {
  render(<NotesView />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
