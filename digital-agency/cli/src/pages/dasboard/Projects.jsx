import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../../data/dummy';
import { Header } from '../../components/Dashboard';
import UserService from "../../services/UserService";
import ProjectService from "../../services/UserService";
import {fetchOneProject, fetchProjects} from "../../services/ProjectService";
import ProjectList from "../../components/Projects/ProjectList";

const Projects = () => {

  // const [project, setProject] = useState([])
  // // const {id} = useParams()
  //
  //   useEffect(() => {
  //
  //       try {
  //           fetchProjects().then(data => setProject(data))
  //           // setUsers(response.data);
  //       } catch (e) {
  //           console.log(e);
  //       }
  //   }, [])
  //
  //
  // const editing = { allowDeleting: true, allowEditing: true };
  return (
    
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Проекты" />
        <ProjectList />
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
  );
};
export default Projects;