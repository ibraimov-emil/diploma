import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {fetchClients} from "../../services/ClientService";
import {Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {Space, Table, Tag} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined, EyeOutlined, MessageOutlined} from "@ant-design/icons";
import {AuthContext} from "../../contexts/authContext";

const ClientsList = observer(() => {
    const {data: clients, isLoading, isError} = useQuery('clients', fetchClients)
    const {user} = useContext(AuthContext)
    const navigate = useNavigate();
    
    // Function to open a chat with a client
    const handleOpenChat = (clientId, clientName) => {
        // Navigate to chat page with this client
        navigate(`/chats/${clientId}`, { state: { clientName } });
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>Error</div>
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['md'],
        },
        {
            title: 'Имя',
            dataIndex: ['user', 'name'],
            key: 'description',
            render: (text, record) => (
                <span className="font-semibold">{text}</span>
            ),
        },
        {
            title: 'Фамилия',
            dataIndex: ['user', 'surname'],
            key: 'description',
            render: (text, record) => (
                <span className="font-semibold">{text}</span>
            ),
        },
        {
            title: 'Телефон',
            dataIndex: ['user', 'phone'],
            key: 'description',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'description',
        },
        {
            key: "5",
            title: "Заявки клиента",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Link to={`/requests/view/` + record.id}>
                            <Tag color="blue">Посмотреть</Tag>
                        </Link>
                    </Space>
                );
            },
        },
        {
            key: "6",
            title: "Проекты клиента",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Link to={`/projects/` + record.id}>
                            <Tag color="green">Посмотреть</Tag>
                        </Link>
                    </Space>
                );
            },
        },
        {
            key: "7",
            title: "Действия",
            render: (record) => {
                return (
                    <Space size="middle">
                        {/* Write button for chat */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            startIcon={<MessageOutlined />}
                            onClick={() => handleOpenChat(record.id, `${record.user.name} ${record.user.surname}`)}
                        >
                            Написать
                        </Button>
                        
                        {!user.isClient &&
                            <>
                                <Link to={`/requests/edit/` + record.id}>
                                    <EditOutlined />
                                </Link>
                            </>
                        }
                        <Link to={`/requests/view/` + record.id}>
                            <EyeOutlined />
                        </Link>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="App">
            <header className="App-header">
                <Table 
                    columns={columns}
                    dataSource={clients}
                    loading={isLoading}
                    rowKey="id"
                    scroll={{ x: true }}
                    pagination={{ 
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} клиентов`
                    }}
                    className="shadow-md rounded-lg overflow-hidden"
                />
            </header>
        </div>
    );
});

export default ClientsList;
