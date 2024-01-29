import React from "react";

export default function SearchListBox({
  searchList,
  loading,
  error,
  currentSelection,
  onSelectSearchItem,
  setCurrentSelection,
}) {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <div className="ytd-listbox">
        {searchList ? (
          <div>
            <ul>
              {searchList.map((item, index) => {
                return (
                  <li
                    className={
                      currentSelection === index
                        ? "current-selection-class"
                        : ""
                    }
                    key={item.imdbID}
                    onClick={() => onSelectSearchItem(item)}
                    onMouseOver={() => setCurrentSelection(index)}
                  >
                    {item.Title}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div>No data found...</div>
        )}
      </div>
    </div>
  );
}
