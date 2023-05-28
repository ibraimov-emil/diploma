import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {fetchOneProject, fetchProjects} from "../services/ProjectService";
import {Descriptions} from "antd";
import {Header} from "../components/Dashboard";
import ProjectList from "../components/Projects/ProjectList";
import {fetchOneUser} from "../services/UserService";
import {useQuery} from "react-query";
import StageCard from "../components/Projects/StageCard";


const ProjectPage = () => {
    const {id} = useParams()
    const {data: projectData, isLoading, isError} = useQuery(['project', id], () => fetchOneProject(id))

    const [user, setUser] = useState({info: []})

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
        <Header category="Page" title={projectData.name} />
        <Descriptions title={projectData.description}>
            <Descriptions.Item label="Клиент">{user.name} {user.surname}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Статус">{projectData.status.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Услуга">
                {projectData.service.name}
            </Descriptions.Item>
        </Descriptions>
        <StageCard project={projectData} />
    </div>
    );
};

export default ProjectPage;

