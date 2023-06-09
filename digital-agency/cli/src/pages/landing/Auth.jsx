import React, {useContext, useState} from 'react';
import {Button, Container, Form, Card, Row} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FORM_ROUTE} from "../../utils/consts";
import {observer} from "mobx-react-lite";
import {ContextProvider, useStateContext} from "../../contexts/ContextProvider";
import {AuthContext} from "../../contexts/authContext";
import UserStore from "../../store/UserStore";

const Auth = observer(() => {
    const {user} = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname == LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const click = async () => {
        try {
            // console.log('dsdas')
            let data
            // console.log('dsdas')
            if(isLogin){
                data = await user.login(email, password)
            console.log(data)
            } else {
                data = await user.registration(email, password)
                console.log(data)
            }
            // user.setUser(data)
            // user.setIsAuth(true)
            navigate('/')
        } catch (e) {
            alert(e.response.data.message)
        }

    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Войти
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6" >
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={click}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
          {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={FORM_ROUTE}>Оставьте заявку!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
          </p>
        </div>
      </div>
        // <Container
        //     className="d-flex justify-content-center align-items-center"
        //     style={{height: window.innerHeight - 54}}
        // >
        //     <Card style={{width: "600px"}}>
        //         <Form className="d-flex flex-column m-5">
        //             <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        //             <Form.Group className="mb-3" controlId="formBasicEmail">
        //                 <Form.Label>Email address</Form.Label>
        //                 <Form.Control
        //                     type="email"
        //                     placeholder="Enter email"
        //                     value={email}
        //                     onChange={e => setEmail(e.target.value)}
        //                 />
        //             </Form.Group>
                    
        //             <Form.Group className="mb-3" controlId="formBasicPassword">
        //                 <Form.Label>Password</Form.Label>
        //                 <Form.Control
        //                     type="password"
        //                     placeholder="Password"
        //                     value={password}
        //                     onChange={e => setPassword(e.target.value)}
        //                 />
        //             </Form.Group>
        //             <Button
        //                 variant="primary"
        //                 onClick={click}
        //             >
        //                 {isLogin ? "Войти" : "Регистрация"}
        //             </Button>
        //             <Row className="mt-3">
        //                 {isLogin ?
        //                     <div>
        //                         Нет аккаунта? <NavLink to={FORM_ROUTE}>Оставьте заявку!</NavLink>
        //                     </div>
        //                     :
        //                     <div>
        //                         Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
        //                     </div>
        //                 }
        //             </Row>
        //         </Form>
        //     </Card>
        // </Container>


    );
})

export default Auth;