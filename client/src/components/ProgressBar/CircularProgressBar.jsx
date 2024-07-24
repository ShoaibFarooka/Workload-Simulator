import React from "react";
import { Progress } from "antd";

const CircularProgressBar = ({ percentage, color }) => {
  return (
    <div className="circular-progress">
      <Progress
        type="circle"
        percent={percentage}
        width={100}
        strokeColor={color}
        strokeWidth={12}
        format={() => <p style={{color: "white"}}>{`${percentage}%`}</p>}
      />
    </div>
  );
};

export default CircularProgressBar;
