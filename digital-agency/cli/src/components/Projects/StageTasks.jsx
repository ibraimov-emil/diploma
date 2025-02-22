import React, {useContext, useState} from "react";
// // import { Card, Checkbox, Button } from 'e2j-react';
//     import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// import Card from "@mui/material/Card";
import {useQuery} from "react-query";
import {
    fetchMyTasksStage,
    fetchTasksStage,
} from "../../services/ProjectService";
import {Checkbox, List, Skeleton} from "antd";
import {Button} from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import {AiFillDelete} from "react-icons/ai";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";
import TaskForm from "./TaskForm";
import CustomModal from "../Commons/CustomModal";
import {EyeOutlined} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from 'antd';
// import {Col} from "react-bootstrap";
const StageTasks = ({
                        stageId,
                        createTaskMutation,
                        completeTaskMutation,
                        deleteTaskMutation,
                    }) => {
    const {user} = useContext(AuthContext);
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
            {!user.isClient && (
                <>
                    <CustomModal
                        title={'Добавить задачу'}
                        content={<TaskForm stageId={stageId}/>}
                    >
                        <Button
                            type="primary"
                            className="mt-4"
                        >
                            Добавить задачу
                        </Button>
                    </CustomModal>
                </>
            )}
            <InfiniteScroll
                className={`!overflow-visible`}
                dataLength={tasks.length}
                loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={tasks}
                    renderItem={(item) => (
                        <Badge.Ribbon className={`-m-1`} text={item.status?.name} color={item.statusColor}>
                            <List.Item divider={false} key={item.email}>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large}/>}
                                    title={<a href="https://ant.design">{item.name}</a>}
                                    description={item.description}
                                />
                                <div className={`flex gap-[10px] items-center`}>
                                    <CustomModal
                                        className={`cursor-pointer`}
                                        title={'Редактировать задачу'}
                                        content={<TaskForm stageId={stageId} id={item.id}/>}
                                    >
                                        <EyeOutlined
                                            className={`cursor-pointer`}
                                        />
                                    </CustomModal>
                                    {!user.isClient &&
                                        <AiFillDelete
                                            className={`cursor-pointer`}
                                            onClick={() => handleDeleteTask(item.id)}
                                            type="link"
                                            danger
                                        />
                                    }
                                </div>
                            </List.Item>
                        </Badge.Ribbon>
                    )}
                />
            </InfiniteScroll>
            {/*{tasks.map((task) => (*/}
            {/*    <button key={task.id} className="flex w-full justify-beetwen text-start mb-2 border rounded-[10px] p-4 cursor-pointer hover:bg-light-gray active:bg-main-bg">*/}
            {/*        <div>*/}
            {/*            <span>{task.name}</span>*/}
            {/*        </div>*/}
            {/*        <div className={`flex gap-[10px] ml-auto items-center`}>*/}
            {/*            <CustomModal*/}
            {/*                className={`cursor-pointer`}*/}
            {/*                title={'Редактировать задачу'}*/}
            {/*                content={<TaskForm stageId={stageId} id={task.id}/>}*/}
            {/*            >*/}
            {/*                <EyeOutlined*/}
            {/*                    className={`cursor-pointer`}*/}
            {/*                />*/}
            {/*            </CustomModal>*/}
            {/*            {!user.isClient &&*/}
            {/*                <AiFillDelete*/}
            {/*                    className={`cursor-pointer`}*/}
            {/*                    onClick={() => handleDeleteTask(task.id)}*/}
            {/*                    type="link"*/}
            {/*                    danger*/}
            {/*                />*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </button>*/}
            {/*))}*/}
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
