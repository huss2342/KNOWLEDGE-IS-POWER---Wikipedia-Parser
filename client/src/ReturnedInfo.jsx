import React, { useState } from "react";

const ReturnedInfo = ({
  returnedInfoOptions,
  daClickedNode,
  allNodes,
  subcategory,
}) => {
  const [returnedInfo, setReturnedInfo] = useState({});

  const handleReturnedInfoChange = (node, key) => {
    setReturnedInfo((prevReturnedInfo) => {
      const newNodeState = { ...prevReturnedInfo[node] };

      if (key === "main") {
        // Toggle the state of the main checkbox
        newNodeState.main = !newNodeState.main;

        // If the main checkbox is unchecked, clear the nested state
        if (!newNodeState.main) {
          Object.keys(returnedInfoOptions[node]).forEach((subKey) => {
            delete newNodeState[subKey];
          });
        }
      } else {
        // If a subcheckbox is toggled, update its state
        newNodeState[key] = !newNodeState[key];
      }

      return { ...prevReturnedInfo, [node]: newNodeState };
    });
  };

  // //  <div>

  // </div>
  // console.log(returnedInfoOptions);

  // Check if subcategory is false before rendering the UI
  if (subcategory) {
    console.log(returnedInfoOptions);
    return (
      <div className="returnedInfo">
        <h3>Returned Info for {daClickedNode[1]}</h3>
        {Object.keys(returnedInfoOptions).map((key) => (
          <div key={key}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(returnedInfo[daClickedNode[0]]?.[key])}
                onChange={() => handleReturnedInfoChange(daClickedNode[0], key)}
              />
              {key}
            </label>
            {returnedInfo[daClickedNode[0]]?.[key] && (
              <p>{`${key}: ${returnedInfoOptions[key]}`}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    // {allNodes[node].label}

    <div className="returnedInfo">
      <h3>Returned Info for {daClickedNode[1]}</h3>
      {Object.keys(returnedInfoOptions).map((node) => (
        <div key={node}>
          <label>
            <input
              type="checkbox"
              checked={Boolean(returnedInfo[node]?.main)}
              onChange={() => handleReturnedInfoChange(node, "main")}
            />
            {allNodes[node] ? allNodes[node].label : node}
          </label>
          {returnedInfo[node]?.main && (
            <div>
              {Object.keys(returnedInfoOptions[node]).map((key) => (
                <div key={key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(returnedInfo[node][key])}
                      onChange={() => handleReturnedInfoChange(node, key)}
                    />
                    {key}
                  </label>
                  {returnedInfo[node][key] && (
                    <p>{`${key}: ${returnedInfoOptions[node][key]}`}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReturnedInfo;
