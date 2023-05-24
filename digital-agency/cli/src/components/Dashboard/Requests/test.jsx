import React from 'react';
import {observer} from "mobx-react-lite";
import { Table, Modal } from 'antd';
import { Button } from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";

import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {fetchRequest} from "../../../services/RequestService";
import {Link} from "react-router-dom";

const TestList = observer(() => {
    const {data:requests, isLoading, isError} = useQuery('requests', fetchRequest)

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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Service',
            dataIndex: ['service', 'name'],
            key: 'service',
            responsive: ['md'],
        },
        {
            title: 'Client',
            dataIndex: ['client', 'name'],
            key: 'client',
            responsive: ['md'],
        },
        {
            title: 'Status',
            dataIndex: ['status', 'name'],
            key: 'status',
            responsive: ['md'],
        },
        {
            title: 'Actions',
            key: 'actions',
            responsive: ['md'],
            render: (_, record) => (
                <>
                    <Link to={`/requests/${record.id}`}>
                        <Button type="primary" icon={<EditOutlined />}>
                            Edit
                        </Button>
                    </Link>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            // setSelectedRequest(record);
                            // setDeleteModalVisible(true);
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Заявки</h1>
                <Link to="/requests/add">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add Request
                    </Button>
                </Link>
            </div>
            <Table
                dataSource={requests}
                columns={columns}
                loading={isLoading}
                rowKey="id"
                scroll={{ x: true }}
                pagination={true}
            />
        </>
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
    );
});

export default TestList;