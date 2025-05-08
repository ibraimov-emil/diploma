import React, {useContext, useState} from 'react';
import {BsBoxSeam, BsCurrencyDollar} from 'react-icons/bs';
import {GoPrimitiveDot} from 'react-icons/go';
import {IoIosMore} from 'react-icons/io';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {
    recentTransactions,
    weeklyStats,
    dropdownData,
    SparklineAreaData,
    ecomPieChartData
} from '../../data/dummy';
import {useStateContext} from '../../contexts/ContextProvider';
import Button from "../../components/Dashboard/Button";
import SparkLine from "../../components/Dashboard/Charts/SparkLine";
import Stacked from "../../components/Dashboard/Charts/Stacked";
import Pie from "../../components/Dashboard/Charts/Pie";
import LineChart from "../../components/Dashboard/Charts/LineChart";
import {observer} from "mobx-react-lite";
import UserService from "../../services/UserService";
import {useQuery} from "react-query";
import {AuthContext} from "../../contexts/authContext";
import {fetchStatsCounts} from "../../services/StatService";
import {MdOutlineSupervisorAccount} from "react-icons/md";
import {Spinner} from "react-bootstrap";
import {SlLayers} from "react-icons/sl";
import {FiBarChart} from "react-icons/fi";
import {FaTasks} from "react-icons/fa";
import { Link } from 'react-router-dom';

const DropDown = ({currentMode}) => (
    <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
        <DropDownListComponent id="time" fields={{text: 'Time', value: 'Id'}}
                               style={{border: 'none', color: (currentMode === 'Dark') && 'white'}} value="1"
                               dataSource={dropdownData} popupHeight="220px" popupWidth="120px"/>
    </div>
);

const Ecommerce = () => {
    const {user} = useContext(AuthContext)
    const {currentColor, currentMode} = useStateContext();
    const [users, setUsers] = useState([]);
    const {data: statCounts, isLoading, isError} = useQuery('counts', fetchStatsCounts)

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (isError) {
        return isError
    }

    if (isLoading) {
        return <Spinner/>
    }

    // Client view - simplified dashboard
    if (user?.isClient) {
        return (
            <div className="mt-24">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full max-w-6xl px-4">
                        <h1 className="text-2xl font-bold mb-6 text-center">Панель управления клиента</h1>
                        
                        {/* Welcome message */}
                        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md mb-6">
                            <h2 className="text-xl font-semibold mb-2">Добро пожаловать, {user?.user?.name || 'Клиент'}!</h2>
                            <p className="text-gray-600">Здесь вы можете отслеживать свои проекты, заявки и платежи.</p>
                        </div>
                        
                        {/* Main stats grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Projects card */}
                            <Link to="/projects" className="block">
                                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-semibold">Мои проекты</div>
                                        <button
                                            type="button"
                                            style={{color: 'rgb(228, 106, 118)', backgroundColor: 'rgb(255, 244, 229)'}}
                                            className="text-2xl opacity-0.9 rounded-full p-3 hover:drop-shadow-xl"
                                        >
                                            <BsBoxSeam/>
                                        </button>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">{statCounts?.project || 0}</div>
                                    <p className="text-gray-500">Активных проектов</p>
                                </div>
                            </Link>
                            
                            {/* Requests card */}
                            <Link to="/requests" className="block">
                                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-semibold">Мои заявки</div>
                                        <button
                                            type="button"
                                            style={{color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)'}}
                                            className="text-2xl opacity-0.9 rounded-full p-3 hover:drop-shadow-xl"
                                        >
                                            <SlLayers/>
                                        </button>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">{statCounts?.request || 0}</div>
                                    <p className="text-gray-500">Всего заявок</p>
                                </div>
                            </Link>
                            
                            {/* Tasks card */}
                            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-lg font-semibold">Задачи</div>
                                    <button
                                        type="button"
                                        style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                                        className="text-2xl opacity-0.9 rounded-full p-3 hover:drop-shadow-xl"
                                    >
                                        <FaTasks/>
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Выполнено:</span>
                                        <span className="font-bold">{statCounts?.tasksCompleted || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">В процессе:</span>
                                        <span className="font-bold">{statCounts?.tasksProcessed || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">На рассмотрении:</span>
                                        <span className="font-bold">{statCounts?.tasksСons || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Support and Payments section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payments section */}
                            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Платежи</h3>
                                    <Link to="/orders">
                                        <Button
                                            color="white"
                                            bgColor={currentColor}
                                            text="Все платежи"
                                            borderRadius="10px"
                                            size="sm"
                                        />
                                    </Link>
                                </div>
                                <div className="text-center py-10">
                                    <div className="text-3xl font-bold mb-2">₽ {statCounts?.budget?.toLocaleString() || 0}</div>
                                    <p className="text-gray-500">Общая сумма платежей</p>
                                </div>
                            </div>
                            
                            {/* Help section */}
                            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-xl shadow-md">
                                <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
                                <p className="text-gray-600 mb-4">Если у вас возникли вопросы или нужна помощь, вы можете связаться с нами через чат или сообщить о проблеме.</p>
                                <div className="flex flex-wrap gap-3">
                                    <Link to="/chats">
                                        <Button
                                            color="white"
                                            bgColor={currentColor}
                                            text="Перейти в чат"
                                            borderRadius="10px"
                                        />
                                    </Link>
                                    <Link to="/incidents">
                                        <Button
                                            color="white"
                                            bgColor="#FF5C8E"
                                            text="Сообщить о проблеме"
                                            borderRadius="10px"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original dashboard for employees and admins
    return (
        <div className="mt-24">
            {/* Admin dashboard header with profit info */}
            <div className="flex flex-wrap lg:flex-nowrap ">
                <div
                    className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-400">Прибыль</p>
                            <p className="text-2xl">₽ {statCounts?.budget?.toLocaleString() || 0}</p>
                        </div>
                        <button
                            type="button"
                            style={{backgroundColor: currentColor}}
                            className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
                        >
                            <BsCurrencyDollar/>
                        </button>
                    </div>
                    <div className="mt-6">
                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Загрузить"
                            borderRadius="10px"
                        />
                    </div>
                </div>
            </div>
            
            {/* Admin dashboard stats cards */}
            <div className="flex flex-wrap lg:flex-nowrap ">
                <div className="flex m-3 flex-wrap gap-1 items-center">
                    {/* Clients card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: '#03C9D7', backgroundColor: '#E5FAFB'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <MdOutlineSupervisorAccount/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.clients || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400  mt-1">Клиенты</p>
                    </div>
                    
                    {/* Requests card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <SlLayers/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.request || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Заявки</p>
                    </div>
                    
                    {/* Projects card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(228, 106, 118)', backgroundColor: 'rgb(255, 244, 229)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <BsBoxSeam/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.project || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Проекты</p>
                    </div>
                    
                    {/* Sales card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <FiBarChart/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.payment || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Продажи</p>
                    </div>
                    
                    {/* Completed tasks card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <FaTasks/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.tasksCompleted || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Выполненные задачи</p>
                    </div>
                    
                    {/* In-progress tasks card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <FaTasks/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.tasksProcessed || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Задачи в процессе</p>
                    </div>
                    
                    {/* Review tasks card */}
                    <div
                        className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
                        <button
                            type="button"
                            style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                            className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                        >
                            <FaTasks/>
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{statCounts?.tasksСons || 0}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Задачи на рассмотрении</p>
                    </div>
                </div>
            </div>

            {/* Admin charts and analytics section */}
            <div className="flex gap-10 flex-wrap justify-center">
                {/* Income information chart */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
                    <div className="flex justify-between">
                        <p className="font-semibold text-xl">Информация о доходах</p>
                        <div className="flex items-center gap-4">
                            <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot/>
                </span>
                                <span>Расход</span>
                            </p>
                            <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot/>
                </span>
                                <span>Бюджет</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 flex gap-10 flex-wrap justify-center">
                        <div className=" border-r-1 border-color m-4 pr-10">
                            <div>
                                <p>
                                    <span className="text-3xl font-semibold">₽ 93,438</span>
                                    <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23%
                  </span>
                                </p>
                                <p className="text-gray-500 mt-1">Бюджет</p>
                            </div>
                            <div className="mt-8">
                                <p className="text-3xl font-semibold">₽ 48,487</p>

                                <p className="text-gray-500 mt-1">Расход</p>
                            </div>

                            <div className="mt-5">
                                <SparkLine currentColor={currentColor} id="line-sparkLine" type="Line" height="80px"
                                           width="250px" data={SparklineAreaData} color={currentColor}/>
                            </div>
                            <div className="mt-10">
                                <Button
                                    color="white"
                                    bgColor={currentColor}
                                    text="Загрузить отчёт"
                                    borderRadius="10px"
                                />
                            </div>
                        </div>
                        <div>
                            <Stacked currentMode={currentMode} width="320px" height="360px"/>
                        </div>
                    </div>
                </div>
                
                {/* Profit and sales charts */}
                <div>
                    <div
                        className="rounded-2xl md:w-400 p-4 m-3"
                        style={{backgroundColor: currentColor}}
                    >
                        <div className="flex justify-between items-center ">
                            <p className="font-semibold text-white text-2xl">Прибыль</p>

                            <div>
                                <p className="text-2xl text-white font-semibold mt-8">₽ 63,448.78</p>
                                <p className="text-gray-200">Месячная прибыль</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <SparkLine currentColor={currentColor} id="column-sparkLine" height="100px" type="Column"
                                       data={SparklineAreaData} width="320" color="rgb(242, 252, 253)"/>
                        </div>
                    </div>

                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
                        <div>
                            <p className="text-2xl font-semibold ">₽ 43,246</p>
                            <p className="text-gray-400">Годовые продажи</p>
                        </div>

                        <div className="w-40">
                            <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={false} height="160px"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction and statistics section */}
            <div className="flex gap-10 m-4 flex-wrap justify-center">
                {/* Recent transactions */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                    <div className="flex justify-between items-center gap-2">
                        <p className="text-xl font-semibold">Последние транзакции</p>
                        <DropDown currentMode={currentMode}/>
                    </div>
                    <div className="mt-10 w-72 md:w-400">
                        {recentTransactions.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        style={{
                                            color: item.iconColor,
                                            backgroundColor: item.iconBg,
                                        }}
                                        className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                                    >
                                        {item.icon}
                                    </button>
                                    <div>
                                        <p className="text-md font-semibold">{item.title}</p>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                                <p className={`text-${item.pcColor}`}>{item.amount}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-5 border-t-1 border-color">
                        <div className="mt-3">
                            <Button
                                color="white"
                                bgColor={currentColor}
                                text="Добавить"
                                borderRadius="10px"
                            />
                        </div>

                        <p className="text-gray-400 text-sm">36 Последних транзакций</p>
                    </div>
                </div>
                
                {/* Overall statistics */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                    <div className="flex justify-between items-center gap-2 mb-10">
                        <p className="text-xl font-semibold">Общая статистика</p>
                        <DropDown currentMode={currentMode}/>
                    </div>
                    <div className="md:w-full overflow-auto">
                        <LineChart/>
                    </div>
                </div>
            </div>

            {/* Weekly statistics */}
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">Еженедельная статистика</p>
                        <button type="button" className="text-xl font-semibold text-gray-500">
                            <IoIosMore/>
                        </button>
                    </div>

                    <div className="mt-10 ">
                        {weeklyStats.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4 w-full">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        style={{background: item.iconBg}}
                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                    >
                                        {item.icon}
                                    </button>
                                    <div>
                                        <p className="text-md font-semibold">{item.title}</p>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>

                                <p className={`text-${item.pcColor}`}>{item.amount}</p>
                            </div>
                        ))}
                        <div className="mt-4">
                            <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area"
                                       data={SparklineAreaData} width="320" color="rgb(242, 252, 253)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(Ecommerce);
