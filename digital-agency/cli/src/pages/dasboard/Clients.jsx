import React, {useEffect, useState} from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { Header } from '../../components/Dashboard';
import ClientsList from "../../components/Clients/ClientsList";


const Clients = () => {

  return (

    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Страница" title="Клиенты" />
        <ClientsList />
    </div>
  );
};
export default Clients;
