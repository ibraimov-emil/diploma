import React, {useContext, useState} from 'react';
import {Button, Container, Form, Card, Row} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FORM_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../contexts/authContext";
import {useQuery} from "react-query";
import {fetchServices} from "../services/RequestService";
import { useForm } from "react-hook-form";

const FormPage = observer(() => {
    const {user} = useContext(AuthContext)
    const {data: services, isLoading, isError} = useQuery('services', fetchServices)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname == LOGIN_ROUTE
    const [selectedService, setSelectedService] = useState('');

    const { register, handleSubmit, errors } = useForm();

    const onSubmit  = (data) => {
        try {
            if (isLogin) {
                user.login(data.email, data.password);
            } else {
                user.registration({
                        email: data.email,
                        password: data.password,
                        phone: data.phone,
                        surname: data.surname,
                        name: data.name,
                        description: data.description,
                        nameCompany: data.nameCompany,
                        serviceId: Number(selectedService)
                    }
                );
                navigate('/');
            }
        } catch (e) {
            // console.log('показывает')
            alert(e.response.data.message);
        }
    }


    return (
        <div id='clientForm' className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Станьте нашим клиентом
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Имя
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Введите имя"
                  {...register('name',{ required: true })}
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
                  Фамилия
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="surname"
                  name="surname"
                  type="surname"
                  placeholder="Введите фамилию"
                  {...register('surname',{ required: true })}
                  autoComplete="surname"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
                  Телефон
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="Введите телефон"
                  {...register('phone',{ required: true })}
                  autoComplete="phone"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                  {...register('email',{ required: true })}
                  autoComplete="current-email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Придумайте пароль
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  {...register('password',{ required: true })}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>



            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="nameCompany" className="block text-sm font-medium leading-6 text-gray-900">
                Название вашей компании
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="nameCompany"
                  name="nameCompany"
                  type="nameCompany"
                  placeholder="Введите название вашей компании"
                  {...register('nameCompany',{ required: false })}
                  autoComplete="current-nameCompany"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
              <div>
              <div className="flex items-center justify-between">
                <label htmlFor="nameCompany" className="block text-sm font-medium leading-6 text-gray-900">
                Выберите услугу
                </label>
              </div>
              <div className="mt-2">
                  <select
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id="selectedService"
                      name="selectedService"
                      onChange={e => setSelectedService(e.target.value)}
                  >
                      <option value="" disabled selected>Выберите услугу</option>
                      {services &&
                          services.map((service) => (
                              <option key={service.id} value={service.id}>
                                  {service.name}
                              </option>
                          ))}
                  </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Описание задачи
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  type="description"
                  placeholder="Введите описание"
                  {...register('description',{ required: true })}
                  autoComplete="current-description"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLogin ? "Войти" : "Стать клиентом"}
              </button>
            </div>
          </form>

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
    );
})

export default FormPage;