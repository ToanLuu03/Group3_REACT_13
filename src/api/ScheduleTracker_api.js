import axios from 'axios';

// Helper function for API calls
const makeApiRequest = async (url, token) => {
  if (!token) {
    console.warn('Authorization token is not set.');
    return null;
  }

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response?.data;
  } catch (error) {
    console.error('API request failed:', error.response?.data || error.message);
    return null;
  }
};

// Base extractor function for common fields
const extractBaseFields = (moduleItem, classItem, content) => ({
  className: classItem?.className || '',
  classId: classItem?.classId || '',
  moduleName: moduleItem?.moduleName || '',
  moduleId: moduleItem?.moduleId || '',
  startDate: moduleItem?.startDate || null,
  endDate: moduleItem?.endDate || null,
  topicName: content?.topicName || '',
  contentName: content?.contentName || '',
  topicId: content?.topicId || '',
  contentIsDone: content?.contentIsDone || false,
  contentDeliveryType: content?.contentDeliveryType || '',
  contentTrainingFormat: content?.contentTrainingFormat || '',
  contentPlannedDate: content?.contentPlannedDate || null,
  topicPlannedDate: content?.topicPlannedDate || null,
  reportActualDate: content?.reportActualDate || null,
  reportDuration: content?.reportDuration || '',
  reportNote: content?.reportNote || '',
  reportReason: content?.reportReason || '',
});

// Generic data extractor
const extractData = (data, type = 'trainer') => {
  if (!data?.data || !Array.isArray(data.data)) {
    console.warn(`Invalid ${type} data:`, data);
    return [];
  }

  return data.data.flatMap(item => {
    const trainerId = type === 'class_admin'
      ? (item?.trainerId || item?.classAdmin)
      : type === 'trainer'
        ? item?.trainerId
        : '';

    const classes = type === 'class' ? [item] : item?.classes || [];

    return classes.flatMap(classItem =>
      (classItem?.modules || []).flatMap(moduleItem =>
        (moduleItem?.contents || []).map(content => ({
          trainerId: type === 'class' ? moduleItem?.trainerId : trainerId,
          ...extractBaseFields(moduleItem, classItem, content)
        }))
      )
    );
  });
};

// API endpoints
const API_BASE = 'https://fams-app.ap-southeast-2.elasticbeanstalk.com/api';
const ENDPOINTS = {
  TRAINER: `${API_BASE}/v1/admin/schedule-tracker?option=TRAINER`,
  CLASS: `${API_BASE}/v1/admin/schedule-tracker?option=CLASS`,
  CLASS_ADMIN: `${API_BASE}/v1/admin/schedule-tracker?option=CLASS_ADMIN`,
  LOGS: (classId, moduleId) => `${API_BASE}/v3/logs?classId=${classId}&moduleId=${moduleId}`,
  SEARCH_LOGS: (classId, moduleId, startDate, endDate) =>
    `${API_BASE}/v3/logs/search?classId=${classId}&moduleId=${moduleId}&startDate=${startDate}&endDate=${endDate}`
};

// Exported functions
export const fetchDataTrainer = async () => {
  const data = await makeApiRequest(ENDPOINTS.TRAINER, localStorage.getItem('token'));
  return data ? extractData(data, 'trainer') : [];
};

export const fetchDataClass = async () => {
  const data = await makeApiRequest(ENDPOINTS.CLASS, localStorage.getItem('token'));
  return data ? extractData(data, 'class') : [];
};

export const fetchDataClassAdmin = async () => {
  const data = await makeApiRequest(ENDPOINTS.CLASS_ADMIN, localStorage.getItem('token'));
  return data ? extractData(data, 'class_admin') : [];
};

export const fetchDataLog = async (classId, moduleId) => {
  if (!classId || !moduleId) {
    console.warn('ClassId and ModuleId are required parameters');
    return [];
  }

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Authentication token not found - user is not logged in');
    return [];
  }

  const data = await makeApiRequest(
    ENDPOINTS.LOGS(classId, moduleId),
    localStorage.getItem('token')
  );

  if (!data) {
    console.error('Failed to fetch logs - Unauthorized access or server error');
    return [];
  }

  return (data?.success && data?.data) ? data.data : [];
};

export const searchLogs = async (classId, moduleId, startDate, endDate) => {
  if (!classId || !moduleId || !startDate || !endDate) {
    console.warn('All parameters (classId, moduleId, startDate, endDate) are required');
    return [];
  }

  const data = await makeApiRequest(
    ENDPOINTS.SEARCH_LOGS(classId, moduleId, startDate, endDate),
    localStorage.getItem('token')
  );

  return (data?.success && data?.data) ? data.data : [];
};


