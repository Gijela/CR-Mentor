import React, { useEffect } from "react";

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  onFocus,
  isActive,
  onClickOutside,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef(null);

  // 初始化和value更新时同步显示值
  useEffect(() => {
    if (value && value.label) {
      setSearchTerm(value.label);
    }
  }, [value]);

  const filteredOptions = options.filter((option) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower)
    );
  });

  const handleOptionClick = (option) => {
    setSearchTerm(option.label);
    onChange(option);
    setIsOpen(false);
    onClickOutside && onClickOutside();
  };

  return (
    <div className="relative" ref={selectRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          onFocus && onFocus();
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full border rounded-lg p-2"
      />
      {isOpen && isActive && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
