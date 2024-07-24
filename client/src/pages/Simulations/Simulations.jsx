import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgressBar from "../../components/ProgressBar/CircularProgressBar.JSX";
import "./Simulations.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Label,
} from "recharts";
import DetailsModal from "../../components/DetailsModal/DetailsModal";

const Simulations = () => {
  const merge = (data, type) => {
    if (!Array.isArray(data)) {
      const newdata = {
        distribution: data["distribution"],
      };
      data["studyHours"] === undefined
        ? (newdata["hours"] = data["hours"])
        : (newdata["hours"] = data["studyHours"]);
      return newdata;
    } else {
      const merged = {};
      let hours = 0.0;
      for (const i of data) {
        i["distribution"][type].map((item) => {
          const weekIndex = item.week - 1;
          if (merged[weekIndex]) {
            merged[weekIndex].hours += item.hours;
          } else {
            merged[weekIndex] = { week: item.week, hours: item.hours };
          }
        });
        hours += i["studyHours"];
      }
      return { hours: hours, distribution: Object.values(merged) };
    }
  };
  const [modifiedData, setModifiedData] = useState([]);
  const [moduleType, setModuleType] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const [module, setModule] = useState("");
  const [hours, setHours] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("moderate");
  const [secondTableData, setSecondTableData] = useState();
  const [counter, setCounter] = useState(0);
  const [moduleCode, setModuleCode] = useState();
  const [timetabledHours, setTimetabledHours] = useState();
  const [totalHours, setTotalHours] = useState();
  const [privateHours, setPrivateHours] = useState();
  const [credits, setCredits] = useState();
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  async function extractInfo(key, name, data) {
    if (Array.isArray(data)) {
      const extractedArray = await Promise.all(
          data.map(async (item, index) => {
            const { deadline, weightage } = await item;
            return { key: key + index, type: name, deadline: "Week" + deadline, weightage };
          })
      );
      return extractedArray;
    } else if (typeof data === 'object' && data !== null) {
      const { deadline, weightage } = await data;
      return [{ key, type: name, deadline: "Week" + deadline, weightage }];
    } else {
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      const result = await axios.get(
        "http://localhost:3001/module/fetch-all-codes"
      );
      const moduleData = result.data.map((module) => module.moduleCode);
      setModule(moduleData[0])
      setModuleType(moduleData);
    })();
  }, []);

  useEffect(() => {
    if (module === "") return;
    (async () => {
      const result = await axios.get(
          "http://localhost:3001/module/fetch-data/" + module
      );
      setModuleCode(result?.data?.moduleCode);
      setCredits(result?.data?.moduleCredit);
      setTimetabledHours(result?.data?.timetabledHours);
      setTotalHours(result?.data?.totalStudyHours);
      setPrivateHours(result?.data?.privateStudyHours);
      setModuleData(result.data);

      // Store entire arrays
      const extractedInfoArray1 = await extractInfo(
          counter + 2,
          "Class Test",
          result.data.classtestPrep
      );
      const extractedInfoArray2 = await extractInfo(
          counter + 1,
          "Course Work",
          result.data.courseworkPrep
      );
      const extractedInfoArray3 = await extractInfo(
          counter,
          "Exam",
          result.data.examPrep
      );

      // Concatenate the arrays to get the final format
      const finalArray = extractedInfoArray3.concat(
          extractedInfoArray2,
          extractedInfoArray1
      );

      setSecondTableData(finalArray);
    })();
  }, [module]);



  console.log(secondTableData)
  useEffect(() => {
    if (type === undefined) return;
    if (type === "") {
      setModifiedData([]);
      return;
    }
    if (Object.keys(moduleData).length === 0) return;
    const result = [];
    const newdata = {};
    const listName = [
      "lectures",
      "seminars",
      "tutorials",
      "labs",
      "fieldworkPlacement",
      "other",
      "examPrep",
      "courseworkPrep",
      "classtestPrep",
    ];
    listName.forEach((item) => {
      newdata[item] = merge(moduleData[item], type);
    });
    console.log('List',listName)
    const HoursData = {};
    Object.keys(newdata).forEach(
      (item) => (HoursData[item] = newdata[item].hours)
    );
    setHours(HoursData);
    for (let week = 1; week <= 15; week++) {
      const weekObject = { name: `Week ${week}`, week };
      for (const category in newdata) {
        if (category !== "moduleCode" && category !== "moduleCredit") {
          const categoryData = newdata[category];
          if (categoryData.distribution) {
            const hoursForWeek =
              categoryData.distribution.find((item) => item.week === week)
                ?.hours || 0;
            weekObject[category] = hoursForWeek;
          }
        }
      }

      result.push(weekObject);
    }
    setModifiedData(result);
  }, [moduleData, type]);

  const makePercentage = (value) => {
    return (value / totalHours * 100).toFixed()
  }
  return (
    <div className="main-chart-container">
      {isOpen && (
        <DetailsModal
          toggleModal={toggleModal}
          hours={hours}
          secondTableData={secondTableData}
          moduleCode={moduleCode}
          credits={credits}
          timetabledHours={timetabledHours}
        />
      )}
      <div className="area-chart-container">
        <h1 className="firstHeading">Workload Graph</h1>
        <div className="chart">
          <ResponsiveContainer height={380}>
            <LineChart data={modifiedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" label={"Week"} />
              <YAxis
                domain={[0, 'dataMax']}
                interval="preserveStart"
                // tickCount={21}
              >
                <Label value="Study Hours" position="insideLeft" angle={-90} />
              </YAxis>
              {/* <YAxis >
                <Label value="Study Hours" position="insideLeft" angle={-90} />
              </YAxis> */}
              <Legend />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="examPrep"
                stroke="black"
                name="Exam Prep"
              />
              <Line
                type="monotone"
                dataKey="labHours"
                stroke="#FF6B6B"
                name="Lab Hours"
              />
              <Line
                type="monotone"
                dataKey="lectures"
                stroke="#66FF66"
                name="Lectures"
              />
              <Line
                type="monotone"
                dataKey="tutorials"
                stroke="#4169E1"
                name="Tutorials"
              />
              <Line
                type="monotone"
                dataKey="courseworkPrep"
                stroke="red"
                name="Coursework Prep"
              />
              <Line
                type="monotone"
                dataKey="classtestPrep"
                stroke="#800080"
                name="Class Test Prep"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="insights-container">
        <h1 className="secondHeading">Insights</h1>
        <div className="parent-insights">
          <div className="progress-1">
            <CircularProgressBar percentage={makePercentage(timetabledHours)} color={'#051650'} />
            <h2 className="h2First" >Time Tabled Hours</h2>
          </div>
          <div className="progress-1">
            <CircularProgressBar percentage={makePercentage(privateHours)} color={'#b10062'} />
            <h2 className="h2First">Private Study Hours</h2>
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="inputt"
        >
          <select
            name=""
            id=""
            value={module}
            onChange={(e) => setModule(e.target.value)}
          >
            {moduleType.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            defaultValue={"Study Style"}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Study Style" disabled>
              Study Style
            </option>
            <option value="earlybird">Early Bird</option>
            <option value="moderate">Moderate</option>
            <option value="procrastinator">Procrastinator</option>
          </select>
          <button className="details-btn" onClick={toggleModal}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulations;
