import React, { useState } from 'react';
import './Feedback.css'; // Import your CSS file
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

function Feedback({ moduleName, onBack }) {
  const [showMoreFeedback, setShowMoreFeedback] = useState(false);
  const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(1); // Start with 1 entry

  const handleToggleFeedback = () => {
    setShowMoreFeedback(!showMoreFeedback);
    // Toggle to show all feedback entries
    setVisibleFeedbackCount(showMoreFeedback ? 1 : feedbackData.length);
  };

  const handleDetailsClick = (label) => {
    alert(`Showing details for: ${label}`);
  };

  // Example feedback data
  const feedbackData = [
    {
      rating: "5 ★",
      moduleFeedback: "I have no problem in this part.",
      trainerFeedback: "I have learned many skills in Front End development, but some exercises are too difficult for beginners."
    },
    {
      rating: "4 ★",
      moduleFeedback: "Great content but could use more examples.",
      trainerFeedback: "The pace was a bit fast for me."
    },
    {
      rating: "5 ★",
      moduleFeedback: "Excellent training, learned a lot!",
      trainerFeedback: "The exercises were well-structured."
    },
    {
      rating: "3 ★",
      moduleFeedback: "The content was okay, but not engaging.",
      trainerFeedback: "More interactive sessions would help."
    },
    {
      rating: "5 ★",
      moduleFeedback: "Highly informative and well-presented.",
      trainerFeedback: "Very supportive throughout the training."
    },
  ];

  const onLoadMore = () => {
    // Increase the number of visible feedback entries
    setVisibleFeedbackCount(prevCount => Math.min(prevCount + 1, feedbackData.length));
  };

  const progressData = {
    program: [
      { label: "Training objectives are clearly defined", value: 80 },
      { label: "Level of course is appropriate for trainees", value: 90 },
      { label: "Materials distributed are appropriate", value: 85 },
    ],
    trainer: [
      { label: "Trainer's knowledge of the subject", value: 90 },
      { label: "Training content delivered as per curriculum", value: 88 },
      { label: "Trainer's instructions are clear", value: 92 },
      { label: "Trainer supports enthusiastically", value: 90  },
    ],
    Course: [
      { label: "The logistics are well-prepared.", value: 90 },
      { label: "The course information is clearly communicated to the trainees.", value: 88 },
      { label: "The Class Admin is supportive and helpful.", value: 92 },
      { label: "Are you willing to introducing this training course to your friends?", value: 95 },
    ],
  };

  return (
    <div className="feedback-container">
      <div className="rating-section">
        <div className="rating-header">
          <div className='rating-star'>
            <div className='hea'>
              <div className="average-rating">
                <h3>Average</h3>
                <div className="rating-score">
                  <span className="rating-number">5</span> 
                  ★
                </div>
              </div>
              <div className="rating-breakdown">
                <div>★★★★★ <span>10</span></div>
                <div>★★★★☆ <span>0</span></div>
                <div>★★★☆☆ <span>0</span></div>
                <div>★★☆☆☆ <span>0</span></div>
                <div>★☆☆☆☆ <span>0</span></div>
              </div>
            </div>
            <hr />
            <div className="filter-section">
              <span>Filter:</span>
              <button className="filter-button active">All</button>
              <button className="filter-button">5 ★</button>
              <button className="filter-button">4 ★</button>
              <button className="filter-button">3 ★</button>
              <button className="filter-button">2 ★</button>
              <button className="filter-button">1 ★</button>
            </div>
          </div>
        </div>
      </div>

      <div className="feedback-entries">
        {feedbackData.slice(0, visibleFeedbackCount).map((feedback, index) => (
          <div className="feedback-entry" key={index}>
            <h4>{feedback.rating}</h4>
            <p>
              <strong>Module's feedback:</strong> {feedback.moduleFeedback}
            </p>
            <p>
              <strong>Trainer's feedback:</strong> {feedback.trainerFeedback}
            </p>
          </div>
        ))}

        <div onClick={handleToggleFeedback} className="toggle-icon">
          {showMoreFeedback ? <CaretUpOutlined /> : <CaretDownOutlined />}
          {showMoreFeedback ? ' Hide Feedback' : ' Show More Feedback'}
        </div>

        {showMoreFeedback && (
          <>
            {feedbackData.slice(visibleFeedbackCount).map((feedback, index) => (
              <div className="feedback-entry" key={index}>
                <h4>{feedback.rating}</h4>
                <p>
                  <strong>Module's feedback:</strong> {feedback.moduleFeedback}
                </p>
                <p>
                  <strong>Trainer's feedback:</strong> {feedback.trainerFeedback}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Progress Bars for Program & Content */}
      <h3>Training Program & Content</h3>
      {progressData.program.map((item, index) => (
        <div className="progress-bar-container" key={index}>
          <span className="progress-label">{item.label}</span>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${item.value}%` }}></div>
          </div>
          <button className="details-button" onClick={() => handleDetailsClick(item.label)}>
            Details
          </button>
        </div>
      ))}

      {/* Progress Bars for Trainer/Coach */}
      <h3>Trainer/Coach</h3>
      {progressData.trainer.map((item, index) => (
        <div className="progress-bar-container" key={index}>
          <span className="progress-label">{item.label}</span>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${item.value}%` }}></div>
          </div>
          <button className="details-button" onClick={() => handleDetailsClick(item.label)}>
            Details
          </button>
        </div>
      ))}


<h3>Course  organization</h3>
      {progressData.Course.map((item, index) => (
        <div className="progress-bar-container" key={index}>
          <span className="progress-label">{item.label}</span>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${item.value}%` }}></div>
          </div>
          <button className="details-button" onClick={() => handleDetailsClick(item.label)}>
            Details
          </button>
        </div>
      ))}

      <div className="separator-line" />


      <div className="button-container">
        <div className="divider"></div> {/* Divider line */}


      </div>
      <div className='button'> 
        <button className="load-more-button" onClick={onLoadMore}>
          Load More
        </button>
      </div>

    </div>
  );
}

export default Feedback;
