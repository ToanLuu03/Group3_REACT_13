import { Table } from 'antd';
import moment from 'moment';
import './DataTable.css';
import MergedCell from '../../../../../components/Admin/MergedCell/MergedCell';

const DataTable = ({ data }) => {

  const startDate = data.length > 0 ? moment(data[0].startDate).format('DD/MM/YYYY') : 'N/A';
  const endDate = data.length > 0 ? moment(data[0].endDate).format('DD/MM/YYYY') : 'N/A';
  const Classes = data.length > 0 ? data[0].className : 'No classes available';
  const Module = data.length > 0 ? data[0].moduleName : 'No classes available';

  const columns = [
    {
      title: () => <div className="text-center">Topic</div>,
      dataIndex: 'moduleName',
      key: 'moduleName',
      fixed: 'left',
      className: 'w-[150px] sm:w-[200px]',
      responsive: ['xs'],
      render: (value, _, index) => MergedCell({
        value,
        data,
        index,
        fieldName: 'moduleName',
        className: 'text-center'
      })
    },
    {
      title: () => <div className="text-center">Contents</div>,
      dataIndex: 'topicName',
      key: 'topicName',
      fixed: 'left',
      className: 'w-[150px] sm:w-[200px]',
      responsive: ['sm'],
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Trainer/ Class Admin',
      dataIndex: 'trainerId',
      key: 'trainerId',
      align: "center",
      responsive: ['md'],
      render: (value, _, index) => MergedCell({
        value: value || 'No data',
        data,
        index,
        fieldName: 'trainerId'
      })
    },
    {
      title: 'Delivery Type',
      dataIndex: 'contentDeliveryType',
      key: 'contentDeliveryType',
      align: "center",
      responsive: ['lg'],
    },
    {
      title: 'Training Format',
      dataIndex: 'contentTrainingFormat',
      key: 'contentTrainingFormat',
      align: "center",
      responsive: ['lg'],
    },
    {
      title: 'Schedule Date',
      dataIndex: 'contentPlannedDate',
      key: 'contentPlannedDate',
      align: "center",
      responsive: ['sm'],
      render: (value, _, index) => {
        const formattedValue = moment(value).format('YYYY-MM-DD');
        const formattedData = data.map(item => ({
          ...item,
          contentPlannedDate: moment(item.contentPlannedDate).format('YYYY-MM-DD')
        }));
        
        return MergedCell({
          value: formattedValue,
          data: formattedData,
          index,
          fieldName: 'contentPlannedDate'
        });
      }
    },
    {
      title: 'Actual Date',
      dataIndex: 'reportActualDate',
      key: 'reportActualDate',
      align: "center",
      responsive: ['md'],
      render: (value, _, index) => {
        const formattedValue = moment(value).format('YYYY-MM-DD');
        const formattedData = data.map(item => ({
          ...item,
          reportActualDate: moment(item.reportActualDate).format('YYYY-MM-DD')
        }));
        
        return MergedCell({
          value: formattedValue,
          data: formattedData,
          index,
          fieldName: 'reportActualDate'
        });
      }
    },
    {
      title: 'Duration (hour)',
      dataIndex: 'reportDuration',
      key: 'reportDuration',
      align: "center",
      responsive: ['lg'],
    },
    {
      title: 'Note',
      dataIndex: 'reportNote',
      key: 'reportNote',
      align: "center",
      responsive: ['xl'],
    },
    {
      title: 'Mismatch Reason',
      dataIndex: 'reportReason',
      key: 'reportReason',
      align: "center",
      responsive: ['xl'],
    },
    {
      title: 'Status',
      dataIndex: 'contentIsDone',
      key: 'contentIsDone',
      align: "center",
      responsive: ['md'],
      render: (value) => (value ? 'Reported' : 'On going'),
    },
  ];

  return (
    <div className="overflow-x-auto">
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-6 ml-2 sm:ml-4 md:ml-8">
          <div className="text-[12px] sm:text-[14px] md:text-[16px] font-[700]">Class: <span className="date">{Classes}</span></div>
          <div className="text-[12px] sm:text-[14px] md:text-[16px] font-[700]">Module: <span className="date">{Module}</span></div>
          <div className="text-[12px] sm:text-[14px] md:text-[16px] font-[700]">Start Date: <span className="date">{startDate}</span></div>
          <div className="text-[12px] sm:text-[14px] md:text-[16px] font-[700]">End Date: <span className="date">{endDate}</span></div>
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
          pagination={{ 
            pageSize: 4,
            responsive: true,
          }}
          scroll={{
            x: true
          }}
        />
      </div>
    </div>
  );
};

export default DataTable;
