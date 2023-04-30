import React from 'react';
import {Button, Card, Col} from "react-bootstrap";
import {DEVICE_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";

const DeviceItem = ({device}) => {
    const navigate = useNavigate()
    return (
        <Col md={3} className="mt-3" onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}>
            <Card style={{ width: 'auto', cursor:'pointer' }}>
                <Card.Img variant="top" src={process.env.REACT_APP_API_URL + device.img} />
                <Card.Body>
                    <Card.Title>{device.name}</Card.Title>
                    <Card.Text>
                        <div className="text-black-50">
                            Brand
                        </div>
                        <div>
                            Рейтинг: {device.rating}
                        </div>
                        <div>
                            {device.price} Rub
                        </div>
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default DeviceItem;