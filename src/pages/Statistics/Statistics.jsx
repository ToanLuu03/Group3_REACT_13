import React from "react";
import { Tabs } from "antd";
import CategoryStatistics from "../../components/Header/Category/CategoryStatistics";

const Statistics = () => {
  return (
    <div className="pt-14">
      <h1 className=" text-xl font-semibold ">Statistics ...</h1>
      <Tabs defaultActiveKey="1" items={CategoryStatistics} />
    </div>
  );
};

export default Statistics;
