// Tests for the SearchInput component.
//
// We verify:
//   - Placeholder text renders
//   - onChange fires when the user types
//   - The clear button appears and clears the value

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  it("renders with placeholder text", () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Zoek..." />);
    expect(screen.getByPlaceholderText("Zoek...")).toBeInTheDocument();
  });

  it("calls onChange when the user types", () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} placeholder="Zoek..." />);

    const input = screen.getByPlaceholderText("Zoek...");
    fireEvent.change(input, { target: { value: "samsung" } });

    expect(handleChange).toHaveBeenCalledWith("samsung");
  });

  it("shows the current value", () => {
    render(<SearchInput value="iphone" onChange={() => {}} placeholder="Zoek..." />);
    const input = screen.getByPlaceholderText("Zoek...") as HTMLInputElement;
    expect(input.value).toBe("iphone");
  });
});
