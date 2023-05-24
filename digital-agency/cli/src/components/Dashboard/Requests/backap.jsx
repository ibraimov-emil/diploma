import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import { Table, Modal, Input  } from 'antd';
import { Button } from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";

import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {fetchRequest} from "../../../services/RequestService";
import {Link} from "react-router-dom";

const RequestList = observer(() => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const {data: requests, isLoading, isError} = useQuery('requests', fetchRequest)

    const [dataSource, setDataSource] = useState([
        {
            id: 1,
            name: "John",
            email: "john@gmail.com",
            address: "John Address",
        },
        {
            id: 2,
            name: "David",
            email: "david@gmail.com",
            address: "David Address",
        },
        {
            id: 3,
            name: "James",
            email: "james@gmail.com",
            address: "James Address",
        },
        {
            id: 4,
            name: "Sam",
            email: "sam@gmail.com",
            address: "Sam Address",
        },
    ]);

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
                    <>
                        <EditOutlined
                            onClick={() => {
                                onEditStudent(record);
                            }}
                        />
                        <DeleteOutlined
                            onClick={() => {
                                onDeleteStudent(record);
                            }}
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ];

    const onAddStudent = () => {
        const randomNumber = parseInt(Math.random() * 1000);
        const newStudent = {
            id: randomNumber,
            name: "Name " + randomNumber,
            email: randomNumber + "@gmail.com",
            address: "Address " + randomNumber,
        };
        setDataSource((pre) => {
            return [...pre, newStudent];
        });
    };
    const onDeleteStudent = (record) => {
        Modal.confirm({
            title: "Are you sure, you want to delete this student record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                setDataSource((pre) => {
                    return pre.filter((student) => student.id !== record.id);
                });
            },
        });
    };
    const onEditStudent = (record) => {
        setIsEditing(true);
        setEditingStudent({ ...record });
    };
    const resetEditing = () => {
        setIsEditing(false);
        setEditingStudent(null);
    };
    return (
        <div className="App">
            <header className="App-header">
                <Button onClick={onAddStudent}>Добавить заявку</Button>
                <Table columns={columns} dataSource={requests}></Table>
                <Modal
                    title="Edit Student"
                    visible={isEditing}
                    okText="Save"
                    onCancel={() => {
                        resetEditing();
                    }}
                    onOk={() => {
                        setDataSource((pre) => {
                            return pre.map((student) => {
                                if (student.id === editingStudent.id) {
                                    return editingStudent;
                                } else {
                                    return student;
                                }
                            });
                        });
                        resetEditing();
                    }}
                >
                    <Input
                        value={editingStudent?.description}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, description: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.email}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, description: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={editingStudent?.address}
                        onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, address: e.target.value };
                            });
                        }}
                    />
                </Modal>
            </header>
        </div>
    );
});

export default RequestList;