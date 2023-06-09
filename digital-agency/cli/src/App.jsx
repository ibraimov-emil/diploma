import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {observer} from "mobx-react-lite";
import {Spinner} from "react-bootstrap";
import {useStateContext} from './contexts/ContextProvider';
import {TooltipComponent} from "@syncfusion/ej2-react-popups";
import { Navbar, Sidebar, ThemeSettings} from "./components/Dashboard";
import './App.css';
import {AuthContext} from "./contexts/authContext";


const App = observer(() => {
    const {user} = useContext(AuthContext)
    const {setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (localStorage.getItem('token')) {
            user.checkAuth().finally(() => setLoading(false))
        }else{
            setLoading(false)
        }
        
    }, [])

    useEffect(() => {
        const currentThemeColor = localStorage.getItem('colorMode');
        const currentThemeMode = localStorage.getItem('themeMode');
        if (currentThemeColor && currentThemeMode) {
            setCurrentColor(currentThemeColor);
            setCurrentMode(currentThemeMode);
        }
    }, []);

    if(loading){
        return  <Spinner animation = {'grow'}/>
    }

    if(!user.isAuth) {
        return (
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        );
    }

    if (user.isAuth){
        return (
            <div className={currentMode === 'Dark' ? 'dark' : ''}>
                <BrowserRouter>
                    <div className="flex relative dark:bg-main-dark-bg">
                        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                            <TooltipComponent
                                content="Settings"
                                position="Top"
                            >
                                <button
                                    type="button"
                                    onClick={() => setThemeSettings(true)}
                                    style={{ background: currentColor, borderRadius: '50%' }}
                                    className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                                >
                                    {/*<FiSettings />*/}
                                </button>

                            </TooltipComponent>
                        </div>
                        {activeMenu ? (
                            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                                <Sidebar />
                            </div>
                        ) : (
                            <div className="w-0 dark:bg-secondary-dark-bg">
                                <Sidebar />
                            </div>
                        )}
                        <div
                            className={
                                activeMenu
                                    ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                                    : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                            }
                        >
                            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                                <Navbar />
                            </div>
                            <div>
                                {themeSettings && (<ThemeSettings />)}
                                <AppRouter/>
                            </div>
                            {/*<Footer />*/}
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
});

export default App;