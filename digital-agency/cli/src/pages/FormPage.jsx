import React, {useContext, useState} from 'react';
import {Button, Container, Form, Card, Row} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FORM_ROUTE} from "../utils/consts";
import 'bootstrap/dist/css/bootstrap.min.css';
import {login, registrationClient} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {ContextProvider, useStateContext} from "../contexts/ContextProvider";

const FormPage = observer(() => {
    const {user} = useStateContext()
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname == LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [description, setDescription] = useState('')
    const [nameCompany, setNameCompany] = useState('')

    const click = async () => {
        try {
            let data
            if(isLogin){
                data = await login(email, password)
            } else {
                data = await registrationClient(email, password, phone, surname, name, description, nameCompany)
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
                    <h2 className="m-auto">{isLogin ? "Вход" : "Оставить заявку"}</h2>
                    <Form.Group className="mb-3" controlId="validationFormik01">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationFormik02">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter surname"
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="validationFormik03">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </Form.Group>

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
                    <Form.Group className="mb-3" controlId="validationFormik04">
                        <Form.Label>Название компании</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название вашей компании"
                            value={nameCompany}
                            onChange={e => setNameCompany(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationFormik04">
                        <Form.Label>Описание задачи</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            placeholder="Введите описание"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={click}
                    >
                        {isLogin ? "Войти" : "Оставить заявку"}
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

export default FormPage;