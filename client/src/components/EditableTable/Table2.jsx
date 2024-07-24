import React, { useContext, useEffect, useRef, useState } from "react";
import {Button, ConfigProvider, Form, Input, Table, Select, Tooltip} from "antd";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
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
            <Option value="courseWork">Course Work</Option>
            <Option value="classTest">Class Test</Option>
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
          <div>
            <Input
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              placeholder={"Percentage"}
            />
          </div>
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

const MyTable2 = (props) => {
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      type: "Exam",
      weightage: "Percentage",
      deadline: "Week15",
    },
  ]);
  const [isEditable, setIsEditable] = useState(false);
  const [count, setCount] = useState(2);

  const handleDelete = (key) => {
    if (key === "0") {
      return;
    }
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

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
            {record?.key === parseInt(record?.key) && (
              <p
                onClick={() => {
                  handleDelete(record.key);
                }}
                style={{ color: "white", cursor: "pointer" }}
              >
                <Tooltip title={'Delete'}>
                  <MdDelete />
                </Tooltip>
              </p>
            )}
            <p
              onClick={() => handleAdd()}
              style={{ color: "white", cursor: "pointer" }}
            >
              <Tooltip title={'Add'}>
                <IoMdAddCircleOutline />
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

      console.log(item)
      const formattedItem = {
        weightage: parseFloat(item.weightage),
        deadline: parseInt(item.deadline.replace("Week", ""), 10),
      };

      if (item.type === "Exam") {
        formattedObject.examPrep = formattedItem;
      } else if (item.type === "Course Work" || item.type === "courseWork") {
        formattedObject.courseworkPrep.push(formattedItem);
      } else if (item.type === "classTest") {
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

    props?.setError(false);
    props?.setAssessmentsData(formatData(dataSource));
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      type: "Course Work",
      weightage: "Percentage",
      deadline: "Week1",
      editable: isEditable,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
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
        danger={props?.error}
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

export default MyTable2;
