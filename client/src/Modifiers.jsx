import React, { useState } from "react";

const Modifiers = () => {
  const [modifiers, setModifiers] = useState([]);
  const modifiersOptions = ["name", "country", "time", "image"];

  const handleModifiersChange = (option) => {
    setModifiers((prevModifiers) => {
      if (prevModifiers.includes(option)) {
        return prevModifiers.filter((mod) => mod !== option);
      } else {
        return [...prevModifiers, option];
      }
    });
  };

  return (
    <div className="modifiers">
      <h3>Modifiers</h3>
      {modifiersOptions.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={modifiers.includes(option)}
            onChange={() => handleModifiersChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default Modifiers;
