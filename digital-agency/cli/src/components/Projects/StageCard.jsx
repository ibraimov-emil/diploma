import React, { useState } from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    completeOneTask,
    createOneStage,
    createOneTask,
    deleteOneProject, deleteOneTask,
    fetchProjects
} from "../../services/ProjectService";
import { Card, Checkbox, Row, Col, Input } from 'antd';
import { Button } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import StageTasks from "./StageTasks";
const StageCard = ({ project }) => {
    const queryClient = useQueryClient()
    const [cards, setCards] = useState([]);
    const [newCardTitle, setNewCardTitle] = useState('');

    const crateStage = () => {
        const newStage = {
            projectId: project.id,
            statusId: 3,
            name: newCardTitle,
        };
        try {
            // await ProjectService.deleteOneProject(id);
            createStageMutation.mutate(newStage)
            setNewCardTitle('')
        } catch (e) {
            alert(e)
            console.log(e);
        }
    }

    const createStageMutation  = useMutation(newStage => createOneStage(newStage),
        {onSuccess: () => queryClient.invalidateQueries(["project"])}
    )

    const createTaskMutation  = useMutation(newTask => createOneTask(newTask),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    const completeTaskMutation  = useMutation(check => completeOneTask(check),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    const deleteTaskMutation  = useMutation(taskId => deleteOneTask(taskId),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    // const {data: tasks, isLoading} = useQuery('projects', fetchProjects)

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    const handleTaskToggle = (cardIndex, taskIndex) => {
        const updatedCards = [...cards];
        updatedCards[cardIndex].tasks[taskIndex].completed = !updatedCards[cardIndex].tasks[taskIndex]
            .completed;
        setCards(updatedCards);
    };



    return (
        <div className="container mx-auto p-4">
            <Row gutter={[16, 16]}>
                {project.stages.map((stage) => (
                    <Col key={stage.id} xs={24} sm={12} md={6}>
                        <Card title={stage.name}>
                            <StageTasks
                                stageId= {stage.id}
                                createTaskMutation = {createTaskMutation}
                                completeTaskMutation = {completeTaskMutation}
                                deleteTaskMutation = {deleteTaskMutation}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="mt-4">
                <Input
                    rows={1}
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    className="mr-2"
                />
                <Button onClick={newCardTitle ? crateStage : ''} type="primary" className="mr-2">
                    Добавить этап
                </Button>
            </div>
        </div>
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

export default StageCard;