import React from 'react'
import { Tabs } from "antd";
import ScheduleTracker from './ScheduleTracker/ScheduleTracker';
import Log from './Log/Log'

function ScheduleTrackerPage() {

  const tabItems = [
    {
      key: '1',
      label: <div className="text-xl text-[#8A19A0] ">Schedule Tracker</div>,
      children: (
        <div className=''>
          <ScheduleTracker />
        </div>
      )
    },
    {
      key: '2',
      label: <span className="text-xl text-[#8A19A0] "> Log</span>,
      children: (
        <div className='text-2xl'>
          <Log />
        </div>
      )
    },

  ]
  return (
    <div className='pt-16'>
      <h1 className="text-3xl font-semibold">Schedule Tracker</h1>
      <hr />
      <div className=' '>
        <Tabs defaultActiveKey='1' centered items={tabItems} />
      </div>
    </div>
  )
}

export default ScheduleTrackerPage;
