import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Popconfirm,
  Table,
  Select, Tooltip,
} from "antd";
import {MdModeEditOutline} from "react-icons/md";
import {FaCheck} from "react-icons/fa";

const { Option } = Select;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex === "type" ? (
          <Select ref={inputRef} onPressEnter={save} onBlur={save}>
            <Option value="Course Work">Course Work</Option>
            <Option value="Class Test">Class Test</Option>
          </Select>
        ) : dataIndex === "deadline" ? (
          <Select ref={inputRef} onPressEnter={save} onBlur={save}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
              <Option key={week} value={`Week${week}`}>
                Week {week}
              </Option>
            ))}
          </Select>
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const DetailsTable2 = ({ data, setAssessmentsData }) => {
  const [dataSource, setDataSource] = useState(data);
  const [isEditable, setIsEditable] = useState(false);
  const [count, setCount] = useState(2);

  const defaultColumns = [
    {
      title: "Type",
      dataIndex: "type",
      width: "30%",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Weightage (%)",
      dataIndex: "weightage",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Deadline (Week)",
      dataIndex: "deadline",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Edit",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div style={{ display: "flex", gap: "20px" }}>
            <p
              onClick={() => setIsEditable(!isEditable)}
              style={{ color: "white", cursor: "pointer" }}
            >
              <Tooltip title={!isEditable ? "Edit": "Save"}>
                {!isEditable ? <MdModeEditOutline/>: <FaCheck/>}
              </Tooltip>
            </p>
          </div>
        ) : null,
    },
  ];

  const formatData = (inputArray) => {
    const formattedObject = {
      examPrep: {},
      courseworkPrep: [],
      classtestPrep: [],
    };

    inputArray.forEach((item) => {
      const formattedItem = {
        weightage: parseFloat(item.weightage),
        deadline: parseInt(item.deadline.replace("Week", ""), 10),
      };

      if (item.type === "Exam") {
        formattedObject.examPrep = formattedItem;
      } else if (item.type === "courseWork" || item.type === "Course Work") {
        formattedObject.courseworkPrep.push(formattedItem);
      } else if (item.type === "classTest" || item.type === "Class Test") {
        formattedObject.classtestPrep.push(formattedItem);
      }
    });

    return formattedObject;
  };

  const onSave = () => {
    const isWeightageValid = dataSource.every(
      (item) => !isNaN(parseFloat(item.weightage))
    );

    if (!isWeightageValid) {
      alert("Weightage must be a number for all entries.");
      return;
    }
    const totalWeightage = dataSource.reduce(
      (acc, item) => acc + parseFloat(item.weightage),
      0
    );
    if (totalWeightage !== 100) {
      alert("The sum of weightages must be equal to 100.");
      return;
    }

    setAssessmentsData(formatData(dataSource));
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: !(
          record.key === "0" &&
          (col.dataIndex === "type" || col.dataIndex === "deadline")
        ),
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div>
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
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </ConfigProvider>
      <Button
        onClick={onSave}
        style={{
          color: "#051650",
          backgroundColor: "white",
          fontWeight: "bold",
          border: "2px solid #b10062",
          marginTop: "1rem",
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default DetailsTable2;
