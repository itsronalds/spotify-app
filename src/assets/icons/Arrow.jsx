import React from "react";

function Arrow({ width = 222, height = 222 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 222 222"
    >
      <path
        fill="#D6F379"
        d="M222 0H44.735v48.51h94.733L0 187.828 34.21 222 173.915 82.444v103.233H222V0z"
      ></path>
    </svg>
  );
}

export default Arrow;