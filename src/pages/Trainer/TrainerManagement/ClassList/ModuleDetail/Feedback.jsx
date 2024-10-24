import React, { useState, useEffect, useRef } from 'react';
import { Rate, Collapse, Progress, Button, Modal } from 'antd';
import { fetchFeedbackData } from '../../../../../services/feedback/feedback'; 

const { Panel } = Collapse;

const Feedback = ({ moduleData, onBackClick }) => {
  const [selectedRating, setSelectedRating] = useState('All');
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReason, setCurrentReason] = useState('');
  const feedbackRef = useRef(null); // To reference the feedback section

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackResponse = await fetchFeedbackData(moduleData.id, 'phuongdp_test');
        const feedbacks = feedbackResponse.feedback;

        setFeedbackData(feedbacks);
        setAverageRating(feedbackResponse.averageRating);

        // Count the number of feedbacks per rating
        const counts = feedbacks.reduce((acc, feedback) => {
          const roundedRating = Math.round(feedback.averageRating);
          acc[roundedRating] = (acc[roundedRating] || 0) + 1;
          return acc;
        }, {});

        setRatingCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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

  return (
    <div className="p-4 sm:p-6 w-full mx-auto bg-white rounded-lg shadow-md" ref={feedbackRef}>
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Average</h2>
        <Rate value={Math.round(averageRating)} disabled />
        <div className="text-3xl sm:text-4xl font-bold">{averageRating.toFixed(1)}</div>
      </div>

      {/* Rating Filter Section */}
      <div className="grid grid-cols-2 sm:flex sm:justify-center sm:space-x-4 gap-2 sm:gap-0 mb-6">
        {['All', 5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="text-center">
            <Button
              type={selectedRating === rating ? 'primary' : 'default'}
              onClick={() => filterFeedback(rating)}
              className="w-full sm:w-auto"
            >
              {rating === 'All' ? 'All' : `${rating} ★`} ({rating === 'All' ? feedbackData.length : (ratingCounts[rating] || 0)})
            </Button>
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      {filteredData.map((feedback, index) => (
        <Collapse
          key={index}
          defaultActiveKey={['0']}
          className="mb-4"
          expandIconPosition="end"
        >
          <Panel
            header={
              <div className="flex items-center">
                <Rate value={Math.round(feedback.averageRating)} disabled />
                <span className="ml-2">Module's feedback: {feedback.moduleFeedback}</span>
              </div>
            }
            key={index}
          >
            <p>Trainer's feedback: {feedback.trainerFeedback}</p>
            {feedback.feedbackQuestion.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="font-semibold mt-4">{category.questionTypeName}</h3>
                {category.feedbackResponse.map((detail, detailIndex) => (
                  <div
                    key={detailIndex}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2"
                  >
                    <span className="flex-1">{detail.question}</span>
                    <div className="flex flex-row items-center space-x-2">
                      {/* Progress Bar */}
                      <Progress
                        percent={(Number(detail.rating) / 5) * 100}
                        showInfo={false}
                        strokeColor="#1890ff"
                        className="w-full sm:w-80"
                      />
                      {/* Detail Button */}
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
        getContainer={feedbackRef.current} // Set the container to the feedback section
        centered // Center the modal
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
