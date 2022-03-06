import React from "react";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

const index = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default index;
