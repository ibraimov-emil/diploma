import {useParams, Link} from 'react-router-dom';
import {Descriptions, Spin, Button as AntButton, Tooltip} from 'antd';
import {Button} from '@mui/material';
import {useQuery} from 'react-query';
import {fetchOneMyRequest, fetchRequest} from "../../services/RequestService";
import {Header} from "../Dashboard";
import React, {useContext, useEffect, useState} from "react";
import {fetchOneUser, getMyProfile} from "../../services/UserService";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
import { WarningOutlined } from '@ant-design/icons';
import ReportRequestIncident from './ReportRequestIncident';

const ViewRequest = () => {
    const {id} = useParams();
    const {user} = useContext(AuthContext)
    const [userData, setUser] = useState({info: []})
    const [isIncidentModalVisible, setIsIncidentModalVisible] = useState(false);

    const {
        data: request,
        isLoading,
        isError
    } = useQuery(['request', id], () => user.isClient ? fetchOneMyRequest(id) : fetchRequest(id))
    // const {data: client} = useQuery(['client', request.client.id], () => fetchOneClient(id))
    // console.log(client)

    const showIncidentModal = () => {
        setIsIncidentModalVisible(true);
    };

    const handleIncidentModalClose = () => {
        setIsIncidentModalVisible(false);
    };

    useEffect(() => {
        if (request && request.client) {
            user.isClient ? getMyProfile().then(data => setUser(data)) : fetchOneUser(request.client.userId).then(data => setUser(data))
        }
    }, [request]);

    if (isLoading) {
        return <Spin/>;
    }

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <div className="flex justify-between items-center mb-4">
                <Header title="Заявка"/>
                <div className="flex gap-2">
                    <Tooltip title="Сообщить о проблеме с заявкой">
                        <AntButton 
                            icon={<WarningOutlined />} 
                            onClick={showIncidentModal}
                            danger
                        >
                            Сообщить о проблеме
                        </AntButton>
                    </Tooltip>
                    {!user.isClient &&
                        <Link to={`/requests/edit/${id}`}>
                            <Button type="primary">Редактировать</Button>
                        </Link>
                    }
                </div>
            </div>
            <Descriptions>
                <Descriptions.Item label="ID">{request.id}</Descriptions.Item>
                <Descriptions.Item label="Description">{request.description}</Descriptions.Item>
                <Descriptions.Item label="Название компании">{request.client.nameCompany}</Descriptions.Item>
                <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                <Descriptions.Item label="Service">{request.service.name}</Descriptions.Item>
                <Descriptions.Item label="Клиент">{userData.name} {userData.surname}</Descriptions.Item>
                <Descriptions.Item label="Status">{request.status.name}</Descriptions.Item>
            </Descriptions>

            {request && (
                <ReportRequestIncident
                    requestId={request.id}
                    requestTitle={request.description}
                    visible={isIncidentModalVisible}
                    onClose={handleIncidentModalClose}
                />
            )}
        </div>
    );
};

export default observer(ViewRequest);
