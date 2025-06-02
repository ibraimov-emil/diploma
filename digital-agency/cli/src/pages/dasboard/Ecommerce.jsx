import React, {useContext, useState, useEffect} from 'react';
import {BsBoxSeam, BsCurrencyDollar, BsBarChart} from 'react-icons/bs';
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
import {MdOutlineSupervisorAccount, MdPendingActions} from "react-icons/md";
import {Spinner} from "react-bootstrap";
import {SlLayers} from "react-icons/sl";
import {FiBarChart} from "react-icons/fi";
import {FaTasks, FaMoneyBillWave, FaProjectDiagram, FaUserTie, FaUsers, FaRegClipboard} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Tooltip, Progress, Card as AntCard } from 'antd';

const DropDown = ({currentMode}) => (
    <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
        <DropDownListComponent id="time" fields={{text: 'Time', value: 'Id'}}
                               style={{border: 'none', color: (currentMode === 'Dark') && 'white'}} value="1"
                               dataSource={dropdownData} popupHeight="220px" popupWidth="120px"/>
    </div>
);

// Форматирование чисел для отображения
const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    return Intl.NumberFormat('ru-RU').format(value);
};

const Ecommerce = () => {
    const {user} = useContext(AuthContext)
    const {currentColor, currentMode} = useStateContext();
    const [users, setUsers] = useState([]);
    
    const {data: statCounts, isLoading, isError} = useQuery('counts', fetchStatsCounts, {
        refetchOnWindowFocus: false
    });

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (isError) {
        return <div className="flex flex-col items-center justify-center h-96">
            <div className="text-xl text-red-500 mb-4">Ошибка загрузки данных</div>
            <Button
                color="white"
                bgColor={currentColor}
                text="Попробовать снова"
                borderRadius="10px"
                onClick={() => window.location.reload()}
            />
        </div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <Spinner animation="border" role="status" className="text-blue-500" size="lg" />
            <span className="ml-3 text-xl">Загрузка статистики...</span>
        </div>;
    }

    // Calculate task completion rate
    const totalTasks = (statCounts?.tasksCompleted || 0) + (statCounts?.tasksProcessed || 0) + (statCounts?.tasksСons || 0);
    const completionRate = totalTasks ? Math.round((statCounts?.tasksCompleted / totalTasks) * 100) : 0;

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
                                <AntCard className="h-full hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-semibold">Мои проекты</div>
                                        <div className="bg-blue-100 rounded-full p-3 text-blue-500">
                                            <FaProjectDiagram size={24} />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-bold">{formatNumber(statCounts?.project)}</span>
                                    <p className="text-gray-500 mt-2">Активных проектов</p>
                                    <Progress 
                                        percent={statCounts?.project > 0 ? 100 : 0} 
                                        showInfo={false}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        className="mt-2"
                                    />
                                </AntCard>
                            </Link>
                            
                            {/* Requests card */}
                            <Link to="/requests" className="block">
                                <AntCard className="h-full hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-semibold">Мои заявки</div>
                                        <div className="bg-amber-100 rounded-full p-3 text-amber-500">
                                            <FaRegClipboard size={24} />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-bold">{formatNumber(statCounts?.request)}</span>
                                    <p className="text-gray-500 mt-2">Всего заявок</p>
                                    <Progress 
                                        percent={statCounts?.request > 0 ? 100 : 0} 
                                        showInfo={false}
                                        strokeColor={{
                                            '0%': '#ffa940',
                                            '100%': '#ffec3d',
                                        }}
                                        className="mt-2"
                                    />
                                </AntCard>
                            </Link>
                            
                            {/* Tasks card */}
                            <AntCard className="h-full hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-lg font-semibold">Задачи</div>
                                    <div className="bg-green-100 rounded-full p-3 text-green-500">
                                        <FaTasks size={24} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Выполнено:</span>
                                        <span className="font-bold text-green-500">{formatNumber(statCounts?.tasksCompleted)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">В процессе:</span>
                                        <span className="font-bold text-blue-500">{formatNumber(statCounts?.tasksProcessed)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">На рассмотрении:</span>
                                        <span className="font-bold text-amber-500">{formatNumber(statCounts?.tasksСons)}</span>
                                    </div>
                                    <Progress 
                                        percent={completionRate} 
                                        status={completionRate === 100 ? "success" : "active"}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        className="mt-4"
                                    />
                                </div>
                            </AntCard>
                        </div>
                        
                        {/* Support and Payments section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payments section */}
                            <AntCard className="hover:shadow-lg transition-all duration-300">
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
                                <div className="text-center py-8">
                                    <div className="text-3xl font-bold mb-2 flex justify-center items-center">
                                        <FaMoneyBillWave className="text-green-500 mr-2" size={28} />
                                        <span className="text-3xl font-bold">{formatNumber(statCounts?.budget)}</span>
                                    </div>
                                    <p className="text-gray-500">Общая сумма платежей</p>
                                </div>
                            </AntCard>
                            
                            {/* Help section */}
                            <AntCard className="hover:shadow-lg transition-all duration-300">
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
                            </AntCard>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original dashboard for employees and admins
    return (
        <div className="mt-10">
            {/* Admin dashboard header with profit info */}
            <div className="flex flex-wrap lg:flex-nowrap mb-6">
                <AntCard
                    className="w-full lg:w-80 p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-100 font-bold text-lg mb-1">Общая прибыль</p>
                            <span className="text-3xl font-bold">{formatNumber(statCounts?.budget)}</span>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <BsCurrencyDollar size={28} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            color="blue"
                            bgColor="white"
                            text="Скачать отчет"
                            borderRadius="10px"
                        />
                    </div>
                </AntCard>
            </div>

            {/* Admin dashboard stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Clients card */}
                <AntCard className="hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-700 font-bold text-lg">Клиенты</p>
                            <span className="text-3xl font-bold mt-2">{formatNumber(statCounts?.clients)}</span>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaUsers size={24} className="text-blue-500" />
                        </div>
                    </div>
                    <Link to="/clients" className="block mt-3">
                                <Button
                                    color="white"
                                    bgColor={currentColor}
                            text="Подробнее"
                                    borderRadius="10px"
                            size="sm"
                        />
                    </Link>
                </AntCard>

                {/* Employees card */}
                <AntCard className="hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-700 font-bold text-lg">Сотрудники</p>
                            <span className="text-3xl font-bold mt-2">{8}</span>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaUserTie size={24} className="text-purple-500" />
                        </div>
                    </div>
                    <Link to="/employees" className="block mt-3">
                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Подробнее"
                            borderRadius="10px"
                            size="sm"
                        />
                    </Link>
                </AntCard>

                {/* Projects card */}
                <AntCard className="hover:shadow-lg transition-all duration-300 border-l-4 border-amber-500">
                        <div className="flex justify-between items-center">
                            <div>
                            <p className="text-gray-700 font-bold text-lg">Проекты</p>
                            <span className="text-3xl font-bold mt-2">{formatNumber(statCounts?.project)}</span>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-full">
                            <FaProjectDiagram size={24} className="text-amber-500" />
                        </div>
                    </div>
                    <Link to="/projects" className="block mt-3">
                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Подробнее"
                            borderRadius="10px"
                            size="sm"
                        />
                    </Link>
                </AntCard>

                {/* Requests card */}
                <AntCard className="hover:shadow-lg transition-all duration-300 border-l-4 border-rose-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-700 font-bold text-lg">Заявки</p>
                            <span className="text-3xl font-bold mt-2">{formatNumber(statCounts?.request)}</span>
                        </div>
                        <div className="bg-rose-100 p-3 rounded-full">
                            <FaRegClipboard size={24} className="text-rose-500" />
                        </div>
                    </div>
                    <Link to="/requests" className="block mt-3">
                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Подробнее"
                            borderRadius="10px"
                            size="sm"
                        />
                    </Link>
                </AntCard>
            </div>

            {/* Task statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AntCard className="md:col-span-2 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Статистика задач</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-blue-500 mb-2"><FaTasks size={24} className="mx-auto" /></div>
                            <p className="text-gray-700 font-semibold">Выполнено</p>
                            <span className="text-2xl font-bold text-blue-500">{formatNumber(statCounts?.tasksCompleted)}</span>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg text-center">
                            <div className="text-amber-500 mb-2"><MdPendingActions size={24} className="mx-auto" /></div>
                            <p className="text-gray-700 font-semibold">В процессе</p>
                            <span className="text-2xl font-bold text-amber-500">{formatNumber(statCounts?.tasksProcessed)}</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-green-500 mb-2"><BsBarChart size={24} className="mx-auto" /></div>
                            <p className="text-gray-700 font-semibold">На рассмотрении</p>
                            <span className="text-2xl font-bold text-green-500">{formatNumber(statCounts?.tasksСons)}</span>
                                    </div>
                                </div>
                    <div className="mt-6">
                        <p className="text-gray-700 mb-2">Прогресс выполнения задач:</p>
                        <Progress 
                            percent={completionRate} 
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            format={percent => `${percent}% выполнено`}
                        />
                            </div>
                </AntCard>
                
                <AntCard className="hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Финансы</h3>
                    </div>
                    <div className="text-center py-4">
                        <div className="text-3xl font-bold mb-2 flex justify-center items-center">
                            <FaMoneyBillWave className="text-green-500 mr-2" size={28} />
                            <span className="text-3xl font-bold">{formatNumber(statCounts?.budget)}</span>
                        </div>
                        <p className="text-gray-500 mb-4">Общий бюджет</p>
                        <Pie 
                            id="finance-pie-chart" 
                            data={[
                                { name: 'Доход', value: statCounts?.budget || 0, color: '#4CAF50' },
                                { name: 'Расходы', value: statCounts?.budget ? Math.round(statCounts?.budget * 0.7) : 0, color: '#F44336' }
                            ]} 
                            height="160px"
                        />
                    </div>
                </AntCard>
                </div>

            {/* Additional stats and charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AntCard className="hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Проекты по статусам</h3>
                    </div>
                    <div className="h-60">
                        <Stacked 
                            currentMode={currentMode} 
                            width="100%" 
                            height="100%"
                        />
                    </div>
                </AntCard>
                
                <AntCard className="hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Недельная активность</h3>
                    </div>
                    <div className="h-60">
                        <SparkLine
                            currentColor={currentColor}
                            id="area-sparkLine"
                            type="Area"
                            height="100%"
                            width="100%"
                            data={SparklineAreaData}
                            color={currentColor}
                        />
                                    </div>
                </AntCard>
                                </div>

            {/* Recent transactions */}
            <AntCard className="mb-8 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Последние транзакции</h3>
                    <DropDown currentMode={currentMode} />
                </div>
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Транзакция</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTransactions.slice(0, 5).map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full" 
                                                style={{
                                                    color: item.iconColor,
                                                    backgroundColor: item.iconBg,
                                                }}>
                                                {item.icon}
                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                <div className="text-sm text-gray-500">{item.desc}</div>
                        </div>
                    </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Клиент #{index + 1}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`text-${item.pcColor}`}>{item.amount}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-5 border-t pt-3">
                    <Button
                        color="white"
                        bgColor={currentColor}
                        text="Все транзакции"
                        borderRadius="10px"
                    />
                    <p className="text-gray-400 text-sm">Всего транзакций: {recentTransactions.length}</p>
            </div>
            </AntCard>
        </div>
    );
};

export default observer(Ecommerce);
