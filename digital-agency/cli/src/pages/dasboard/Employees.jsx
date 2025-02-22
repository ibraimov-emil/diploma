import React from 'react';
import {GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page} from '@syncfusion/ej2-react-grids';

import {employeesData, employeesGrid} from '../../data/dummy';
import {Header} from '../../components/Dashboard';
import EmployeesList from "../../components/Employees/EmployeesList";

const Employees = () => {
    const toolbarOptions = ['Search'];

    const editing = {allowDeleting: true, allowEditing: true};

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header title="Сотрудники"/>
            <EmployeesList/>
        </div>
    );
};
export default Employees;
