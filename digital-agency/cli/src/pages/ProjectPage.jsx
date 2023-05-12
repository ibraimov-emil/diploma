import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {fetchOneProject} from "../services/ProjectService";


const ProjectPage = () => {
    const [project, setProject] = useState({info: []})
    const {id} = useParams()
    useEffect(() => {
        fetchOneProject(id).then(data => setProject(data))
    }, [])

    return (
        <>
            {project.name}
        </>
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

