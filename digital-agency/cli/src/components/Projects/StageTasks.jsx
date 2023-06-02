import React, { useContext, useState } from "react";
// // import { Card, Checkbox, Button } from 'e2j-react';
//     import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// import Card from "@mui/material/Card";
import { useQuery } from "react-query";
import {
  fetchMyTasksStage,
  fetchTasksStage,
} from "../../services/ProjectService";
import { Checkbox } from "antd";
import { Button } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import { AiFillDelete } from "react-icons/ai";
import { AuthContext } from "../../contexts/authContext";
import { observer } from "mobx-react-lite";
// import {Col} from "react-bootstrap";
const StageTasks = ({
  stageId,
  createTaskMutation,
  completeTaskMutation,
  deleteTaskMutation,
}) => {
  const { user } = useContext(AuthContext);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery(["tasks", stageId], () =>
    user.isClient ? fetchMyTasksStage(stageId) : fetchTasksStage(stageId)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const handleAddTask = () => {
    const newTask = {
      stageId: stageId,
      name: newTaskTitle,
      description: "Необходимо " + newTaskTitle,
    };
    try {
      createTaskMutation.mutate(newTask);
      setNewTaskTitle("");
    } catch (e) {
      alert(e);
    }
  };

  const handleTaskToggle = (taskId) => {
    try {
      completeTaskMutation.mutate(taskId);
    } catch (e) {
      alert(e);
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      deleteTaskMutation.mutate(taskId);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center mb-2">
          <Checkbox
            checked={task.complete}
            onChange={() =>
              handleTaskToggle({ taskId: task.id, complete: !task.complete })
            }
            className="mr-2"
          />
          <span>{task.name}</span>
          {!user.isClient &&
          <AiFillDelete
            onClick={() => handleDeleteTask(task.id)}
            type="link"
            danger
            className="ml-auto"
          />
          }
        </div>
      ))}
      {!user.isClient && (
        <>
          <TextArea
            rows={1}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={() => (newTaskTitle ? handleAddTask(stageId) : "")}
            type="primary"
            className="mt-4"
          >
            Добавить задачу
          </Button>
        </>
      )}
    </>

    // <Card title={'stage.name'}>
    //     {tasks.map((task) => (
    //         <div key={task.id}>
    //             <CheckBoxComponent
    //                 checked={true}
    //                 onChange={() => handleTaskToggle(task.id)}
    //                 label={task.name}
    //             />
    //         </div>
    //     ))}
    //     <ButtonComponent onClick={handleSaveChanges}>Сохранить изменения</ButtonComponent>
    // </Card>
  );
};

export default observer(StageTasks);
