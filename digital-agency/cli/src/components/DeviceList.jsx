import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import DeviceItem from "./DeviceItem";
import {Row} from "react-bootstrap";
import {ContextProvider} from "../contexts/ContextProvider";

const DeviceList = observer(() => {
    const {device} = useContext(ContextProvider)
    return (
        <Row className="d-flex">
            {device.devices.map(device =>
                <DeviceItem key={device.id} device={device} />
            )}
        </Row>
    );
});

export default DeviceList;