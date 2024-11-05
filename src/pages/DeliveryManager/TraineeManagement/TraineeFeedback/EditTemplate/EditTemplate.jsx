import React, { useState } from 'react';
import { Card, Typography, Button, Form } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TraineeInformation, TextQuestion, FileUploadQuestion, RatingQuestion, DateQuestion } from './QuestionType';

const { Title, Text } = Typography;

const EditTemplate = () => {
    const [sections, setSections] = useState([{ id: Date.now(), questions: [] }]);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

    const toggleOptions = () => {
        setIsOptionsVisible(!isOptionsVisible);
    };

    const addNewSection = (type) => {
        const newSection = {
            id: Date.now(),
            questions: [{ type, id: Date.now() }]
        };
        setSections([...sections.slice(0, -1), newSection, { id: Date.now() + 1, questions: [] }]);
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
            case 'Trainee Information':
                return <TraineeInformation />;
            case 'Text':
                return <TextQuestion />;
            case 'File Upload':
                return <FileUploadQuestion />;
            case 'Rating':
                return <RatingQuestion />;
            case 'Date':
                return <DateQuestion />;
            default:
                return <Text>No Component Found</Text>;
        }
    };

    return (
        <div className="min-h-screen flex justify-center p-6">
            <div className="w-full max-w-3xl space-y-4">
                <Card className="shadow-lg relative">
                    <div className="absolute top-0 left-0 w-full h-5 bg-orange-500 rounded-t-md"></div>
                    <Title level={3} className="text-orange-600 text-center mb-2">
                        [FSA.LDC] TRAINING COURSE FEEDBACK FORM FOR INTERNSHIP
                    </Title>
                    <Text className="text-gray-500 block mb-2">16 June 2024</Text>
                    <Text className="text-black-700 font-sans block mb-4 leading-relaxed">
                        First of all, thank you for choosing FPT Software Academy to study and
                        enhance your knowledge and skills. In order to support you timely
                        during the course, we would like to receive your feedback!
                    </Text>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="sections">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {sections.map((section, index) => (
                                        <Draggable key={section.id} draggableId={String(section.id)} index={index}>
                                            {(provided) => (
                                                <Card
                                                    className="shadow-lg relative mb-4"
                                                    title={`Section ${index + 1}`}
                                                    extra={
                                                        index !== sections.length - 1 && (
                                                            <CloseOutlined
                                                                onClick={() => removeSection(section.id)}
                                                                style={{ fontSize: '16px', color: 'red', cursor: 'pointer' }}
                                                            />
                                                        )
                                                    }
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {section.questions.map((question) => (
                                                        <div key={question.id} className="mb-2">
                                                            {renderQuestionComponent(question)}
                                                        </div>
                                                    ))}

                                                    {index === sections.length - 1 && (
                                                        <Form layout="vertical">
                                                            <Form.Item>
                                                                {!isOptionsVisible && (
                                                                    <Button
                                                                        type="text"
                                                                        className="flex items-center text-blue-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200"
                                                                        icon={<PlusCircleOutlined className="mr-2 text-blue-600" />}
                                                                        onClick={toggleOptions}
                                                                    >
                                                                        Add new question
                                                                    </Button>
                                                                )}
                                                                {isOptionsVisible && (
                                                                    <>
                                                                        <Button
                                                                            type="text"
                                                                            icon={<CloseCircleOutlined className="mr-2 text-red-600" />}
                                                                            className="flex items-center text-red-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200"
                                                                            onClick={toggleOptions}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <div className="p-4 border border-gray-300 rounded-md bg-white shadow mt-4">
                                                                            <div className="grid grid-cols-3 gap-4">
                                                                                {["Trainee Information", "Text", "File Upload", "Rating", "Date"].map((type) => (
                                                                                    <Button
                                                                                        key={type}
                                                                                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 w-full"
                                                                                        onClick={() => addNewSection(type)}
                                                                                    >
                                                                                        {type}
                                                                                    </Button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </>
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
            </div>
        </div>
    );
};

export default EditTemplate;
