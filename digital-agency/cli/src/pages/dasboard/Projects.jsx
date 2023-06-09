import React from 'react';
import { Header } from '../../components/Dashboard';
import ProjectList from "../../components/Projects/ProjectList";

const Projects = () => {

  return (
    
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Проекты" />
        <ProjectList />
    </div>
  );
};
export default Projects;
