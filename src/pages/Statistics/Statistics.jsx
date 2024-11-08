import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import CategoryStatistics from "../../components/Header/Category/CategoryStatistics";

const Statistics = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    setUsername(username || '');
  }, []);
  return (
    <div className="pt-14">
      <h1 className=" text-xl font-semibold ">Statistics {username}</h1>
      <Tabs defaultActiveKey="1" items={CategoryStatistics} />
    </div>
  );
};

export default Statistics;
