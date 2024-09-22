import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data) throw new Error("Invalid JSON format");
      const result = await axios.post("http://localhost:5000/bfhl", parsedData);
      setResponse(result.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input or backend error.");
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      selectedOptions.includes(value)
        ? selectedOptions.filter((option) => option !== value)
        : [...selectedOptions, value]
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">BFHL Qualifier Challenge</h1>
      <textarea
        className="border border-gray-300 p-2 w-2/3 mb-4"
        rows="5"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON input, e.g. {"data": ["A", "b", "1", "2"]}'
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {response && (
        <div className="w-2/3 mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-2">Filter Response</h2>
          <div className="flex gap-2 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="alphabets"
                checked={selectedOptions.includes("alphabets")}
                onChange={handleOptionChange}
              />
              <span className="ml-2">Alphabets</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="numbers"
                checked={selectedOptions.includes("numbers")}
                onChange={handleOptionChange}
              />
              <span className="ml-2">Numbers</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="highest_lowercase_alphabet"
                checked={selectedOptions.includes("highest_lowercase_alphabet")}
                onChange={handleOptionChange}
              />
              <span className="ml-2">Highest Lowercase Alphabet</span>
            </label>
          </div>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
