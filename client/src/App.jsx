import "./App.css";
import CourseSelection from "./pages/CourseSelection/CourseSelection";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import PreviousCourses from "./pages/PreviousCourses/PreviousCourses.jsx";
import Simulations from "./pages/Simulations/Simulations";
import Insights from "./pages/Insights/Insights.jsx";
function App() {
  return (
    <div style={{ backgroundColor: "#051650", height: "100vh"}}>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/select-course"} element={<CourseSelection />} />
          <Route path={"/previous-courses"} element={<PreviousCourses />} />
          <Route path={"/simulations"} element={<Simulations />} />
          <Route path={"/insight/:id"} element={<Insights />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
