import React, { useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { fetchFeedbackDataStart } from "../../../features/portal/portalSlice";
import './FeedbackChart.css';
import { useSelector, useDispatch } from "react-redux";
const colorMap = { 2022: "#6666CC", 2023: "#00CCFF", 2024: "#003366" };

const FeedbackChart = ({ selectedMetrics, selectedClasses, dateRange }) => {
    const dispatch = useDispatch();
    const { feedbackData, loading, error } = useSelector((state) => state.portal);


    useEffect(() => {
        dispatch(fetchFeedbackDataStart());
    }, [dispatch]);

    console.log(feedbackData);

    const filteredFeedbackData = useMemo(() => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            return [];
        }
        return feedbackData.filter(item => {
            const isMetricSelected = selectedMetrics.length === 0 || selectedMetrics.includes(item.metric);
            const isClassSelected = selectedClasses.length === 0 || selectedClasses.includes(item.class);
            const isInDateRange = item.year >= dateRange[0].year() && item.year <= dateRange[1].year();
            return isMetricSelected && isClassSelected && isInDateRange;
        });
    }, [feedbackData, selectedMetrics, selectedClasses, dateRange]);

    const groupedFeedbackData = useMemo(() => {
        const grouped = {};
        filteredFeedbackData.forEach(item => {
            const key = `${item.metric} (${item.class})`;
            if (!grouped[key]) {
                grouped[key] = { metricClass: key };
                Object.keys(colorMap).forEach(year => {
                    grouped[key][year] = 0;
                });
            }
            grouped[key][item.year] = item.value;
        });
        return Object.values(grouped);
    }, [filteredFeedbackData]);

    if (loading) {
        return <div className="loading-container">Loading feedback data...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (selectedMetrics.length === 0 || selectedClasses.length === 0) {
        return <div className="empty-state-container">Please choose Metrics and Classes</div>;
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

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={groupedFeedbackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metricClass" />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip />
                    {Object.keys(colorMap).map(year => (
                        <Bar key={year} dataKey={year} fill={colorMap[year]} name={year} barSize={40}>
                            <LabelList dataKey={year} position="top" />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
        //fdsfsdfsdfsd
    );
};

export default FeedbackChart;
