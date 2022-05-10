import React, { ReactChild } from "react";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

interface Props {
  children ? : ReactChild | ReactChild[];
}

const index: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default index;
