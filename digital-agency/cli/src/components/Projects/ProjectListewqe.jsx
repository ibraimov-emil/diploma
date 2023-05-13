import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import {ContextProvider} from "../contexts/ContextProvider";
import ProjectItem from "./ProjectItem";

const ProjectList = observer(() => {
    const {device} = useContext(ContextProvider)
    return (
        <Row className="d-flex">
            {device.devices.map(device =>
                <ProjectItem key={device.id} device={device} />
            )}
        </Row>
    );
});

export default ProjectList;