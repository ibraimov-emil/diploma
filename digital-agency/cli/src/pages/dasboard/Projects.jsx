import React, {useContext} from 'react';
import {Header} from '../../components/Dashboard';
import ProjectList from "../../components/Projects/ProjectList";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {AuthContext} from "../../contexts/authContext";

const Projects = () => {
    const {user} = useContext(AuthContext)
    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <div className="flex justify-between items-center mb-4">
                <Header title="Проекты"/>
                {!user.isClient &&
                    <Link to={`/projects/add`}>
                        <Button>Создать проект</Button>
                    </Link>
                }
            </div>
            <ProjectList/>
        </div>
    );
};
export default Projects;
