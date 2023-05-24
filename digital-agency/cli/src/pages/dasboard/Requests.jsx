import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { Header } from '../../components/Dashboard';
import RequestList from "../../components/Dashboard/Requests/RequestList";


const Requests = () => {

  return (

    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {/*{console.log(project)}*/}
      <Header category="Страница" title="Заявки" />
        <RequestList />

    </div>
  );
};
export default Requests;
