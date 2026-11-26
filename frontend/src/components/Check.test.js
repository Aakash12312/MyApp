import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CheckBlog from "./Check";

test("renders suggestions returned for the requested blog", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      blog: { title: "A blog", content: "Blog content" },
      suggestions: ["Suggestion one", "Suggestion two"],
    }),
  });

  render(
    <MemoryRouter initialEntries={["/blog/checkBlog/blog-123"]}>
      <Routes>
        <Route path="/blog/checkBlog/:id" element={<CheckBlog />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("A blog")).toBeInTheDocument();
  expect(screen.getByText("Suggestion one")).toBeInTheDocument();
  expect(screen.getByText("Suggestion two")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:5000/blog/checkBlog/blog-123",
    { credentials: "include" }
  );
});
