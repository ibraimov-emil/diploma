import React, {useContext, useState} from 'react';
import {BsBoxSeam, BsCurrencyDollar} from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';
import product9 from '../../data/product9.jpg';
import Button from "../../components/Dashboard/Button";
import SparkLine from "../../components/Dashboard/Charts/SparkLine";
import Stacked from "../../components/Dashboard/Charts/Stacked";
import Pie from "../../components/Dashboard/Charts/Pie";
import LineChart from "../../components/Dashboard/Charts/LineChart";
import {observer} from "mobx-react-lite";
import UserService from "../../services/UserService";
import {useQuery} from "react-query";
import {fetchMyProjects, fetchProjects} from "../../services/ProjectService";
import {AuthContext} from "../../contexts/authContext";
import {fetchStatsCounts} from "../../services/StatService";
import {MdOutlineSupervisorAccount} from "react-icons/md";
import {Spinner} from "react-bootstrap";
import {SlLayers} from "react-icons/sl";
import {AiFillProject} from "react-icons/ai";
import {FiBarChart} from "react-icons/fi";

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Ecommerce = () => {
  const {user} = useContext(AuthContext)
  const { currentColor, currentMode } = useStateContext();
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
    return <Spinner />
  }

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Прибыль</p>
              <p className="text-2xl">₽ {statCounts.budget.toLocaleString()}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <BsCurrencyDollar />
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
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {/*{earningData.map((item) => (*/}
          {/*    <div key={item.title}*/}
          {/*         className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">*/}
          {/*      <button*/}
          {/*          type="button"*/}
          {/*          style={{color: item.iconColor, backgroundColor: item.iconBg}}*/}
          {/*          className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"*/}
          {/*      >*/}
          {/*        {item.icon}*/}
          {/*      </button>*/}
          {/*      <p className="mt-3">*/}
          {/*        <span className="text-lg font-semibold">{item.amount}</span>*/}
          {/*        <span className={`text-sm text-${item.pcColor} ml-2`}>*/}
          {/*        {item.percentage}*/}
          {/*      </span>*/}
          {/*      </p>*/}
          {/*      <p className="text-sm text-gray-400  mt-1">{item.title}</p>*/}
          {/*    </div>*/}
          {/*))}*/}
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
                type="button"
                style={{color: '#03C9D7', backgroundColor: '#E5FAFB'}}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <MdOutlineSupervisorAccount/>
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{statCounts.clients}</span>
              {/*<span className={`text-sm text-red-600 ml-2`}>*/}
              {/*    {item.percentage}*/}
              {/*</span>*/}
            </p>
            <p className="text-sm text-gray-400  mt-1">Клиенты</p>
          </div>
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
                type="button"
                style={{color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)'}}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <SlLayers/>
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{statCounts.request}</span>
              {/*<span className={`text-sm text-red-600 ml-2`}>*/}
              {/*    {item.percentage}*/}
              {/*</span>*/}
            </p>
            <p className="text-sm text-gray-400 mt-1">Заявки</p>
          </div>
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
                type="button"
                style={{color: 'rgb(228, 106, 118)', backgroundColor: 'rgb(255, 244, 229)'}}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <BsBoxSeam/>
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{statCounts.project}</span>
              {/*<span className={`text-sm text-red-600 ml-2`}>*/}
              {/*    {item.percentage}*/}
              {/*</span>*/}
            </p>
            <p className="text-sm text-gray-400 mt-1">Проекты</p>
          </div>
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
                type="button"
                style={{color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)'}}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <FiBarChart />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{statCounts.payment}</span>
              {/*<span className={`text-sm text-red-600 ml-2`}>*/}
              {/*    {item.percentage}*/}
              {/*</span>*/}
            </p>
            <p className="text-sm text-gray-400 mt-1">Продажи</p>
          </div>
        </div>
      </div>

      {/* <div>
        <button onClick={getUsers}>Получить пользователей</button>
      {users.map(user =>
          <div key={user.email}>{user.email}</div>
      )}
      </div> */}

      <div className="flex gap-10 flex-wrap justify-center">
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
                  <GoPrimitiveDot />
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
                <SparkLine currentColor={currentColor} id="line-sparkLine" type="Line" height="80px" width="250px" data={SparklineAreaData} color={currentColor} />
              </div>
              <div className="mt-10">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Загрузить отчет"
                  borderRadius="10px"
                />
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
        <div>
          <div
            className=" rounded-2xl md:w-400 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Прибыль</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">₽ 63,448.78</p>
                <p className="text-gray-200">Ежемесячный доход</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine currentColor={currentColor} id="column-sparkLine" height="100px" type="Column" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">₽ 43,246</p>
              <p className="text-gray-400">Ежегодные продажи</p>
            </div>

            <div className="w-40">
              <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={false} height="160px" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Недавние транзакции</p>
            <DropDown currentMode={currentMode} />
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
                text="Add"
                borderRadius="10px"
              />
            </div>

            <p className="text-gray-400 text-sm">36 Недавние транзакции</p>
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Обзор продаж</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Weekly Stats</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>

          <div className="mt-10 ">
            {weeklyStats.map((item) => (
              <div key={item.title} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: item.iconBg }}
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
              <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Ecommerce);
