import React, {useContext} from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {clientRoutes, employeeRoutes, publicRoutes} from "../routes";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../contexts/authContext";


const AppRouter = observer(() => {
    const {user} = useContext(AuthContext)

    return (
        <Routes>
            {user.isAuth && user.isClient && clientRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element} exact/>
            )}
            {user.isAuth && !user.isClient && employeeRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element} exact/>
            )}

            {!user.isAuth && publicRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element} exact/>
            )}
             <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
});

export default AppRouter;