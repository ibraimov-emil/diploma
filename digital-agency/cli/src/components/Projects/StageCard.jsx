import React, {useContext, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    completeOneTask, createCostStage,
    createOneStage,
    createOneTask, deleteOneTask,
} from "../../services/ProjectService";
import {Card, Checkbox, Row, Col, Input, Divider, message, Progress, Tooltip} from 'antd';
import {Button} from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import StageTasks from "./StageTasks";
import * as ProjectService from "../../services/ProjectService";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
import { CheckCircleOutlined, DollarCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const StageCard = ({project}) => {
    const queryClient = useQueryClient()
    const {user} = useContext(AuthContext)
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardCost, setNewCardCost] = useState({});
    const [loading, setLoading] = useState({});
    
    // Define all mutations at the top level
    const createStageMutation = useMutation(newStage => createOneStage(newStage),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["project"]);
                message.success('Этап успешно создан');
            },
            onError: (error) => {
                message.error('Ошибка при создании этапа: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
            }
        }
    )

    const createCostStageMutation = useMutation(newStagePayment => createCostStage(newStagePayment),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["project"]);
                message.success('Счет успешно выставлен');
            },
            onError: (error) => {
                message.error('Ошибка при выставлении счета: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
                setLoading({});
            }
        }
    )

    const createTaskMutation = useMutation(newTask => createOneTask(newTask),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    const completeTaskMutation = useMutation(check => completeOneTask(check),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    const deleteTaskMutation = useMutation(taskId => deleteOneTask(taskId),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )
    
    // Ensure project is defined and has necessary properties
    if (!project) {
        return <div className="flex justify-center items-center h-60">
            <LoadingOutlined style={{ fontSize: 36 }} spin />
            <span className="ml-3 text-xl">Загрузка проекта...</span>
        </div>;
    }
    
    const crateStage = () => {
        const newStage = {
            projectId: project.id,
            statusId: 3,
            name: newCardTitle,
            cost: null
        };
        try {
            createStageMutation.mutate(newStage)
            setNewCardTitle('')
        } catch (e) {
            console.error(e);
            message.error('Ошибка при создании этапа');
        }
    }

    const handleAddCost = (stageId) => {
        // Input validation
        const costInput = newCardCost[stageId];
        const cost = parseFloat(costInput);
        
        console.log('Setting cost for stage:', stageId, 'Input value:', costInput, 'Parsed value:', cost);
        
        if (!cost || isNaN(cost) || cost <= 0) {
            message.error('Пожалуйста, введите корректную сумму (положительное число)');
            return;
        }

        setLoading({...loading, [stageId]: true});
        
        const newStagePayment = {
            stageId: stageId,
            cost: cost,
        };
        
        console.log('Sending stage payment data:', newStagePayment);
        
        try {
            createCostStageMutation.mutate(newStagePayment, {
                onSuccess: (data) => {
                    console.log('Cost stage mutation success, response:', data);
                    // Clear the input field and loading state
                    setNewCardCost({...newCardCost, [stageId]: ''});
                    setLoading({...loading, [stageId]: false});
                    
                    // If employee is setting cost and creating payment link at once, open it
                    if (!user?.isClient && data?.paymentLink) {
                        console.log('Opening payment link:', data.paymentLink);
                        window.open(data.paymentLink, '_blank');
                    }
                    
                    // Refresh the project data to show updated cost
                    queryClient.invalidateQueries(["project"]);
                },
                onError: (error) => {
                    console.error('Cost stage mutation error:', error);
                    setLoading({...loading, [stageId]: false});
                }
            });
        } catch (e) {
            console.error('Error in handleAddCost:', e);
            message.error('Ошибка при выставлении счета');
            setLoading({...loading, [stageId]: false});
        }
    }

    const handlePay = async (stageId) => {
        try {
            // Find the stage in the stages array
            const stage = project.stages.find(s => s.id === stageId);
            
            // Check if stage exists and has a cost
            if (!stage || !stage.cost) {
                message.error('Не задана стоимость этапа');
                return;
            }
            
            setLoading({...loading, [stageId]: true});
            const paymentLink = await ProjectService.createPaymentStage(stageId);
            setLoading({...loading, [stageId]: false});
            
            if (paymentLink) {
                // Open payment link in a new tab instead of replacing current page
                window.open(paymentLink, '_blank');
            } else {
                message.error('Не удалось получить ссылку на оплату');
            }
        } catch (e) {
            console.error(e);
            message.error('Ошибка при создании платежа: ' + (e.response?.data?.message || 'Неизвестная ошибка'));
            setLoading({...loading, [stageId]: false});
        }
    }

    // Calculate stage progress based on completed tasks
    const calculateStageProgress = (stage) => {
        if (!stage.tasks || !stage.tasks.length) return 0;
        const completedTasks = stage.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / stage.tasks.length) * 100);
    };

    // Ensure project.stages exists before rendering
    const stages = project.stages || [];

    return (
        <div className="mx-auto p-4">
            {!user?.isClient &&
                <div className="mb-6 bg-white p-5 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-3">Добавить новый этап проекта</h3>
                    <div className="flex items-center">
                        <Input
                            placeholder="Название нового этапа"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            className="mr-2 rounded-lg"
                            prefix={<PlusOutlined className="text-gray-400" />}
                        />
                        <Button 
                            onClick={newCardTitle ? crateStage : null} 
                            type="primary" 
                            className="rounded-lg"
                            disabled={!newCardTitle || createStageMutation.isLoading}
                            variant="contained"
                        >
                            {createStageMutation.isLoading ? 'Добавление...' : 'Добавить этап'}
                        </Button>
                    </div>
                </div>}
            <Row gutter={[20, 20]}>
                {stages.map((stage) => {
                    const progress = calculateStageProgress(stage);
                    return (
                    <Col key={stage.id} xs={24} md={12} xxl={8}>
                        <Card 
                            className="h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            title={
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">{stage.name}</span>
                                    {stage.cost && (
                                        <Tooltip title="Стоимость этапа">
                                            <span className="text-green-600 font-bold text-lg bg-green-50 py-1 px-3 rounded-full">
                                                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stage.cost)}
                                            </span>
                                        </Tooltip>
                                    )}
                                </div>
                            }
                            extra={
                                <Tooltip title="Прогресс выполнения этапа">
                                    <Progress 
                                        type="circle" 
                                        percent={progress} 
                                        width={35} 
                                        strokeColor={{ 
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                    />
                                </Tooltip>
                            }
                            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
                            bodyStyle={{ padding: '20px' }}
                        >
                            <StageTasks
                                stageId={stage.id}
                                createTaskMutation={createTaskMutation}
                                completeTaskMutation={completeTaskMutation}
                                deleteTaskMutation={deleteTaskMutation}
                            />
                            
                            {(stage.paymentStatus !== 'succeeded') && !user?.isClient && (
                                <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-300">
                                    <p className="text-gray-700 font-medium mb-3">Выставление счета:</p>
                                    <Input
                                        placeholder="Стоимость этапа в рублях"
                                        type="number"
                                        value={newCardCost[stage.id] || ''}
                                        onChange={(e) => setNewCardCost({...newCardCost, [stage.id]: e.target.value})}
                                        className="mb-3 rounded-lg"
                                        addonBefore={<DollarCircleOutlined />}
                                        addonAfter="₽"
                                    />
                                    <Button 
                                        onClick={() => handleAddCost(stage.id)} 
                                        variant="contained"
                                        color="primary"
                                        disabled={!newCardCost[stage.id] || loading[stage.id]}
                                        className="mt-2 w-full rounded-lg"
                                    >
                                        {loading[stage.id] ? 'Выставление счета...' : 'Выставить счёт'}
                                    </Button>
                                </div>
                            )}

                            {!stage.cost && !user?.isClient && (
                                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                                    <p className="text-amber-600 font-medium">Сначала установите стоимость этапа</p>
                                </div>
                            )}

                            {stage.cost && (
                                stage.paymentStatus !== 'succeeded'
                                    ?
                                    <Button
                                        disabled={
                                            loading[stage.id] || 
                                            !user?.user?.id || 
                                            !stage.cost ||
                                            (user?.isClient && (!project?.client?.userId || user.user.id !== project.client.userId))
                                        }
                                        onClick={() => handlePay(stage.id)}
                                        variant="contained" 
                                        color="success"
                                        className="mt-4 w-full rounded-lg"
                                    >
                                        {loading[stage.id] ? 'Подготовка платежа...' : user?.isClient ? 'Оплатить этап' : 'Сформировать счет'}
                                    </Button>
                                    :
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 text-center transition-all duration-300">
                                        <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
                                        <p className="text-green-600 font-medium">Счет оплачен</p>
                                    </div>
                            )}
                        </Card>
                    </Col>
                )})}
            </Row>
        </div>
    );
};

export default observer(StageCard);
