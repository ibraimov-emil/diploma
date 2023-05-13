import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {fetchOneProject} from "../services/ProjectService";
import {Descriptions} from "antd";
import {Header} from "../components/Dashboard";
import ProjectList from "../components/Projects/ProjectList";
import {fetchOneUser} from "../services/UserService";
import {useQuery} from "react-query";


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
        {/*<GridComponent*/}
        {/*  id="gridcomp"*/}
        {/*  // dataSource={ordersData}*/}
        {/*  dataSource={project}*/}
        {/*  allowPaging*/}
        {/*  allowSorting*/}
        {/*  allowExcelExport*/}
        {/*  allowPdfExport*/}
        {/*  contextMenuItems={contextMenuItems}*/}
        {/*  editSettings={editing}*/}
        {/*>*/}
        {/*  <ColumnsDirective>*/}
        {/*    /!* eslint-disable-next-line react/jsx-props-no-spreading *!/*/}
        {/*    {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}*/}
        {/*  </ColumnsDirective>*/}
        {/*  <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />*/}
        {/*</GridComponent>*/}
    </div>
        // <Container className={"mt-3"}>
        //     <Row>
        //         <Col md={4}>
        //             <Image width={300} height={300} src={process.env.REACT_APP_API_URL + device.img}/>
        //         </Col>
        //         <Col md={4}>
        //             <Row>
        //                 <h2>{device.name}</h2>
        //                 {/*<div>Брэнд: {device.brand}</div>*/}
        //                 <div>Рейтинг: {device.rating}</div>
        //             </Row>
        //         </Col>
        //         <Col md={4}>
        //             <Card
        //                 className="d-flex flex-column justify-content-around align-items-center"
        //                 style={{width: 300, height: 300, }}
        //             >
        //                <h3>{device.price} руб.</h3>
        //                 <Button variant="primary">Добавить в корзину</Button>
        //             </Card>
        //         </Col>
        //     </Row>
        //     <Row className="d-flex flex-column m-3">
        //         <h1>Характеристики</h1>
        //         {device.info.map((info, index) =>
        //             <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
        //                 {info.title}: {info.description}
        //             </Row>
        //         )}
        //     </Row>
        // </Container>
    );
};

export default ProjectPage;

