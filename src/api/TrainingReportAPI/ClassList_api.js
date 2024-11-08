import axios from 'axios';


const token = localStorage.getItem('token');

export const fetchClassList = async () => {
    

  try {
      const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/classes/class-list', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching :', error);
      throw new Error('Failed to fetch classlist');
  }
};


export const fetchClassDetail = async (classId) => { 

  try {
      const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/classes/class-detail/${classId}`, { // Use moduleId in the URL
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching :', error);
      throw new Error('Failed to fetch module details'); // Updated error message
  }
};

export const exportSchedule = async (moduleIds) => {
    try {
        const response = await axios.post(
            'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/export-schedule-tracker-report', 
            { id: moduleIds },  
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'  
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'schedule_report.xlsx'); 
        document.body.appendChild(link);
        link.click();  
        link.parentNode.removeChild(link);  

    } catch (error) {
        console.error('Error exporting schedule:', error);
        throw new Error('Failed to export schedule');
    }
};



