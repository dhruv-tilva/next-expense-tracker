import React from "react";

export const ProfileIcon = (props) => {
  return (
    <svg
      viewBox="0 0 32 32"
      width={16}
      height={16}
      id="profile-icon"
      {...props}
    >
      <g>
        <circle r="7" cy="7" cx="16" fill="currentColor"></circle>
        <path
          d="M16,19c-8.8,0-16,3.1-16,7v6h32v-6C32,22.1,24.8,19,16,19z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
};
