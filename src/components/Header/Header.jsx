import React from "react";
import TopBar from "./TopBar/TopBar";
import Title from "./Title/Title";
import Category from "./Category/Category";

const Header = () => {
  return (
    <div>
      <div>
        <TopBar />
      </div>
      <div>
        <Title/>
      </div>
      <div>
        <Category />
      </div>
    </div>
  );
};

export default Header;
