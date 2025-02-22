import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchOneMyProject, fetchOneProject} from "../../services/ProjectService";
import {Descriptions, Divider, Skeleton} from "antd";
import {Header} from "../Dashboard";
import {fetchOneUser} from "../../services/UserService";
import {useQuery} from "react-query";
import StageCard from "./StageCard";
import {Button} from "@mui/material";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";
import {Avatar, List} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

const ProjectPage = () => {
    const {id} = useParams()
    const {user} = useContext(AuthContext)
    const {
        data: projectData,
        isLoading,
        isError
    } = useQuery(['project', id], () => user.isClient ? fetchOneMyProject(id) : fetchOneProject(id))

    const [userData, setUser] = useState({info: []})

    useEffect(() => {
        if (projectData && projectData.client && !user.isClient) {
            fetchOneUser(projectData.client.userId).then(data => setUser(data))
        } else {
            setUser(user.user)
        }
    }, [projectData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching project</div>;
    }

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

            <div className="flex justify-between items-center mb-4">
                <Header title={projectData.name}/>
                {!user.isClient &&
                    <Link to={`/projects/edit/` + id}>
                        <Button className='bottom-4' size="small" color="primary">
                            Редактировать
                        </Button>
                    </Link>
                }
            </div>
            <Descriptions className='max-w-[1240px]' title='Описание проекта'>
                <Descriptions.Item label="Клиент">{userData.name} {userData.surname}</Descriptions.Item>
                <Descriptions.Item label="Телефон">{userData.phone}</Descriptions.Item>
                <Descriptions.Item label="Статус">{projectData.status.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                <Descriptions.Item label="Услуга">
                    {projectData.service.name}
                </Descriptions.Item>
                <Descriptions.Item label="Описание">
                    {projectData.description}
                </Descriptions.Item>
            </Descriptions>
            <div
                id="scrollableDiv"
                className={`rounded-[10px] lg:w-[30%]`}
                style={{
                    height: 300,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={projectData.employees.length}
                    loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        header={<div>Участники</div>}
                        dataSource={projectData.employees}
                        renderItem={(item) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large}/>}
                                    title={<a href="https://ant.design">{item.id}</a>}
                                    description={item.description}
                                />
                                <div>Content</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
            <StageCard project={projectData}/>
        </div>
    );
};

export default observer(ProjectPage);

