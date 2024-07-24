import "./CourseSelection.css";
import MyTable from "../../components/EditableTable/Table.jsx";
import MyTable2 from "../../components/EditableTable/Table2.jsx";
import { useState } from "react";
import axios from "axios";
import { Alert, Button, Input } from "antd";
import { PiWarningCircleLight } from "react-icons/pi";
const CourseSelection = () => {
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

  const courseCodes = [
    {
      id: 1,
      title: "ELEC",
    },
    {
      id: 2,
      title: "CS",
    },
  ];
  const [timetabledHours, setTimeTabledHours] = useState(null);
  const [credits, setCredits] = useState("");
  const [code, setCode] = useState(null);
  const [courseCode, setCourseCode] = useState("ELEC");
  const [teachingData, setTeachingData] = useState();
  const [assessmentsData, setAssessmentsData] = useState();
  const [error, setError] = useState(false);
  const [errorTwo, setErrorTwo] = useState(false);

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

  const createCourse = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/module/create",
        data
      );
      if (response) {
        alert(response?.data);
      }
    } catch (e) {
      alert("Please fill the required fields!");
    }
  };

  const saveData = () => {
    if (!teachingData) {
      setError(true);
      alert("Please save the schedule fields!");
      return;
    }
    if (!assessmentsData) {
      setErrorTwo(true);
      alert("Please save the assessments data!");
      return;
    }
    const data = {
      teachingsData: teachingData,
      assessmentsData: assessmentsData,
      timetabledHours: timetabledHours,
      credits: credits,
      code: courseCode + code,
    };

    createCourse(makePayloadObject(data));
  };

  return (
    <div className="rootContainer">
      <div className="rootc">
        <div className="rootn">
          <div className="heading">
            <h1>Input Module Details</h1>
          </div>
          <div className="inputContainer">
            <div>
              <div className="texti">Module Code</div>
              <div className="mutipleInput">
                <select
                  value={courseCode}
                  onChange={(e) => {
                    setCourseCode(e.target.value);
                  }}
                >
                  {courseCodes?.map((option, index) => (
                    <option
                      value={option?.title}
                      defaultValue={courseCodes[0]?.title}
                      key={index}
                    >
                      {option.title}
                    </option>
                  ))}
                </select>
                <Input
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={"Enter Module Code"}
                  status={code ? "" : "error"}
                />
              </div>
            </div>

            <div>
              <div className="texti">Module Credit</div>
              <div id="Credit" className="inputSize">
                <select
                  name="credit"
                  id="credit"
                  onChange={(e) => setCredits(e.target.value)}
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
              <div className="texti">TimeTabled Hours</div>
              <div id="timetable" className="inputSize">
                <Input
                  onChange={(e) => setTimeTabledHours(e.target.value)}
                  placeholder={"Enter Timetabled Hours"}
                  status={timetabledHours ? "" : "error"}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
            paddingLeft: "5%",
          }}
          className={"textui"}
        >
          <h1>Teaching Schedule</h1>
          <MyTable
            credits={credits}
            hours={timetabledHours}
            code={code}
            setTeachingData={setTeachingData}
            error={error}
            setError={setError}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
            paddingLeft: "5%",
          }}
          className={"textui"}
        >
          <h1>Assessments Schedule</h1>
          <MyTable2
            credits={credits}
            hours={timetabledHours}
            code={code}
            setAssessmentsData={setAssessmentsData}
            error={errorTwo}
            setError={setErrorTwo}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={saveData}
            style={{
              color: "#051650",
              backgroundColor: "white",
              fontWeight: "bold",
              border: "2px solid #b10062",
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
