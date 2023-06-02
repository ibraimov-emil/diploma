import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import ProjectItem from "./ProjectItem";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {createOneStage, fetchMyProjects, fetchProjects} from "../../services/ProjectService";
import {AuthContext} from "../../contexts/authContext";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";

const ProjectList = observer(() => {
    const {user} = useContext(AuthContext)
    const queryClient = useQueryClient()
    console.log(user.isClient)
    const {data, isLoading, isError} = useQuery('projects', user.isClient ? fetchMyProjects : fetchProjects)
    const createStageMutation  = useMutation(newStage => createOneStage(newStage),
        {onSuccess: () => queryClient.invalidateQueries(["projects"])}
    )
    console.log(data)
    // const {device} = useContext(ContextProvider)
    return (
        <>
        {!user.isClient &&
        <Link to={`/projects/add`}>
            <Button>Создать проект</Button>
        </Link>
        }
        <Row className="lg:flex md:flex-wrap gap-24">
            {data && data.map(project =>
                <ProjectItem key={project.id} project={project} />
            )}
        </Row>
        </>
    );
});

export default ProjectList;