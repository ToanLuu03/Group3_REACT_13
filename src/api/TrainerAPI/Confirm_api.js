import axios from 'axios';

// Define your base URL and token
const BASE_URL = 'http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/confirm-module';

// Function to get trainer confirmation data
export const fetchDataConfirm = async (endpoint) => {
    try {
        const token = 'eyJraWQiOiIwOTczMjFmNS0zMTJiLTQ1OWYtYTJiZC05ZjRlMGJiMjJlZTUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzI4NTcwMDA4LCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzI4Mzk3MjA4LCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.JegzmGgrsZBe-NAlbb56Y-ifZ-HQf4omzBHgO798nimq3f47jVg0w0S2AHt3R13p9DFFSG-zMuG5h5LcoF8NRpqPh7Y66cWEGPPeihACkajBUH73jDmLCj1ff6YpsX7mLbh7oeuwBZDdYVusnmxCJeZi2RZmf0IXpVSnqClsB1I15zyf-e3oJfwMT3AayMXlceiwisXQlDturJK8e5hKEBVM5hCscRpBfVVpbP9phPg2aGGUL2F-_NTQHE1SmrrbB4Wp6TJIvT94UJXrUJW1jIj1I_a9SNZIPZq755rsjTwfrSM_oI3P1-1A-ZZPxLo6bsjp69ihd6br96XRb9UMwQ'; // Replace with your actual token or dynamic token handling
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data.classConfirmations;
    } catch (error) {
        console.error('Error fetching trainer data:', error);
        throw error; // Handle error as needed
    }
};
