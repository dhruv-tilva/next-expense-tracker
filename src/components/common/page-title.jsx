import React from "react";

const PageTitle = ({ title }) => {
  return (
    <>
      <h1 className="text-primary text-3xl sm:text-4xl font-bold my-3 sm:my-5">
        {title}
      </h1>
    </>
  );
};

export default PageTitle;
