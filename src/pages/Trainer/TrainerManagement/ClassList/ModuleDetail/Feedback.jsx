import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Progress, Button, Modal, Spin } from 'antd';
import { fetchFeedbackData } from '../../../../../services/feedback/feedback';

const { Panel } = Collapse;

const Feedback = ({ moduleData, onBackClick }) => {
  const [selectedRating, setSelectedRating] = useState('All');
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReason, setCurrentReason] = useState('');
  const feedbackRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackResponse = await fetchFeedbackData(moduleData.id, username , token);
        const feedbacks = feedbackResponse.feedback;

        setFeedbackData(feedbacks);
        setAverageRating(feedbackResponse.averageRating);

        const counts = feedbacks.reduce((acc, feedback) => {
          const roundedRating = Math.round(feedback.averageRating);
          acc[roundedRating] = (acc[roundedRating] || 0) + 1;
          return acc;
        }, {});

        setRatingCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [moduleData.id]);

  const filterFeedback = (rating) => {
    setSelectedRating(rating);
  };

  const filteredData =
    selectedRating === 'All'
      ? feedbackData
      : feedbackData.filter((feedback) => Math.round(feedback.averageRating) === Number(selectedRating));

  const showModal = (reason) => {
    setCurrentReason(reason);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const sortedData = [...filteredData].sort((a, b) => b.averageRating - a.averageRating);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
    );
  }

  return (
    <div ref={feedbackRef}>
      <div className='w-fit shadow-lg rounded-lg'>
        <div className="flex items-center w-fit space-x-4 p-4">
    {/* Average Rating Section */}
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold mx-3">Average</span>
        <div className="flex items-center space-x-1">
          <span className="text-3xl font-bold mt-3">{averageRating.toFixed(1)}</span>
            <span className="text-yellow-400 text-3xl mt-3">★</span>
        </div>
    </div>

  {/* Rating Distribution with Progress Bars */}
  <div className="flex flex-col space-y-1 w-fit">
    {[...Array(5)].map((_, i) => {
      const ratingCount = ratingCounts[5 - i] || 0;
      const totalVotes = feedbackData.length;
      console.log(totalVotes)
      const percentage = totalVotes > 0 ? (ratingCount / totalVotes) * 100 : 0;

      return (
        <div key={i} className="flex items-center">
          <div className="flex gap-2">
            {[...Array(5)].map((_, j) => (
              <span
                key={j}
                className={`text-2xl ${
                  j < 5 - i ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          {/* Replace custom progress bar with antd Progress component */}
          <Progress
            percent={percentage}
            showInfo={false}
            strokeColor="#FFD700" // Yellow color for the filled part
            trailColor="#D3D3D3" // Gray color for the background
            strokeWidth={8} // Thickness of the bar
            className="ml-3 w-[10vw]"
          />
          <span className="ml-2 text-gray-500">{ratingCount}</span>
        </div>
      );
    })}
  </div>
</div>



      {/* Updated Filter Section */}
      <div className="flex items-center space-x-2 p-4 w-fit border-t-gray-200 border-t-2">
        <span className="text-gray-400 font-bold text-2xl">Filter:</span>
        {['All', 5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => filterFeedback(rating)}
            className={`flex items-center justify-center min-w-9 w-[4vw] h-9 px-3 py-1 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-full border ${
              selectedRating === rating
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            {rating === 'All' ? (
              'All'
            ) : (
              <span className="flex items-center space-x-1">
                <span>{rating}</span>
                <span className="text-yellow-400 text-2xl pb-1">★</span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
        <br/>
      {/* Feedback Section */}
      
      {sortedData.map((feedback, index) => (
        <Collapse key={index} defaultActiveKey={['0']} className="mb-4" expandIconPosition="end">
          <Panel
            header={
              <div className="flex items-start space-x-2">
                {/* Display rating with a star icon */}
                 <span className="flex items-center text-xl font-bold">
                  {Math.round(feedback.averageRating)}
                <span className="text-yellow-400 ml-1">★</span>
                </span>

                {/* Display feedback messages */}
                <div className="flex flex-col">
                  <p className="text-gray-800">Module's feedback: {feedback.moduleFeedback}</p>
                  <p className="text-gray-800">Trainer's feedback: {feedback.trainerFeedback}</p>
                </div>
              </div>

        
      }
      key={index}
    >
      {feedback.feedbackQuestion.map((category, catIndex) => (
        <div key={catIndex}>
          <h3 className="bg-gray-200 rounded text-center lg:mx-10 mt-4 p-1">{category.questionTypeName}</h3>
          {category.feedbackResponse.map((detail, detailIndex) => (
            <div key={detailIndex} className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:mx-10 mt-2">
              <span className="flex-1">{detail.question}</span>
              <div className="flex flex-row items-center space-x-2">
                <Progress percent={(Number(detail.rating) / 5) * 100} showInfo={false} strokeColor="#1890ff" className="w-[57vw] md:w-[25vw] lg:w-[25vw] lg:mr-6" />
                <Button onClick={() => showModal(detail.reason)}>Detail</Button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </Panel>
  </Collapse>
))}



      {/* Modal for showing the reason */}
      <Modal
        title="Feedback Detail"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={feedbackRef.current}
        centered
      >
        <p>{currentReason}</p>
      </Modal>

      {/* Back Button Section */}
      <div className="mt-6 sticky bottom-0 left-0 w-full bg-white py-2">
        <div className="border-t-2 pt-2">
          <button
            onClick={onBackClick}
            className="border border-gray-300 rounded-full py-1 px-4 text-gray-700 hover:bg-gray-100 transition-all"
          >
            Back to Class List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
