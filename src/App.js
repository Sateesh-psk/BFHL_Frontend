import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // For dropdown state

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data) throw new Error("Invalid JSON format");
      const result = await axios.post("https://bfhl-0can.onrender.com/bfhl", parsedData);
      setResponse(result.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input or backend error.");
    }
  };

  const handleOptionChange = (optionValue) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(optionValue)
        ? prevSelectedOptions.filter((option) => option !== optionValue)
        : [...prevSelectedOptions, optionValue]
    );
  };

  const filteredResponse = () => {
    if (!response) return null;
    let displayData = {};
    if (selectedOptions.includes("alphabets")) displayData.alphabets = response.alphabets;
    if (selectedOptions.includes("numbers")) displayData.numbers = response.numbers;
    if (selectedOptions.includes("highest_lowercase_alphabet"))
      displayData.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    return displayData;
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const isOptionSelected = (value) => selectedOptions.includes(value);

  const options = [
    { label: "Alphabets", value: "alphabets" },
    { label: "Numbers", value: "numbers" },
    { label: "Highest Lowercase Alphabet", value: "highest_lowercase_alphabet" },
  ];

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">API Input</h1>

      {/* Input Field */}
      <input
        className="border border-gray-600 p-2 w-full rounded-lg md:w-2/3 mb-4"
        rows="2"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='{"data": ["A", "b", "1", "2"]}'
      />

      {/* Submit Button */}
      <button
        className="bg-blue-600 text-white rounded-lg w-2/3 px-4 py-2 hover:bg-blue-800"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* Display Error */}
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* Filter Options */}
      {response && (
        <div className="w-full md:w-2/3 mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-2">Multi Filter</h2>

          {/* Dropdown Implementation */}
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-between w-96 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {selectedOptions.length > 0
                ? selectedOptions.map(
                    (option) =>
                      options.find((opt) => opt.value === option)?.label
                  ).join(", ")
                : "Multi Filter"}
              <svg
                className="ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOptionChange(option.value)}
                    >
                      <input
                        type="checkbox"
                        checked={isOptionSelected(option.value)}
                        onChange={() => handleOptionChange(option.value)}
                        className="mr-2"
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtered Response */}
          <div className="mt-4">
            <h2 className="text-lg font-bold">Filtered Response</h2>
            {filteredResponse().numbers && (
              <p className="mt-2 ml-3">Numbers: {filteredResponse().numbers.join(", ")}</p>
            )}
            {filteredResponse().alphabets && (
              <p className="mt-2 ml-3">Alphabets: {filteredResponse().alphabets.join(", ")}</p>
            )}
            {filteredResponse().highest_lowercase_alphabet && (
              <p className="mt-2 ml-3">
                Highest Lowercase Alphabet: {filteredResponse().highest_lowercase_alphabet.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
