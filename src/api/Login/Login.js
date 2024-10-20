// import axios from 'axios';

// export const login = async (username, password) => {
//     try {
//         const response = await axios.post('https://fams-test.fa.edu.vn/api/login', {
//             username,
//             password
//         });
//         localStorage.setItem('username', response.data.username);
//         localStorage.setItem('token', response.data.accessToken);
//         return response.data.roles;
//     } catch (error) {
//         console.error('Error logging in:', error);
//         throw new Error('Failed to log in');
//     }
// };


import axios from 'axios';

export const login = async () => {
    try {
        const token = 'eyJraWQiOiIwOTczMjFmNS0zMTJiLTQ1OWYtYTJiZC05ZjRlMGJiMjJlZTUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzI4NTcwMDA4LCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzI4Mzk3MjA4LCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.JegzmGgrsZBe-NAlbb56Y-ifZ-HQf4omzBHgO798nimq3f47jVg0w0S2AHt3R13p9DFFSG-zMuG5h5LcoF8NRpqPh7Y66cWEGPPeihACkajBUH73jDmLCj1ff6YpsX7mLbh7oeuwBZDdYVusnmxCJeZi2RZmf0IXpVSnqClsB1I15zyf-e3oJfwMT3AayMXlceiwisXQlDturJK8e5hKEBVM5hCscRpBfVVpbP9phPg2aGGUL2F-_NTQHE1SmrrbB4Wp6TJIvT94UJXrUJW1jIj1I_a9SNZIPZq755rsjTwfrSM_oI3P1-1A-ZZPxLo6bsjp69ihd6br96XRb9UMwQ';
        
        localStorage.setItem('token', token);
        
        return ['admin', 'user']; 
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Failed to log in');
    }
};