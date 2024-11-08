import { Table } from 'antd';
import moment from 'moment';
import './DataTable.css';

const DataTable = ({ data }) => {

  const startDate = data.length > 0 ? moment(data[0].startDate).format('DD/MM/YYYY') : 'N/A';
  const endDate = data.length > 0 ? moment(data[0].endDate).format('DD/MM/YYYY') : 'N/A';
  const Classes = data.length > 0 ? data[0].className : 'No classes available';
  const Module = data.length > 0 ? data[0].moduleName : 'No classes available';

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topicName',
      key: 'topicName',
      fixed: 'left',
      className: 'w-[200px] ',
      render: (text) => <span className="text-center">{text}</span>,
    },
    {
      title: 'Contents',
      dataIndex: 'moduleName',
      key: 'moduleName',
      fixed: 'left',
      className: 'w-[200px]',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Trainer/ Class Admin',
      dataIndex: 'trainerId',
      key: 'trainerId',
      className: 'text-center',
      render: (value, _, index) => {
        const previousRecord = index > 0 ? data[index - 1].trainerId : null;
        const currentTrainerId = data[index].trainerId;

        let rowSpan = 1;
        if (currentTrainerId === previousRecord) {
          rowSpan = 0;
        } else {
          let count = 1;
          while (index + count < data.length && currentTrainerId === data[index + count].trainerId) {
            count++;
          }
          rowSpan = count;
        }

        return {
          children: value || 'No data',
          props: { rowSpan },
        };
      },
    },
    {
      title: 'Delivery Type',
      dataIndex: 'contentDeliveryType',
      key: 'contentDeliveryType',
      className: 'text-center',
    },
    {
      title: 'Training Format',
      dataIndex: 'contentTrainingFormat',
      key: 'contentTrainingFormat',
      className: 'text-center',

    },
    {
      title: 'Schedule Date',
      dataIndex: 'contentPlannedDate',
      key: 'contentPlannedDate',
      className: 'text-center',
      render: (value, _, index) => {
        const previousRecord = index > 0 ? data[index - 1].contentPlannedDate : null;
        const currentDate = data[index].contentPlannedDate;

        let rowSpan = 1;
        if (moment(currentDate).format('YYYY-MM-DD') === moment(previousRecord).format('YYYY-MM-DD')) {
          rowSpan = 0;
        } else {
          let count = 1;
          while (
            index + count < data.length && 
            moment(currentDate).format('YYYY-MM-DD') === moment(data[index + count].contentPlannedDate).format('YYYY-MM-DD')
          ) {
            count++;
          }
          rowSpan = count;
        }

        return {
          children: moment(value).format('YYYY-MM-DD'),
          props: { rowSpan },
        };
      },
    },
    {
      title: 'Actual Date',
      dataIndex: 'reportActualDate',
      key: 'reportActualDate',
      className: 'text-center',
      render: (value, _, index) => {
        const previousRecord = index > 0 ? data[index - 1].reportActualDate : null;
        const currentDate = data[index].reportActualDate;

        let rowSpan = 1;
        if (moment(currentDate).format('YYYY-MM-DD') === moment(previousRecord).format('YYYY-MM-DD')) {
          rowSpan = 0;
        } else {
          let count = 1;
          while (
            index + count < data.length && 
            moment(currentDate).format('YYYY-MM-DD') === moment(data[index + count].reportActualDate).format('YYYY-MM-DD')
          ) {
            count++;
          }
          rowSpan = count;
        }

        return {
          children: moment(value).format('YYYY-MM-DD'),
          props: { rowSpan },
        };
      },
    },
    {
      title: 'Duration (hour)',
      dataIndex: 'reportDuration',
      key: 'reportDuration',
      className: 'text-center',
    },
    {
      title: 'Note',
      dataIndex: 'reportNote',
      key: 'reportNote',
      className: 'text-center',
    },
    {
      title: 'Mismatch Reason',
      dataIndex: 'reportReason',
      key: 'reportReason',
      className: 'text-center',
    },
    {
      title: 'Status',
      dataIndex: 'contentIsDone',
      key: 'contentIsDone',
      className: 'text-center items-center',
      render: (value) => (value ? 'Reported' : 'On going'),
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <div className="flex flex-wrap gap-4 md:gap-8 mb-6 ml-4 md:ml-8">
          <div className="text-[14px] md:text-[16px] font-[700]">Class: <span className="date">{Classes}</span></div>
          <div className="text-[14px] md:text-[16px] font-[700]">Module: <span className="date">{Module}</span></div>
          <div className="text-[14px] md:text-[16px] font-[700]">Start Date: <span className="date">{startDate}</span></div>
          <div className="text-[14px] md:text-[16px] font-[700]">End Date: <span className="date">{endDate}</span></div>
        </div>
      )}

      <div style={{ minHeight: '300px' }}>
        <Table
          className='text-center'
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          bordered
          size="middle"
          pagination={{ pageSize: 4 }}
          scroll={{
            x: 'calc(700px + 100%)',
          }}
        />
      </div>
    </>
  );
};

export default DataTable;
