import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import { Table, Modal, Input, Space  } from 'antd';
import { Button } from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import {Row} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteOneRequest, fetchMyRequests, fetchRequest, fetchRequests} from "../../services/RequestService";
import {Link} from "react-router-dom";
import {AuthContext} from "../../contexts/authContext";
import {fetchMyProjects, fetchPayedStages, fetchProjects} from "../../services/ProjectService";

const RequestList = observer(() => {
    const {user} = useContext(AuthContext)
    const queryClient = useQueryClient()
    const {data: payedStages, isLoading, isError} = useQuery('orders', fetchPayedStages)

    const deleteRequestMutation = useMutation(requestId => deleteOneRequest(requestId),
    {onSuccess: () => queryClient.invalidateQueries(["orders"])}
    )

    const columns = [
        {
            title: 'Stage ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['md'],
        },
        {
            title: 'Название этапа',
            dataIndex: 'name',
            key: 'name',
        },
        {
            key: "3",
            title: "Стоимость этапа",
            render: (record) => {
                return (
                    <Space size="middle">
                        {record.cost ? (
                            record.cost
                        ) : ('Не выставлен')}
                    </Space>
                );
            },
        },
        {
            key: "4",
            title: "Статус платежа",
            render: (record) => {
                return (
                    <Space size="middle">
                        {record.paymentStatus ? (
                            record.paymentStatus
                        ) : ('Не оплачен')}
                    </Space>
                );
            },
        },
        {
            key: "5",
            title: "Ссылка платежа",
            render: (record) => {
                return (
                    <Space size="middle">
                        {record.paymentLink ? (
                            <a href={'' + record.paymentLink} target="_blank">Посмотреть</a>
                        ) : ('Нет ссылки')}
                    </Space>
                );
            },
        },
        {
            key: "6",
            title: "Страница проекта",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Link to={`/projects/` + record.project.id}>
                            Перейти
                        </Link>
                    </Space>
                );
            },
        },
        {
            title: 'ID клиента',
            dataIndex: ['project', 'clientId'],
            key: 'client',
            responsive: ['md'],
        }
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
                <Table columns={columns}
                       dataSource={payedStages}
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