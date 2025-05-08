import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchOneMyProject, fetchOneProject} from "../../services/ProjectService";
import {Descriptions, Divider, Skeleton, Table, Tag, Typography} from "antd";
import {Header} from "../Dashboard";
import {fetchOneUser} from "../../services/UserService";
import {useQuery} from "react-query";
import StageCard from "./StageCard";
import {Button} from "@mui/material";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";
import {Avatar, List} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningOutlined } from '@ant-design/icons';
import ReportProjectIncident from './ReportProjectIncident';
import { QualityService } from '../../services';

const { Text, Title } = Typography;

const ProjectPage = () => {
    const {id} = useParams()
    const {user} = useContext(AuthContext)
    const [isIncidentModalVisible, setIsIncidentModalVisible] = useState(false);
    const {
        data: projectData,
        isLoading,
        isError
    } = useQuery(['project', id], () => user.isClient ? fetchOneMyProject(id) : fetchOneProject(id))

    // Fetch incidents related to this project
    const { data: allIncidents, isLoading: incidentsLoading } = useQuery('incidents', () => 
        QualityService.getIncidents()
    );

    // Filter incidents for this project
    const projectIncidents = React.useMemo(() => {
        if (!allIncidents || allIncidents.length === 0) return [];
        
        return allIncidents.filter(incident => {
            if (!incident.metadata) return false;
            
            try {
                const metadata = JSON.parse(incident.metadata);
                return metadata.relatedEntityType === 'project' && 
                       metadata.relatedEntityId === parseInt(id);
            } catch (e) {
                console.error('Error parsing incident metadata:', e);
                return false;
            }
        });
    }, [allIncidents, id]);

    const [userData, setUser] = useState({name: '', surname: '', phone: '', email: '', info: []})

    useEffect(() => {
        if (projectData && projectData.client && !user.isClient) {
            fetchOneUser(projectData.client.userId).then(data => setUser(data || {name: '', surname: '', phone: '', email: '', info: []}))
        } else if (user && user.user) {
            setUser(user.user)
        }
    }, [projectData, user]);

    const showIncidentModal = () => {
        setIsIncidentModalVisible(true);
    };

    const handleIncidentModalClose = () => {
        setIsIncidentModalVisible(false);
    };

    const incidentColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60
        },
        {
            title: 'Заголовок',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Дата',
            dataIndex: 'registrationTime',
            key: 'registrationTime',
            render: (text) => new Date(text).toLocaleString(),
            width: 180
        },
        {
            title: 'Важность',
            dataIndex: 'severity',
            key: 'severity',
            width: 120,
            render: (severity) => {
                let color = 'blue';
                if (severity === 'high') color = 'red';
                if (severity === 'medium') color = 'orange';
                if (severity === 'low') color = 'green';
                
                return <Tag color={color}>{severity.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                let color = 'orange';
                if (status === 'resolved') color = 'green';
                
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        }
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching project</div>;
    }

    if (!projectData || !userData) {
        return <div>Loading project data...</div>;
    }

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

            <div className="flex justify-between items-center mb-4">
                <Header title={projectData.name || 'Проект'}/>
                <div className="flex items-center gap-2">
                    <Button
                        startIcon={<WarningOutlined />}
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={showIncidentModal}
                    >
                        Сообщить о проблеме
                    </Button>
                    {!user.isClient &&
                        <Link to={`/projects/edit/` + id}>
                            <Button className='bottom-4' size="small" color="primary">
                                Редактировать
                            </Button>
                        </Link>
                    }
                </div>
            </div>
            <Descriptions className='max-w-[1240px]' title='Описание проекта'>
                <Descriptions.Item label="Клиент">{userData.name || ''} {userData.surname || ''}</Descriptions.Item>
                <Descriptions.Item label="Телефон">{userData.phone || ''}</Descriptions.Item>
                <Descriptions.Item label="Статус">{projectData.status?.name || ''}</Descriptions.Item>
                <Descriptions.Item label="Email">{userData.email || ''}</Descriptions.Item>
                <Descriptions.Item label="Услуга">
                    {projectData.service?.name || ''}
                </Descriptions.Item>
                <Descriptions.Item label="Описание">
                    {projectData.description || ''}
                </Descriptions.Item>
            </Descriptions>
            
            {/* Project incidents section */}
            <div className="my-8">
                <Title level={4}>Инциденты проекта</Title>
                {incidentsLoading ? (
                    <Skeleton active />
                ) : projectIncidents.length > 0 ? (
                    <Table 
                        dataSource={projectIncidents} 
                        columns={incidentColumns} 
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                ) : (
                    <Text type="secondary">Нет зарегистрированных инцидентов для этого проекта.</Text>
                )}
            </div>
            
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
                    dataLength={projectData.employees?.length || 0}
                    loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        header={<div>Участники</div>}
                        dataSource={projectData.employees || []}
                        renderItem={(item) => (
                            <List.Item key={item.email || item.id}>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large}/>}
                                    title={<a href="https://ant.design">{item.id}</a>}
                                    description={item.description || ''}
                                />
                                <div>Content</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
            <StageCard project={projectData}/>
            
            {/* Project Incident Modal */}
            {projectData && (
                <ReportProjectIncident
                    projectId={projectData.id}
                    projectName={projectData.name}
                    visible={isIncidentModalVisible}
                    onClose={handleIncidentModalClose}
                />
            )}
        </div>
    );
};

export default observer(ProjectPage);

