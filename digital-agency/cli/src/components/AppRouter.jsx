import React, {useContext} from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {authRoutes, clientRoutes, employeeRoutes, publicRoutes} from "../routes";
import {SHOP_ROUTE, FORM_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import {ContextProvider, useStateContext} from "../contexts/ContextProvider";
import {AuthContext} from "../contexts/authContext";
import employees from "../pages/dasboard/Employees";


const AppRouter = observer(() => {
    const {user} = useContext(AuthContext)

    return (
        <Routes>
            {user.isAuth && user.isClient && clientRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}
            {user.isAuth && employeeRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}

            {!user.isAuth && publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}
             <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
});

export default AppRouter;