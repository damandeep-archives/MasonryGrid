import React from "react";

const MasonryLayout = (props) => {
  const columnWrapper = {};
  const result = [];

  for (let i = 0; i < props.columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  for (let i = 0; i < props.children.length; i++) {
    const columnIndex = i % props.columns;
    columnWrapper[`column${columnIndex}`].push(<div>{props.children[i]}</div>);
  }

  for (let i = 0; i < props.columns; i++) {
    result.push(
      <div
        style={{
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return <div style={{ display: "flex" }}>{result}</div>;
};

export default MasonryLayout;
