// import {Button, ConfigProvider, Input, Space, Table} from 'antd';
import { ConfigProvider, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PreviousCourses = () => {
  const [moduleType, setModuleType] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Code",
      dataIndex: "moduleCode",
      align: "center",
      color: "white",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Credit Value",
      dataIndex: "moduleCredit",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Total Study Hours",
      dataIndex: "totalStudyHours",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Time Tabled Hours",
      dataIndex: "timetabledHours",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Private Study Hours",
      dataIndex: "privateStudyHours",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Insights",
      dataIndex: "insights",
      align: "center",
      render: (item) => (
        <p
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white",
          }}
          onClick={() => navigate(`/insight/${item}`)}
        >
          View Insights
        </p>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      const result = await axios.get(
        "http://localhost:3001/module/fetch-all-codes"
      );
      const modifiedData = result.data.map((obj) => {
        const { _id, ...rest } = obj;
        return { key: _id, ...rest, insights: rest?.moduleCode };
      });
      setModuleType(modifiedData);
    })();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#051650",
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerColor: "white",
              headerBg: "#051650",
              borderColor: "white",
              rowHoverBg: "none",
              rowBg: "#051650",
              colorBgContainer: "#051650",
              // colorPrimary: "white"
            },
          },
        }}
      >
        <Table
          style={{ paddingTop: "4rem", marginBottom: '50px', height: "auto", width: "auto" }}
          columns={columns}
          dataSource={moduleType}
          bordered
          pagination={false}
        />
      </ConfigProvider>
    </div>
  );
};
export default PreviousCourses;
