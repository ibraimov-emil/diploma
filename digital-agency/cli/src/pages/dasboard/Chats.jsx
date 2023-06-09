import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Header } from '../../components/Dashboard';

const Chats = () => {

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
            <Header category="Page" title="Чаты" />

        </div>
    );
};
export default Chats;
