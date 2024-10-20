import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Table } from 'antd'; // Import Ant Design Table
import { fetchGpaDataStart } from "../../../features/portal/portalSlice";
import './GpaChart.css'; // Import the external CSS file

const colorMap = { 2022: "#6666CC", 2023: "#00CCFF", 2024: "#003366" };

const GpaChart = ({ selectedTopics, selectedClasses, dateRange }) => {
    const dispatch = useDispatch();
    const { gpaData, loading, error } = useSelector((state) => state.portal);

    console.log("gpadata:", gpaData);

    // Local state for pagination
    const [pagination, setPagination] = useState({
        current: 1, // default page number
        pageSize: 5, // default page size
        total: 0, // to be set later based on data length
    });

    useEffect(() => {
        dispatch(fetchGpaDataStart());
    }, [dispatch]);
const filteredGpaData = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) {
        return [];
    }
    
    return gpaData.data.filter(item => {
        const itemYear = new Date(item.endDate).getFullYear();
        const isTopicSelected = selectedTopics.length === 0 || selectedTopics.includes(item.moduleName);
        const isClassSelected = selectedClasses.length === 0 || selectedClasses.includes(item.className);
        const isInDateRange = itemYear >= dateRange[0].year() && itemYear <= dateRange[1].year();

        return isTopicSelected && isClassSelected && isInDateRange;
    });
}, [gpaData, selectedTopics, selectedClasses, dateRange]);

    const groupedGpaData = useMemo(() => {
        const grouped = {};
        filteredGpaData.forEach(item => {
            const itemYear = new Date(item.endDate).getFullYear();
            const key = `${item.moduleName} (${item.className})`;
            
            if (!grouped[key]) {
                grouped[key] = { topicClass: key, '2022': 0, '2023': 0, '2024': 0 };
            }
            grouped[key][itemYear] = item.gpa; // Assign the GPA for the relevant year
        });
        return Object.values(grouped);
    }, [filteredGpaData]);

    // Define columns for the Ant Design table
    const columns = [
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: 'Module',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'GPA',
            dataIndex: 'gpa',
            key: 'gpa',
        },
    ];

    const tableData = filteredGpaData.map(item => ({
        key: item.moduleName + item.className,
        class: item.className,
        topic: item.moduleName,
        year: new Date(item.endDate).getFullYear(),
        gpa: item.gpa
    }));
    
    return (
        <div className="chart-container">
            <div className="legend-container">
                {Object.keys(colorMap).map(year => (
                    <span className="legend-item" key={year}>
                        <span className="legend-color-box" style={{ backgroundColor: colorMap[year] }} />
                        {year}
                    </span>
                ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
        <div style={{ width: `${groupedGpaData.length * 560}px` }}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={groupedGpaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topicClass" />
                    <YAxis domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                    <Tooltip />
                    {Object.keys(colorMap).map((year) => (
                        <Bar key={year} dataKey={year} fill={colorMap[year]} name={year} barSize={40}>
                            <LabelList dataKey={year} position="top" />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>

            <div className="table-title">
                <p>GPA Table</p>
            </div>

            <Table
            columns={columns}
            dataSource={tableData}
            pagination={pagination}
            onChange={newPagination => setPagination(newPagination)}
        />
            
        </div>
    );
};

export default GpaChart;
