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
        return gpaData.filter(item => {
            const isTopicSelected = selectedTopics.length === 0 || selectedTopics.includes(item.topic);
            const isClassSelected = selectedClasses.length === 0 || selectedClasses.includes(item.class);
            const isInDateRange = item.year >= dateRange[0].year() && item.year <= dateRange[1].year();
            return isTopicSelected && isClassSelected && isInDateRange;
        });
    }, [gpaData, selectedTopics, selectedClasses, dateRange]);

    const groupedGpaData = useMemo(() => {
        const grouped = {};
        filteredGpaData.forEach(item => {
            const key = `${item.topic} (${item.class})`;
            if (!grouped[key]) {
                grouped[key] = { topicClass: key, '2022': 0, '2023': 0, '2024': 0 };
            }
            grouped[key][item.year] = item.gpa;
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

    // Prepare data for the table
    const tableData = filteredGpaData.map((item, index) => ({
        key: index,
        topic: item.topic,
        class: item.class,
        year: item.year,
        gpa: item.gpa,
    }));

    // Update pagination total when data changes
    useEffect(() => {
        setPagination(p => ({
            ...p,
            total: tableData.length,
        }));
    }, [tableData]);

    // Handle pagination change
    const handleTableChange = (pagination) => {
        setPagination(pagination); // update pagination state with current page and pageSize
    };

    if (loading) {
        return <div className="loading-state">Loading GPA data...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    if (selectedTopics.length === 0 || selectedClasses.length === 0 || !dateRange[0] || !dateRange[1]) {
        return <div className="empty-state-container">Please choose Topics, Classes and Date Range</div>;
    }

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

            <ResponsiveContainer style={{ marginBottom: "16px" }} width="100%" height={400}>
                <BarChart data={groupedGpaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topicClass" />
                    <YAxis domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                    <Tooltip />
                    {Object.keys(colorMap).map(year => (
                        <Bar key={year} dataKey={year} fill={colorMap[year]} name={year} barSize={40}>
                            <LabelList dataKey={year} position="top" />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>

            <div className="table-title">
                <p>GPA Table</p>
            </div>

            <Table
                columns={columns}
                dataSource={tableData}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                onChange={handleTableChange} // Handle page change event
                className="gpa-data-table"
            />
        </div>
    );
};

export default GpaChart;
