import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchOneMyProject, fetchOneProject} from "../../services/ProjectService";
import {Descriptions} from "antd";
import {Header} from "../Dashboard";
import {fetchOneUser} from "../../services/UserService";
import {useQuery} from "react-query";
import StageCard from "./StageCard";
import {Button} from "@mui/material";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";


const ProjectPage = () => {
    const {id} = useParams()
    const {user} = useContext(AuthContext)
    const {data: projectData, isLoading, isError} = useQuery(['project', id], () => user.isClient ? fetchOneMyProject(id) : fetchOneProject(id))

    const [userData, setUser] = useState({info: []})

    useEffect(() => {
        if (projectData && projectData.client) {
            fetchOneUser(projectData.client.userId).then(data => setUser(data))
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
        <Header category="Страница" title={projectData.name} />
        {!user.isClient &&
        <Link to={`/projects/edit/` + id}>
            <Button className='bottom-4' size="small" color="primary">
                Редактировать
            </Button>
        </Link>
        }
        <Descriptions className='max-w-[1240px]' title='Описание проекта'>
            <Descriptions.Item label="Клиент">{user.User.name} {user.User.surname}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{user.User.phone}</Descriptions.Item>
            <Descriptions.Item label="Статус">{projectData.status.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.User.email}</Descriptions.Item>
            <Descriptions.Item label="Услуга">
                {projectData.service.name}
            </Descriptions.Item>
            <Descriptions.Item label="Описание">
                {projectData.description}
            </Descriptions.Item>
        </Descriptions>
        <StageCard project={projectData} />
    </div>
    );
};

export default observer(ProjectPage);

