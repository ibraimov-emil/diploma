import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {fetchClients} from "../../services/ClientService";
import {Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {Space, Table} from "antd";
import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {AuthContext} from "../../contexts/authContext";

const ClientsList = observer(() => {
    const {data: clients, isLoading, isError} = useQuery('clients', fetchClients)
    const {user} = useContext(AuthContext)
    // console.log(data)
    // const {device} = useContext(ContextProvider)

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
        },
        {
            title: 'Фамилия',
            dataIndex: ['user', 'surname'],
            key: 'description',
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
                            Посмотреть
                        </Link>
                    </Space>
                );
            },
        },
        {
            key: "5",
            title: "Проекты клиента",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Link to={`/projects/` + record.id}>
                            Посмотреть
                        </Link>
                    </Space>
                );
            },
        },
        {
            key: "5",
            title: "Действия",
            render: (record) => {
                return (
                    <Space size="middle">
                        {!user.isClient &&
                            <>
                                <Link to={`/requests/edit/` + record.id}>
                                    <EditOutlined />
                                </Link>
                                {/*<DeleteOutlined*/}
                                {/*    onClick={() => {*/}
                                {/*        // onDeleteRequest(record.id);*/}
                                {/*    }}*/}
                                {/*    style={{ color: "red", marginLeft: 12 }}*/}
                                {/*/>*/}
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
        // <Row className="lg:flex md:flex-wrap">
        //     {/*{data && data.map(client =>*/}
        //     {/*    <ProjectItem key={client.id} client={client} />*/}
        //     {/*)}*/}
        //
        //     <List sx={{ width: '100%', maxWidth: 960, bgcolor: 'background.paper' }}>
        //         {data && data.map((client) => (
        //             <ListItem key={client.id}
        //                       secondaryAction={
        //                           <IconButton aria-label="comment">
        //                               <CommentIcon />
        //                           </IconButton>
        //                       }
        //             >
        //                 <ListItemText primary={client.user.name} primary={client.user.surname} secondary={`User ID: ${client.userId}`} />
        //                 {/*<ListItemSecondaryAction>*/}
        //                 {/*    <IconButton edge="end" onClick={() => onEdit(client)}>*/}
        //                 {/*        <Edit />*/}
        //                 {/*    </IconButton>*/}
        //                 {/*    <IconButton edge="end" onClick={() => onDelete(client.id)}>*/}
        //                 {/*        <Delete />*/}
        //                 {/*    </IconButton>*/}
        //                 {/*</ListItemSecondaryAction>*/}
        //             </ListItem>
        //         ))}
        //     </List>
        // </Row>
            <div className="App">
                <header className="App-header">
                    <Table columns={columns}
                           dataSource={clients}
                           loading={isLoading}
                           rowKey="id"
                           scroll={{ x: true }}
                    >
                    </Table>
                </header>
            </div>
    );
});

export default ClientsList;