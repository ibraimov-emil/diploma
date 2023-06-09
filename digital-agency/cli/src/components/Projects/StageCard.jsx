import React, {useContext, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    completeOneTask, createCostStage,
    createOneStage,
    createOneTask,deleteOneTask,
} from "../../services/ProjectService";
import {Card, Checkbox, Row, Col, Input, Divider} from 'antd';
import { Button } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import StageTasks from "./StageTasks";
import * as ProjectService from "../../services/ProjectService";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
const StageCard = ({ project }) => {
    const queryClient = useQueryClient()
    const {user} = useContext(AuthContext)
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardCost, setNewCardCost] = useState({});
    const crateStage = () => {
        const newStage = {
            projectId: project.id,
            statusId: 3,
            name: newCardTitle,
            cost: null
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

    const handleAddCost = (stageId) => {
        const newStagePayment = {
            stageId: stageId,
            cost: Number(newCardCost[stageId]),
        };
        try {
            // await ProjectService.deleteOneProject(id);
            ccreateCostStageMutation.mutate(newStagePayment)
            setNewCardCost('')
        } catch (e) {
            alert(e)
            console.log(e);
        }
    }

    const handlePay = async  (stageId) => {
        try {
            const paymentLink = await ProjectService.createPaymentStage(stageId);
            // createStagePaymentMutation.mutate(stageId)
            setNewCardCost('')
            window.location.replace(paymentLink)
        } catch (e) {
            alert(e)
            console.log(e);
        }
    }

    const createStageMutation  = useMutation(newStage => createOneStage(newStage),
        {onSuccess: () => queryClient.invalidateQueries(["project"])}
    )

    const ccreateCostStageMutation  = useMutation(newStagePayment => createCostStage(newStagePayment),
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



    return (
        <div className="container mx-auto p-4">
            <Row gutter={[16, 16]}>
                {project.stages.map((stage) => (
                    <Col key={stage.id} xs={24} sm={12} md={6}>

                        <Card title={stage.name} extra={stage.cost ? `Стоимость: ${stage.cost} руб` : ''}>
                            <StageTasks
                                stageId= {stage.id}
                                createTaskMutation = {createTaskMutation}
                                completeTaskMutation = {completeTaskMutation}
                                deleteTaskMutation = {deleteTaskMutation}
                            />
                            {(stage.paymentStatus != 'succeeded') && !user.isClient && (
                                <>
                            <TextArea
                                 rows={1}
                                 value={newCardCost[stage.id] || ''}
                                 onChange={(e) => setNewCardCost({ ...newCardCost, [stage.id]: e.target.value })}
                                 className="mb-2"
                             />
                                <Button onClick={() => newCardCost ? handleAddCost(stage.id) : ''} type="primary" className="mt-4">
                                    Выставить счёт
                                </Button>
                                </>
                            )}

                            {/*succeeded*/}
                            {stage.cost && (
                                <Button onClick={() => stage.paymentStatus != 'succeeded' ? handlePay(stage.id) : window.location.replace(stage.paymentLink)} type="primary" color="success" className="mt-4">
                                    {stage.paymentStatus == 'succeeded' ? 'Оплачено' : 'Оплатить'}
                                </Button>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
            {!user.isClient &&
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
            }
        </div>
    );
};

export default observer(StageCard);