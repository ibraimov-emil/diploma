import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import { Table, Modal, Input, Space  } from 'antd';
import { Button } from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import {Row} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteOneRequest, fetchRequest, fetchRequests} from "../../../services/RequestService";
import {Link} from "react-router-dom";

const RequestList = observer(() => {
    const queryClient = useQueryClient()
    const {data: requests, isLoading, isError} = useQuery('requests', fetchRequests)

    const deleteRequestMutation = useMutation(requestId => deleteOneRequest(requestId),
    {onSuccess: () => queryClient.invalidateQueries(["requests"])}
    )

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
            dataIndex: ['client', 'id'],
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
            key: "5",
            title: "Actions",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Link to={`/requests/edit/` + record.id}>
                            <EditOutlined />
                        </Link>
                        {/*<DeleteOutlined*/}
                        {/*    onClick={() => {*/}
                        {/*        onDeleteRequest(record.id);*/}
                        {/*    }}*/}
                        {/*    style={{ color: "red", marginLeft: 12 }}*/}
                        {/*/>*/}
                        <Link to={`/requests/view/` + record.id}>
                            <EyeOutlined />
                        </Link>
                    </Space>
                );
            },
        },
    ];

    const onDeleteRequest = (requestId) => {
        Modal.confirm({
        title: "Are you sure, you want to delete this student record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
            try {
                deleteRequestMutation.mutate(requestId)
            } catch (e) {
                alert(e)
                console.log(e);
            }
        },
        });
    }
    return (
        <div className="App">
            <header className="App-header">
                <Link to={`/requests/add`}>
                    <Button>Добавить заявку</Button>
                </Link>
                <Table columns={columns}
                       dataSource={requests}
                       loading={isLoading}
                       rowKey="id"
                       scroll={{ x: true }}
                >
                </Table>
            </header>
        </div>
    );
});

export default RequestList;