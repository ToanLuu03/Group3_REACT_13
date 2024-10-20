import React, { useEffect, useState } from 'react'; 
import { Rate, Button, Progress, Divider, Card, Collapse, Typography} from 'antd';
import { fetchFeedBack } from '../../../api/AdminAPI/Classlist_api';

const Feedback = ({ moduleId }) => {
  const [ratingsData, setRatingsData] = useState([0, 0, 0, 0, 0]); // Initialize with default values
  const [feedbackData, setFeedbackData] = useState([]); // State for feedback data
  const [error, setError] = useState(false); // State for error
  const { Panel } = Collapse;

  const { Text, Link } = Typography;
  // ... existing code ...

  useEffect(() => {
    fetchFeedBack(moduleId) 
      .then(data => {
        // Update ratingsData with the fetched data
        setRatingsData([
          data.data.star_5,
          data.data.star_4,
          data.data.star_3,
          data.data.star_2,
          data.data.star_1
          
        ]);
        setFeedbackData(data.data.feedback); // Set feedback data
      })
      .catch(error => {
        console.error(error);
        setError(true); // Set error state on failure
      });
  }, [moduleId]); 

  
  const totalRatings = ratingsData.reduce((acc, val) => acc + val, 0);
  const averageRating = totalRatings > 0 
    ? (ratingsData.reduce((acc, val, idx) => acc + val * (5 - idx), 0) / totalRatings).toFixed(1) 
    : 0;

    const renderFeedbackPanels = () => {
      return feedbackData.map(feedback => (
        <Panel 
        key={feedback.id}
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ margin:'0px 16px 0px 16px', textAlign:'center' }}>
            <Typography.Title level={3}> {averageRating} <span style={{color:"#fadb14"}}> ★</span>  </Typography.Title>
            </div>
            <div >
              <Typography.Title level={5}> Module's feedback: {feedback.moduleFeedback} </Typography.Title> 
              <Typography.Title level={5} style={{marginTop:"0px"}}>Trainer's feedback: {feedback.trainerFeedback} </Typography.Title> 
            </div>
          </div>
        }
      >
        {feedback.feedbackQuestion.map((question, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1,  alignContent:"center" }}>
            <Text strong > {question.feedbackResponse[0].question} </Text> 
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              
              <Progress 
              steps= {5}
              size={[120, 10]}
                strokeLinecap="butt"
                percent={(question.feedbackResponse[0].rating / 5) * 100} 
                showInfo={false} 
                strokeColor="#1890FF" 
                style={{ width: '100%', borderRadius:'none' }}
                
              />
            </div>
            <div style={{  textAlign: 'right' }}>
              <Button type="link">Details</Button>
            </div>
          </div>
        ))} 
      </Panel>
      ));
    };

  const renderRatingBars = () => {
    return ratingsData.map((count, idx) => {
      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      return (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Rate disabled defaultValue={5 - idx} style={{ fontSize: '18px' }} />
          <Progress
            percent={percentage}
            showInfo={false}
            strokeColor="#fadb14"
            style={{ width: '50%', marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{count}</span>
        </div>
      );
    });
  };

  if (error) {
    return <Typography.Title style={{textAlign:'center', color:'#C7C7C7'}} level={2}> NO DATA AVAILABLE.</Typography.Title>;
  }
  
  return (
    <>
    <Card style={{ backgroundColor: '#fff', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', width:'570px'}}>
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px'}}>
      {/* Column for Average Rating */}
      <div style={{ flex: 1, paddingRight: '20px', textAlign:'center', marginTop:'16px' }}>
        <h2 > Average  </h2>
        <h2> {averageRating} <span style={{color:"#fadb14"}}> ★</span> </h2>
      </div>

      {/* Column for Star Ratings and Progress Bars */}
      <div style={{ flex: 4 }}>
        {renderRatingBars()}
      </div>

      {/* Filter Buttons */}
    </div>
    <Divider/>
          <div style={{ width: '100%', marginTop: '20px' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter: </span>
          <Button style={{  borderRadius:'20px' }} type="default">All</Button>
          {[5, 4, 3, 2, 1].map(star => (
            <Button key={star} type="default" style={{ marginLeft: '10px', borderRadius:'20px' }}>
              {star} <span style={{color:"#fadb14"}}> ★</span> 
            </Button>
          ))}
        </div>
        </Card>

        <Collapse expandIconPosition="right" style={{ marginTop: '20px' }}>
        {renderFeedbackPanels()}
      </Collapse>
        </>
  );
};

export default Feedback;
