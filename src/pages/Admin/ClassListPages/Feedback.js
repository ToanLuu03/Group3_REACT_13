import React, { useEffect, useState } from 'react'; 
import { Rate, Button, Progress, Divider, Card, Collapse, Typography, Row, Col, Grid } from 'antd';
import { fetchFeedBack } from '../../../api/AdminAPI/Classlist_api';

const Feedback = ({ moduleId }) => {
  const [ratingsData, setRatingsData] = useState([0, 0, 0, 0, 0]); 
  const [feedbackData, setFeedbackData] = useState([]); 
  const { Panel } = Collapse;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint(); 
  const { Text } = Typography;
  const trainerAcc = localStorage.getItem('trainerAccount');

  useEffect(() => {
    fetchFeedBack(moduleId, trainerAcc) 
      .then(data => {
        setRatingsData([
          data.data.star_5,
          data.data.star_4,
          data.data.star_3,
          data.data.star_2,
          data.data.star_1
        ]);
        setFeedbackData(data.data.feedback); 
      })
      .catch(error => {
        console.error(error);
      });
  }, [moduleId]); 

  const totalRatings = ratingsData.reduce((acc, val) => acc + val, 0);
  const averageRating = totalRatings > 0 
    ? (ratingsData.reduce((acc, val, idx) => acc + val * (5 - idx), 0) / totalRatings).toFixed(1) 
    : 0;
      const progressSize = 
    screens.xl ? [120,10] : screens.md ? [80,10] : screens.xs ? [40,10]: 0;
    


  const renderFeedbackPanels = () => {
    return feedbackData.map(feedback => (
      <Panel 
        key={feedback.id}
        header={
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ margin: '0px 16px 0px 16px', textAlign: 'center', flex: '0 1 100px' }}>
              <Typography.Title level={3}> {averageRating} <span style={{color:"#fadb14"}}> ★</span>  </Typography.Title>
            </div>
            <div style={{ flex: '1 1 auto' }}>
              <Typography.Title level={5}> Module's feedback: {feedback.moduleFeedback} </Typography.Title> 
              <Typography.Title level={5} style={{ marginTop: "0px" }}>Trainer's feedback: {feedback.trainerFeedback} </Typography.Title> 
            </div>
          </div>
        }
      >
        
        {feedback.feedbackQuestion.map((question, index) => (
       <div 
       key={index} 
       style={{ 
         display: 'flex', 
         justifyContent: 'space-between', 
         alignItems: 'center', 
         flexWrap: 'wrap',
         marginBottom: '10px',
         flexDirection: screens.xs ? 'column' : 'row', // Stack vertically on mobile
       }}
     >
       <div style={{ flex: 1, marginBottom: '10px' }}>
         <Text strong> {question.feedbackResponse[0].question} </Text>
       </div>
       <div style={{ flex: 1, textAlign: 'right', marginBottom: '10px' }}>
         <Progress 
           steps={5}
           size={progressSize}
           strokeLinecap="butt"
           percent={(question.feedbackResponse[0].rating / 5) * 100} 
           showInfo={false} 
           strokeColor="#1890FF" 
           style={{ width: '100%' }}
         />
       </div>
       <div style={{ textAlign: 'right', marginBottom: '10px' }}>
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



  return (
    <>
      <Card  style={{ backgroundColor: '#fff', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', width: screens.xl ? '50%' : '100%' }}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}  style={{ textAlign: 'center', marginTop:'24px' }}>
            <Typography.Title level={3}>Average</Typography.Title>
            <Typography.Title style={{margin:0}} level={2}>
              {averageRating} <span style={{ color: "#fadb14" }}> ★</span>
            </Typography.Title>
          </Col>
          <Col xs={24} sm={12} md={18} >
            {renderRatingBars()}
          </Col>
        </Row>
        <Divider />
        <div style={{ width: '100%', marginTop: '20px', textAlign: 'center' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter: </span>
          <Button style={{ borderRadius: '20px' }} type="default">All</Button>
          {[5, 4, 3, 2, 1].map(star => (
            <Button key={star} type="default" style={{ marginLeft: '10px', borderRadius: '20px' }}>
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
