import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import CategoryFamsAdmin from '../../../components/Header/Category/CategoryFamsAdmin';

function TrainerManagement() {

  return (
    <div className="pt-14">
      <h1 className=" text-xl font-semibold ">Trainer Management</h1>
      <Tabs defaultActiveKey="1" items={CategoryFamsAdmin} />
    </div>)
}

export default TrainerManagement