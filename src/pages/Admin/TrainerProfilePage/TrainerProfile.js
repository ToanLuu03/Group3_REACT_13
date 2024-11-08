import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Collapse,
  Select,
  Spin,
  notification,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useOutletContext } from "react-router-dom";
import {
  fetchTrainerInfo,
  updateTrainerInfo,
} from "../../../api/AdminAPI/Trainer_info_api";
import "./TrainerProfile.css";

const { Panel } = Collapse;
const { Option } = Select;

const trainerTypes = ["EXTERNAL", "INTERNAL", "STAFF"];
const trainerStatus = ["AVAILABLE", "BUSY", "OUT", "ONSITE"];
const trainerProfessionLevel = ["ADVANCE", "EXPERT", "STANDARD"];
const trainerCertifications = ["ADVANCE", "BASIC", "NONE"];
const trainerContributionTypes = ["TRAINER", "MENTOR", "AUDITOR"];

const skillOptions = ["React", "Java", "C#", "DOT NET"];
const levelOptions = [
  "INTERMEDIATE",
  "LIMITED_EXPERIENCE",
  "FUNDAMENTAL_AWARENESS",
  "ADVANCED",
  "EXPERT",
];

const TrainerProfile = () => {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [generalInfo, setGeneralInfo] = useState([]);
  const [activeCollapse, setActiveCollapse] = useState([]);
  const [skills, setSkills] = useState([]);
  const { collapsed } = useOutletContext();
  const [tempSkills, setTempSkills] = useState([]);
  const [tempGeneralInfo, setTempGeneralInfo] = useState([]);

  useEffect(() => {
    const getTrainerInfo = async () => {
      try {
        const account = localStorage.getItem("trainerAccount");
        const token = localStorage.getItem("token");

        const info = await fetchTrainerInfo(account, token);
        if (info?.generalInfo) {
          setTrainerInfo(info.generalInfo);
          setGeneralInfo([
            {
              label: "Full Name",
              value: info.generalInfo.name || "N/A",
              key: "name",
              isRequired: true,
            },
            {
              label: "Account",
              value: info.generalInfo.account || "N/A",
              key: "account",
              isRequired: true,
            },
            {
              label: "Contact Email",
              value: info.generalInfo.email || "N/A",
              key: "email",
              isRequired: true,
            },
            {
              label: "Phone",
              value: info.generalInfo.phone || "N/A",
              key: "phone",
              isRequired: true,
            },
            {
              label: "Employee ID",
              value: info.generalInfo.employeeId || "N/A",
              key: "employeeId",
              isRequired: true,
            },
            {
              label: "National ID",
              value: info.generalInfo.nationalId || "N/A",
              key: "nationalId",
            },
            {
              label: "Trainer Type",
              value: info.generalInfo.type || "N/A",
              key: "type",
            },
            {
              label: "Contribution Type",
              value: info.generalInfo.educatorContributionType || "N/A",
              key: "educatorContributionType",
            },
            {
              label: "Site",
              value: info.generalInfo.site || "N/A",
              key: "site",
            },
            {
              label: "Job Rank",
              value: info.generalInfo.jobRank || "N/A",
              key: "jobRank",
            },
            {
              label: "Trainer Rank",
              value: info.generalInfo.trainerRank || "N/A",
              key: "trainerRank",
            },
            {
              label: "Train The Trainer Certificate",
              value: info.generalInfo.trainTheTrainerCert || "N/A",
              key: "trainTheTrainerCert",
            },
            {
              label: "Professional Level",
              value: info.generalInfo.professionalLevel || "N/A",
              key: "professionalLevel",
            },
            {
              label: "Training Competency Index",
              value: info.generalInfo.trainingCompetencyIndex || "N/A",
              key: "trainingCompetencyIndex",
            },
            {
              label: "Professional Index",
              value: info.generalInfo.professionalIndex || "N/A",
              key: "professionalIndex",
            },
            {
              label: "Status",
              value: info.generalInfo.status || "N/A",
              key: "status",
            },
            {
              label: "Note",
              value: info.generalInfo.note || "N/A",
              key: "note",
            },
          ]);

        } else {
          setError("General information not available.");
        }

        if (info?.skills) {
          setSkills(info.skills);
        }
      } catch (err) {
        setError("Error fetching trainer information");
        console.error("Error:", err);
      }
    };

    getTrainerInfo();
  }, []);

  useEffect(() => {
    setTempGeneralInfo(generalInfo.map(item => ({ ...item }))); 
    setTempSkills(skills.map(item => ({...item})));
  }, [generalInfo])

  const handleChangeGeneral = (index, event) => {
    const newGeneralInfo = [...tempGeneralInfo];
    newGeneralInfo[index].value = event.target.value;
    setTempGeneralInfo(newGeneralInfo);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setActiveCollapse(["1", "2"]);
    setGeneralInfo([...tempGeneralInfo]);
    setSkills([...tempSkills]);
  };

  const handleSaveClick = async () => {
    let isGeneralInfoValid = true;

    tempGeneralInfo.forEach((info) => {
      const value =
        typeof info.value === "string" ? info.value.trim() : info.value;

      if (!value || value === "") {
        notification.warning({
          message: "Field Required",
          description: `${info.label} is required and cannot be empty.`,
          placement: "topRight",
        });
        isGeneralInfoValid = false;
      }
    });

    const isSkillsValid = tempSkills.every((skill) => {
      if (!skill.skill || !skill.level) {
        notification.warning({
          message: "Field Required",
          description: `Skill and Level fields are required and cannot be empty.`,
          placement: "topRight",
        });
        return false;
      }
      return true;
    });

    if (isGeneralInfoValid && isSkillsValid) {
      setIsEditing(false);
      setSkills(tempSkills);
      setGeneralInfo(tempGeneralInfo)
      const updatedGeneralInfo = generalInfo.reduce((acc, curr) => {
        if (curr.key) {
          acc[curr.key] = curr.value;
        }
        return acc;
      }, {});

      const updatedSkills = tempSkills.map((skill) => ({
        skillName: skill.skill,
        level: skill.level,
        note: skill.note,
      }));

      const updatedData = {
        ...updatedGeneralInfo,
        trainerSkills: updatedSkills,
      };

      try {
        const account = localStorage.getItem("trainerAccount");
        const token = localStorage.getItem("token");
        await updateTrainerInfo(account, updatedData, token);
        notification.success({
          message: "Update Successful",
          description: "The trainer information has been updated successfully.",
          placement: "topRight",
          duration: 3,
        });
      } catch (err) {
        notification.error({
          message: "Update Failed",
          description: "An error occurred while updating the information.",
          placement: "topRight",
          duration: 3,
        });
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempGeneralInfo([...generalInfo]);
    setTempSkills([...skills]);
  };

  const handleAddSkill = () => {
    setTempSkills([...tempSkills, { skill: "", level: "", note: "" }]);
  };

  const handleChangeSkill = (index, field, value) => {
    const newSkills = [...tempSkills];
    newSkills[index][field] = value;
    setTempSkills(newSkills);
  };

  const handleDeleteSkill = (index) => {
    const newSkills = [...tempSkills];
    newSkills.splice(index, 1);
    setTempSkills(newSkills);
  };

  const skillColumns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Skill",
      dataIndex: "skill",
      key: "skill",
      render: (text, record, index) =>
        isEditing ? (
          <Select
            value={text}
            onChange={(value) => handleChangeSkill(index, "skill", value)}
            className="w-full mt-[10px]"
          >
            {skillOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (text, record, index) =>
        isEditing ? (
          <Select
            value={text}
            onChange={(value) => handleChangeSkill(index, "level", value)}
            className="box-border w-full mt-[10px]"
          >
            {levelOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record, index) => (
        <div className="w-full max-lg:w-52">
          {isEditing ? (
            <Input
              value={text}
              onChange={(e) => handleChangeSkill(index, "note", e.target.value)}
              className="box-border xl:w-full max-xl:w-full"
            />
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <div className="w-24">
          {isEditing && (
            <Button
              className="border-red-500 hover:border-red-700 text-red-500 "
              onClick={() => handleDeleteSkill(index)}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      className="trainer-profile p-4 pb-28 md:pb-24"
      style={{ paddingBottom: "5rem" }}
    >
      {!trainerInfo ? (
        <div className="flex justify-start items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="trainer-container-profile h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide">
          <Collapse
            activeKey={activeCollapse}
            onChange={(key) => setActiveCollapse(key)}
            expandIconPosition="end"
            className="bg-gray-200 shadow-lg mb-5"
          >
            {/* General Info Collapse */}
            <Panel header="General Information" key="1" className="font-bold">
              <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 border overflow-y-auto">
                {tempGeneralInfo.map((item, index) => (
                  <div
                    key={index}
                    className={`flex border ${item.label === "Note" ? "xl:col-span-2 lg:col-span-1" : ""
                      }`}
                  >
                    <div
                      className={`${item.label === "Note"
                        ? "2xl:w-[24.111%] xl:w-[24.333%]  max-xl:w-[65.333333%] max-sm:w-[64.555555%]"
                        : "w-[40%]"
                        } bg-gray-100 text-start h-full p-2 font-semibold`}
                    >
                      {item.label}{" "}
                      {item.isRequired && (
                        <span className="text-red-500">*</span>
                      )}
                    </div>
                    <div
                      className={`${item.label === "Note" ? "w-full" : "w-[60%]"
                        } text-start flex items-center border-none mr-2 pl-2 font-normal`}
                    >
                      {isEditing ? (
                        item.label === "Account" ? (
                          <p>{item.value}</p>
                        ) : item.label === "Trainer Type" ? (
                          <Select
                            value={item.value}
                            onChange={(value) =>
                              handleChangeGeneral(index, {
                                target: { value },
                              })
                            }
                            className="w-full mt-[10px]"
                          >
                            {trainerTypes.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        ) : item.label === "Status" ? (
                          <Select
                            value={item.value}
                            onChange={(value) =>
                              handleChangeGeneral(index, {
                                target: { value },
                              })
                            }
                            className="w-full mt-[10px]"
                          >
                            {trainerStatus.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        ) : item.label === "Professional Level" ? (
                          <Select
                            value={item.value}
                            onChange={(value) =>
                              handleChangeGeneral(index, {
                                target: { value },
                              })
                            }
                            className="w-full mt-[10px]"
                          >
                            {trainerProfessionLevel.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        ) : item.label === "Train The Trainer Certificate" ? (
                          <Select
                            value={item.value}
                            onChange={(value) =>
                              handleChangeGeneral(index, {
                                target: { value },
                              })
                            }
                            className="w-full mt-[10px]"
                          >
                            {trainerCertifications.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        ) : item.label === "Contribution Type" ? (
                          <Select
                            value={item.value}
                            onChange={(value) =>
                              handleChangeGeneral(index, {
                                target: { value },
                              })
                            }
                            className="w-full mt-[10px]"
                          >
                            {trainerContributionTypes.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            value={item.value}
                            onChange={(event) =>
                              handleChangeGeneral(index, event)
                            }
                            className="w-full"
                          />
                        )
                      ) : item.label === "Status" ? (
                        <p>{item.value}</p>
                      ) : (
                        item.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Professional Skills Collapse */}
            <Panel header="Professional Skills" key="2" className="font-bold">
              <div className="overflow-x-auto font-normal">
                <Table
                  columns={skillColumns}
                  dataSource={tempSkills.map((skill, index) => ({
                    ...skill,
                    key: index,
                  }))}
                  pagination={false}
                  bordered
                />
              </div>
              {isEditing && (
                <div className="flex flex-col items-end gap-4 mt-4  font-normal">
                  <div className="w-full max-w-full my-0 mx-auto">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={handleAddSkill}
                      className="w-full"
                    >
                      Add new skill
                    </Button>
                  </div>
                </div>
              )}
            </Panel>
          </Collapse>
          <div
            className={`fixed bottom-0 left-0 ${collapsed ? "md:left-0" : "md:left-64"
              } right-0 bg-white p-4 flex flex-col md:flex-row justify-between border-t shadow-lg gap-2`}
          >
            <Button
              type="default"
              className="w-full md:w-auto text-sm md:text-base order-last md:order-first"
            >
              <Link to="/CLASS_ADMIN/trainer-list">Back to Trainers List</Link>
            </Button>

            <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto justify-end">
              {!isEditing ? (
                <Button
                  type="primary"
                  onClick={handleEditClick}
                  className="w-full md:w-auto text-sm md:text-base"
                >
                  Edit information
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={handleSaveClick}
                    className="w-full md:w-auto text-sm md:text-base"
                  >
                    Save
                  </Button>{" "}
                  <Button
                    onClick={handleCancelClick}
                    className="max-md:mb-2 w-full md:w-auto text-sm md:text-base"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
