import React, { useState } from "react";
import "./DetailsModal.css";
import DetailsTable from "../EditableTable/DetailsTable";
import DetailsTable2 from "../EditableTable/DetailsTable2";
import {Button, Input} from "antd";
import axios from "axios";

const DetailsModal = ({
  toggleModal,
  hours,
  secondTableData,
  moduleCode,
  timetabledHours,
  credits,
}) => {
  const [teachingsData, setTeachingsData] = useState();
  const [assessmentsData, setAssessmentsData] = useState();
  const creditOptions = [
    {
      title: "7.5",
      value: "7.5",
    },
    {
      title: "15",
      value: "15",
    },
  ];

  const [hoursData, setHoursData] = useState(timetabledHours);
  const [creditsData, setCreditsData] = useState(credits || 0);

  const makePayloadObject = (inputData) => {
    try {
      return {
        moduleCode: inputData.code,
        moduleCredit: parseInt(inputData.credits, 10),
        timetabledHours: parseInt(inputData.timetabledHours, 10),
        lectures: parseInt(inputData.teachingsData.lectures, 10),
        seminars: parseInt(inputData.teachingsData.seminars, 10),
        tutorials: parseInt(inputData.teachingsData.tutorials, 10),
        labs: parseInt(inputData.teachingsData.labs, 10),
        fieldworkPlacement: parseInt(
          inputData.teachingsData.fieldwork_placement,
          10
        ),
        other: parseInt(inputData.teachingsData.other, 10),
        examPrep: {
          weightage: inputData.assessmentsData.examPrep.weightage,
          deadline: inputData.assessmentsData.examPrep.deadline,
        },
        courseworkPrep: inputData.assessmentsData.courseworkPrep.map(
          (item) => ({
            weightage: item.weightage,
            deadline: item.deadline,
          })
        ),
        classtestPrep: inputData.assessmentsData.classtestPrep.map((item) => ({
          weightage: item.weightage,
          deadline: item.deadline,
        })),
      };
    } catch (e) {
      console.log(e);
    }
  };

  const updateCourse = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/module/update/${moduleCode}`,
        data
      );
      if (response) {
        alert("Updated Successfully");
        toggleModal();
      }
    } catch (e) {
      console.log('Error while updating: ', e);
      alert("Please fill all the required fields!");
    }
  };

  const saveData = () => {
    const data = {
      teachingsData: teachingsData,
      assessmentsData: assessmentsData,
      timetabledHours: hoursData,
      credits: creditsData,
      code: moduleCode,
    };
    updateCourse(makePayloadObject(data));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-btn" onClick={toggleModal}>
          &times;
        </span>

        <div className="inputContainer">
          <div>
            <div className="texti" style={{color: "black"}}>Module Code</div>
            <div className="mutipleInput">
              <p>{moduleCode}</p>
            </div>
          </div>

          <div>
            <div className="texti" style={{color: "black"}}>Module Credit</div>
            <div id="Credit" className="inputSize">
              <select
                  name="credit"
                  id="credit"
                  value={creditsData}
                  onChange={(e) => setCreditsData(e.target.value)}
              >
                {creditOptions?.map((option, index) => (
                    <option
                        value={option?.value}
                        defaultValue={creditOptions[0]?.value}
                        key={index}
                    >
                      {option.title}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="texti" style={{color: "black"}}>TimeTabled Hours</div>
            <div id="timetable" className="inputSize">
              <Input
                  onChange={(e) => setHoursData(e.target.value)}
                  value={hoursData}
                  placeholder={"Enter Timetabled Hours"}
                  status={hours ? "" : "error"}
              />
            </div>
          </div>
        </div>


        <div className="table-div">
          <DetailsTable hours={hours} setTeachingsData={setTeachingsData} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <DetailsTable2
            data={secondTableData}
            setAssessmentsData={setAssessmentsData}
          />
        </div>
        <Button
          onClick={saveData}
          style={{
            color: "white",
            backgroundColor: "#b10062",
            fontWeight: "bold",
            // border: "2px solid #b10062",
            marginTop: "1rem",
            marginLeft: "80%",
          }}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default DetailsModal;
