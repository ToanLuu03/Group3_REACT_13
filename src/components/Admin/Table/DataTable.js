import React from 'react';
import moment from 'moment';

const DataTable = ({ data }) => {
    // Define an array for the table header and the keys of the data
    const tableHeaders = [
        { label: 'Schedule', key: 'className' },
        { label: 'Topic', key: 'moduleName' },
        { label: 'Trainer ID', key: 'trainerId' },
        { label: 'Delivery Type', key: 'contentDeliveryType' },
        { label: 'Training Format', key: 'contentTrainingFormat' },
        { label: 'Status', key: 'contentIsDone', transform: (value) => (value ? 'Reported' : 'On going') },
        { label: 'Planned Date', key: 'contentPlannedDate', transform: (value) => moment(value).format('DD-MM-YYYY') },
        { label: 'Actual Date', key: 'reportActualDate', transform: (value) => moment(value).format('DD-MM-YYYY') },
        { label: 'Duration', key: 'reportDuration' },
        { label: 'Note', key: 'reportNote' },
        { label: 'Mismatch Reason', key: 'reportReason' },
    ];

    return (
        <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
                <tr>
                    {tableHeaders.map((header, index) => (
                        <th key={index} className='table-header'>{header.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index}>
                            {tableHeaders.map((header) => (
                                <td key={header.key} className='table-body'>
                                    {header.transform ? header.transform(item[header.key]) : item[header.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="11">No data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DataTable;
