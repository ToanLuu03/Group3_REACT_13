import { Table } from 'antd';
import moment from 'moment';
import './DataTable.css'; // Update or add any styles needed

const DataTable = ({ data, className }) => {
  const startDate = data.length > 0 ? moment(data[0].startDate).format('DD/MM/YYYY') : 'N/A';
  const endDate = data.length > 0 ? moment(data[0].endDate).format('DD/MM/YYYY') : 'N/A';

  const columns = [
    {
      title: 'Schedule',
      dataIndex: 'className',
      key: 'className',
      className: 'flex  '
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
      render: (value, _, index) => {
        const previousRecord = index > 0 ? data[index - 1].trainerId : null;
        //    const nextRecord = index < data.length - 1 ? data[index + 1].trainerId : null;
        const currentTrainerId = data[index].trainerId;

        let rowSpan = 1;
        if (currentTrainerId === previousRecord) {
          rowSpan = 0; // Merge with the previous cell
        } else {
          // Calculate the number of rows to merge
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
      className: 'flex text-center justify-center'

    },
  ];

  return (
    <>
      <div className="day">
        <div className="text">Start Date: <span className="date">{startDate}</span></div>
        <div className="text">End Date: <span className="date">{endDate}</span></div>
      </div>
      <div style={{ minHeight: '300px' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          bordered
          size="middle"
          pagination={{ pageSize: 5 }}
          scroll={{
            x: 'calc(700px + 100%)',
          }}
        />
      </div>
    </>

  );
};

export default DataTable;