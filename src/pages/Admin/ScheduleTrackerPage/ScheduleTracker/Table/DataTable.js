import { Table, DatePicker, Button } from 'antd';
import moment from 'moment';
import './DataTable.css';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

const DataTable = ({ data }) => {
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const startDate = data.length > 0 ? moment(data[0].startDate).format('DD/MM/YYYY') : 'N/A';
  const endDate = data.length > 0 ? moment(data[0].endDate).format('DD/MM/YYYY') : 'N/A';
  const Classes = data.length > 0 ? data[0].className : 'No classes available';
  const Module = data.length > 0 ? data[0].moduleName : 'No classes available';
  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      applyDateFilter();
    } else {
      setFilteredData(data);
    }
  }, [data, dateRange]); // Thêm dateRange vào dependencies

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      applyDateFilter();
    } else {
      setFilteredData(data);
    }
  };
  const applyDateFilter = () => {
    if (!dateRange || dateRange.length !== 2) {
      setFilteredData(data);
      return;
    }

    const [start, end] = dateRange;
    console.log('Date Range:', {
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD')
    });

    const filtered = data.filter(item => {
      const itemDate = moment(item.contentPlannedDate);
      console.log('Item date:', {
        date: itemDate.format('YYYY-MM-DD'),
        contentPlannedDate: item.contentPlannedDate,
        isBetween: itemDate.isBetween(start, end, 'day', '[]')
      });
      return itemDate.isBetween(start, end, 'day', '[]');
    });

    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };
  const getUniqueOptions = (field) => {
    const uniqueValues = Array.from(new Set(data.map(item => item[field])));
    return uniqueValues.map(value => ({
      text: value,
      value: value,
    }));
  };

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topicName',
      key: 'topicName',
      fixed: 'left',
      className: 'w-[200px]',
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
      filters: getUniqueOptions('contentDeliveryType'),
      onFilter: (value, record) => record.contentDeliveryType.includes(value),
    },
    {
      title: 'Training Format',
      dataIndex: 'contentTrainingFormat',
      key: 'contentTrainingFormat',
      className: 'text-center',
      filters: getUniqueOptions('contentTrainingFormat'),
      onFilter: (value, record) => record.contentTrainingFormat.includes(value),
    },
    {
      title: 'Schedule Date',
      dataIndex: 'contentPlannedDate',
      key: 'contentPlannedDate',
      className: 'text-center',
      filterDropdown: ({ confirm }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
          <Button
            type="primary"
            onClick={() => {
              applyDateFilter();
              confirm();
            }}
            size="small"
            style={{ width: '100%', marginTop: 8 }}
          >
            Confirm
          </Button>
        </div>
      ),
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Actual Date',
      dataIndex: 'reportActualDate',
      key: 'reportActualDate',
      className: 'text-center',
      render: (value) => moment(value).format('YYYY-MM-DD'),
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
      className: 'text-center',
      filters: [
        { text: 'Reported', value: true },
        { text: 'On going', value: false },
      ],
      onFilter: (value, record) => record.contentIsDone === value,
      render: (value) => (value ? 'Reported' : 'On going'),
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <div className="flex gap-8 mb-6 ml-8">
          <div className="text-[16px] font-[700]">Class: <span className="date">{Classes}</span></div>
          <div className="text-[16px] font-[700]">Module: <span className="date">{Module}</span></div>
          <div className="text-[16px] font-[700]">Start Date: <span className="date">{startDate}</span></div>
          <div className="text-[16px] font-[700]">End Date: <span className="date">{endDate}</span></div>
        </div>
      )}

      <div style={{ minHeight: '300px' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
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
