import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import ProjectItem from "./ProjectItem";
import {useQuery} from "react-query";
import {fetchProjects} from "../../services/ProjectService";

const ProjectList = observer(() => {
    const {data, isLoading, isError} = useQuery('projects', fetchProjects)
    console.log(data)
    // const {device} = useContext(ContextProvider)
    return (
        <Row className="lg:flex md:flex-wrap gap-24">
            {data && data.map(project =>
                <ProjectItem key={project.id} project={project} />
            )}
        </Row>
    );
});

export default ProjectList;