const filterOptions = ['all', 'completed', 'pending'];

function TaskFilters({ filter, setFilter, counts }) {
  return (
    <div className="filter-card">
      <h3>Filter Options</h3>
      <div className="filter-list">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={filter === option ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(option)}
          >
            <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
            <strong>{counts[option]}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskFilters;