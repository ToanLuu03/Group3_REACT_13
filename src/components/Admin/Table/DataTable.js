import { Table } from 'antd';
import moment from 'moment';
import './DataTable.css'; // Update or add any styles needed

const DataTable = ({ data }) => {
  const startDate = data.length > 0 ? moment(data[0].startDate).format('DD/MM/YYYY') : 'N/A';
  const endDate = data.length > 0 ? moment(data[0].endDate).format('DD/MM/YYYY') : 'N/A';

  const columns = [
    {
      title: 'Schedule',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Topic',
      dataIndex: 'moduleName',
      key: 'moduleName',
    },
    {
      title: 'Trainer ID',
      dataIndex: 'trainerId',
      key: 'trainerId',
    },
    {
      title: 'Delivery Type',
      dataIndex: 'contentDeliveryType',
      key: 'contentDeliveryType',
    },
    {
      title: 'Training Format',
      dataIndex: 'contentTrainingFormat',
      key: 'contentTrainingFormat',
    },
    {
      title: 'Status',
      dataIndex: 'contentIsDone',
      key: 'contentIsDone',
      render: (value) => (value ? 'Reported' : 'On going'),
    },
    {
      title: 'Schedule Date',
      dataIndex: 'contentPlannedDate',
      key: 'contentPlannedDate',
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Actual Date',
      dataIndex: 'topicPlannedDate',
      key: 'reportActualDate',
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Duration',
      dataIndex: 'reportDuration',
      key: 'reportDuration',
    },
    {
      title: 'Note',
      dataIndex: 'reportNote',
      key: 'reportNote',
    },
    {
      title: 'Mismatch Reason',
      dataIndex: 'reportReason',
      key: 'reportReason',
    },
  ];

  return (
    <>
      <div className='day'>
        <div className='text'>Start Date: <span className='date'>{startDate} </span></div>
        <div className='text'>End Date: <span className='date'>{endDate} </span></div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => index}
        bordered
        size="middle"
        pagination={{ pageSize: 10 }} // Make sure this is set correctly
        scroll={{
          x: 'calc(700px + 100%)',
        }}
      />
    </>
  );
};

export default DataTable;