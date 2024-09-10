import React from "react";

const Footer = (props) => {
  return (
    <footer
      style={{
        padding: "50px 0",
        boxShadow: "2px 0px 4px 1px rgba(222, 222, 222, 1)",
      }}
    >
      <p
        style={{
          textAlign: "center",
        }}
      >
        {`${new Date().getFullYear()} - © Strive Blog | Developed for Strive.`}
      </p>
    </footer>
  );
};

export default Footer;
