import React, { useState } from "react";
import { Card, Typography, Button, Form, Modal, message, Tabs } from "antd";
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import {
  TraineeInformation,
  TextQuestion,
  FileUploadQuestion,
  RatingQuestion,
  DateQuestion,
} from "./QuestionType";

const { Title, Text } = Typography;

const EditTemplate = () => {
  const [sections, setSections] = useState([{ id: Date.now(), questions: [] }]);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const addNewSection = (type) => {
    const newSection = {
      id: Date.now(),
      questions: [{ type, id: Date.now() }],
    };
    setSections([
      ...sections.slice(0, -1),
      newSection,
      { id: Date.now() + 1, questions: [] },
    ]);
    setIsOptionsVisible(false);
  };

  const removeSection = (id) => {
    if (sections.length > 1 && id !== sections[sections.length - 1].id) {
      setSections(sections.filter((section) => section.id !== id));
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, movedSection);

    setSections(reorderedSections);
  };

  const renderQuestionComponent = (question) => {
    switch (question.type) {
      case "Trainee Information":
        return <TraineeInformation />;
      case "Text":
        return <TextQuestion />;
      case "File Upload":
        return <FileUploadQuestion />;
      case "Rating":
        return <RatingQuestion />;
      case "Date":
        return <DateQuestion />;
      default:
        return <Text>No Component Found</Text>;
    }
  };

  const handleSave = () => {
    Modal.confirm({
      title: "Custom Template",
      content: "Are you sure you want to save?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        message.success("Action saved successfully");
        navigate("/CLASS_ADMIN/trainee-management/trainee-feedback?tab=2"); // Redirect to Custom Template tab in TraineeFeedback
      },
      okButtonProps: {
        style: { backgroundColor: "green", color: "white" },
      },
      cancelButtonProps: {
        style: { color: "black" },
      },
    });
  };

  const handleBack = () => {
    Modal.confirm({
      title: "BACK TO CLASS TEMPLATE",
      content:
        "There are unsaved changes. Are you sure you want to go back to Class Template?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        navigate("/CLASS_ADMIN/trainee-management/trainee-feedback?tab=2"); // Redirect to Class Template tab in TraineeFeedback
      },
      okButtonProps: {
        style: { backgroundColor: "red", color: "white" },
      },
      cancelButtonProps: {
        style: { color: "black" },
      },
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <div>
          <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
            <Title level={3}>Trainee Feedback</Title>
          </div>
          <span className="text-xl font-semibold mb-2 text-gray-800 sticky top-[64px] bg-white z-10">
            Edit Template
          </span>
        </div>
      ),
      children: (
        <div className="min-h-screen flex justify-center bg-gray-100 p-6">
          <div className="w-full max-w-3xl space-y-6">
            <Card className="shadow-lg">
              <div className="w-full h-5 bg-orange-500 rounded-t-lg mb-4"></div>
              <Title level={3} className="text-orange-600 text-center">
                [FSA.LDC] Training Course Feedback Form for Internship
              </Title>
              <Text className="text-gray-500 text-center mb-4">
                16 June 2024
              </Text>
              <Text className="text-gray-700 text-center mb-4 leading-relaxed">
                First of all, thank you for choosing FPT Software Academy to
                study and enhance your knowledge and skills. In order to support
                you during the course, we would like to receive your feedback!
              </Text>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={String(section.id)}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              className="shadow-lg mb-4 border border-gray-200"
                              title={
                                <span className="font-semibold">
                                  Session {index + 1}
                                </span>
                              }
                              extra={
                                index !== sections.length - 1 && (
                                  <CloseOutlined
                                    onClick={() => removeSection(section.id)}
                                    style={{
                                      fontSize: "16px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                  />
                                )
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              {section.questions.map((question) => (
                                <div key={question.id} className="mb-3">
                                  {renderQuestionComponent(question)}
                                </div>
                              ))}

                              {index === sections.length - 1 && (
                                <Form layout="vertical">
                                  <Form.Item>
                                    {!isOptionsVisible && (
                                      <Button
                                        type="text"
                                        className="flex items-center text-blue-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200 transition"
                                        icon={
                                          <PlusCircleOutlined className="mr-2" />
                                        }
                                        onClick={toggleOptions}
                                      >
                                        Add new question
                                      </Button>
                                    )}
                                    {isOptionsVisible && (
                                      <div className="p-4 border border-gray-300 rounded-md bg-white shadow mt-4">
                                        <Button
                                          type="text"
                                          icon={
                                            <CloseCircleOutlined className="mr-2 text-red-600" />
                                          }
                                          className="flex items-center text-red-600 mb-4 transition"
                                          onClick={toggleOptions}
                                        >
                                          Cancel
                                        </Button>
                                        <div className="grid grid-cols-2 gap-4">
                                          {[
                                            "Trainee Information",
                                            "Text",
                                            "File Upload",
                                            "Rating",
                                            "Date",
                                          ].map((type) => (
                                            <Button
                                              key={type}
                                              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                                              onClick={() =>
                                                addNewSection(type)
                                              }
                                            >
                                              {type}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </Form.Item>
                                </Form>
                              )}
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <div
              className="fixed bottom-0 left-64 bg-white p-3 shadow-md flex justify-between items-center"
              style={{ width: "calc(100% - 16rem)" }}
            >
              <Button className="text-blue-500" onClick={handleBack}>
                Back to custom template
              </Button>
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <Tabs className="pt-16" defaultActiveKey="1" items={items} />;
};

export default EditTemplate;
