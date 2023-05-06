import React, {useContext} from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";
// import {ContextProvider} from "../index";
import {NavLink, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import {ContextProvider, useStateContext} from "../contexts/ContextProvider";
import {AuthContext} from "../contexts/authContext";

const NavBar = observer(() => {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
    }
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <NavLink style={{color: "white"}} to={SHOP_ROUTE}>НеТехника</NavLink>
                {user.isAuth ?
                    <Nav className="ml-auto">
                        <Button
                            variant={"outline-light"}
                            // onClick={() => navigate(LOGIN_ROUTE)}
                            onClick={() => logOut()}
                        >
                            Выйти
                        </Button>
                        <Button
                            variant={"outline-light"}
                            onClick={() => navigate(ADMIN_ROUTE)}
                            className="ms-2"
                        >
                            Админ панель
                        </Button>
                    </Nav>
                    :
                    <Nav className="ml-auto">
                        {/*<Button variant={"outline-light"} onClick={() => user.setAuth(true)}>Авторизация</Button>*/}
                        <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                    </Nav>
                }
            </Container>
        </Navbar>
    );
});

export default NavBar;