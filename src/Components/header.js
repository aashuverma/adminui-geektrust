import React from "react";
import "./header.css";

export default function Header({ handleRestore, searchText, handleSearch }) {
  return (
    <div>
      <div className="header">
        <h4 className="headerTitle">Admin UI</h4>

        <div>
          <button
            type="button"
            className="restoreButton"
            onClick={handleRestore}
          >
            Restore
          </button>
        </div>
      </div>
      <div className="inputBar">
        <input
          placeholder="Search by name, email or role"
          name="search"
          className="searchBar"
          value={searchText}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>
    </div>
  );
}
