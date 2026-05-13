function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-card">
      <label htmlFor="searchTask">Search Tasks</label>
      <input
        id="searchTask"
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;