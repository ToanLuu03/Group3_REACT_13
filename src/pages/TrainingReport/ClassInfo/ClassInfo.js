import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {  Descriptions, Button, Typography, Spin } from 'antd'; // Import Button from Ant Design
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClassDetail } from '../../../api/TrainingReportAPI/ClassList_api';
import formatDate from '../../../utils/formatDate';

export default function ClassInfo() {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.state?.classId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClassDetail(classId);
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId]);

  if (loading) {
    return <Spin size="large" />;
  }
  if (!classData) return <div>No class data available</div>;

  const items = [
    { label: 'Class Name', children: classData.name },
    { label: 'Delivery Type', children: classData.deliveryType || 'N/A' },
    { label: 'Format Type', children: classData.formatType },
    { label: 'Request Group', children: classData.requestGroup || 'N/A' },
    { label: 'Request SubGroup', children: classData.requestSubgroup || 'N/A' },
    { label: 'Technical Group', children: classData.technicalGroup },
    { label: 'Site', children: classData.site || 'N/A' },
    { label: 'Location', children: classData.location || 'N/A' },
    { label: 'Expected Start Date', children: formatDate(classData.expectedStartDate,false) },
    { label: 'Expected End Date', children: formatDate(classData.expectedEndDate,false) },
    { label: 'Planned Trainee No.', children: classData.plannedTraineeNo },
    { label: 'Subject Type', children: classData.subjectType || 'N/A' },
    { label: 'Planned Revenue', children: classData.plannedRevenue || '0' },
    { label: 'Scope', children: classData.scope || 'N/A' },
    { label: 'Supplier/Partner', children: classData.supplier || 'N/A' },
    { label: 'Global SE', children: classData.globalSe || 'N/A' },
    { label: 'Job Recommendation', children: classData.jobRecommendation ? 'Yes' : 'No' },
    { label: 'Salary Paid', children: classData.salaryPaid ? 'Yes' : 'No' },
  ];

  const handleBackToClassList = () => {
    navigate('/CLASS_ADMIN/class-management/class-list');
  };

  return (
    <div className="module-details-container pr-5">

      <Typography.Title
        level={3}
        className="pl-8 p-4 bg-[#F5F5F5] rounded-[20px]"
      >
        General
      </Typography.Title>

      <Descriptions bordered column={{
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 3,
      }} items={items} />

      
      <div className="button-container mt-10">
        <Button type="primary" onClick={handleBackToClassList}>
          Back To Class List
        </Button>
      </div>
    </div>
  );
}