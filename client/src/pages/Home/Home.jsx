import "./Home.css";
import image from "../../assets/SWEAT_Landing_Page.jpeg";
import {useNavigate} from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={'main-div'}>

        <div className="div2">
          <h1>Student Workload Impact Evolution Tool</h1>
          <div className="description">
            predict the workload students will face throughout the academic
            year. streamline workload planning, making it easier for educators
            to create balanced and effective curricula. This tool offers
            valuable insights into the impact of various coursework activities
            on students time and resources.
          </div>
          <div className="btnConatiner">
            <div className="btn1">
              <button onClick={() => navigate('/previous-courses')}>MODULES</button>
            </div>
            <div className="btn2">
              <button onClick={() => navigate('/select-course')}>INPUT MODULES</button>
            </div>
          </div>
        </div>

        <div className="image-div">
          <img src={image} alt={"Landing page"} />
        </div>
    </div>
  );
};

export default Home;
