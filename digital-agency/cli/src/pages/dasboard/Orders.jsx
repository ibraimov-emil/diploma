import React, {useEffect, useState} from 'react';
import { Header } from '../../components/Dashboard';

import OrdersList from "../../components/Orders/OrdersList";


const Orders = () => {

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Страница" title="Платежи" />
            <OrdersList />
        </div>
    );
};
export default Orders;
