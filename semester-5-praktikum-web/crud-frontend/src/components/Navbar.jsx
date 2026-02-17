import React from "react";

const Navbar = ({ whileOpen, onSearch }) => {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <section className="navbar bg-base-100 px-4 py-6 gap-4">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">PWeb</a>
      </div>

      <div className="navbar-center">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
            className="input input-bordered w-full max-w-md"
          />
        </div>
      </div>

      <div className="navbar-end">
        <a
          /* href="/" */
          className="btn btn-primary"
          onClick={whileOpen}
          aria-label="Primary Button"
        >
          Add Client
        </a>
      </div>
    </section>
  );
};

export default Navbar;
