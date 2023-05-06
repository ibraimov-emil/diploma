import React, {useContext, useState} from 'react';
import {Button, Container, Form, Card, Row} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FORM_ROUTE} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {ContextProvider, useStateContext} from "../contexts/ContextProvider";
import {AuthContext} from "../contexts/authContext";

const Auth = observer(() => {
    const {user} = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname == LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const click = async () => {
        try {
            let data
            if(isLogin){
                data = await login(email, password)
                // console.log(data)
            } else {
                data = await registration(email, password)
                console.log(data)
            }
            user.setUser(user)
            user.setIsAuth(true)
            navigate(SHOP_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }

    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: "600px"}}>
                <Form className="d-flex flex-column m-5">
                    <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={click}
                    >
                        {isLogin ? "Войти" : "Регистрация"}
                    </Button>
                    <Row className="mt-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={FORM_ROUTE}>Оставьте заявку!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                    </Row>
                </Form>
            </Card>
        </Container>
    );
})

export default Auth;