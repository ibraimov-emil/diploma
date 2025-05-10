import React from 'react';
import {
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
  AiFillProject
} from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import {
  BsKanban,
  BsBarChart,
  BsBoxSeam,
  BsCurrencyDollar,
  BsShield,
  BsChatLeft,
  BsFillChatDotsFill
} from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';
import avatar from './avatar.jpg';
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';
import product1 from './product1.jpg';
import product2 from './product2.jpg';
import product3 from './product3.jpg';
import product4 from './product4.jpg';
import product5 from './product5.jpg';
import product6 from './product6.jpg';
import product7 from './product7.jpg';
import product8 from './product8.jpg';
import {SlLayers, SlPeople} from "react-icons/sl";
import { FiActivity } from 'react-icons/fi';

// This file contains a modified version of the links array with a monitoring dashboard section

// Add admin links for Monitoring
const adminLinks = {
  title: 'Администрирование',
  client: false,
  links: [
    {
      link: 'itsm',
      name: 'ITSM Панель',
      icon: <BsShield />,
    },
    {
      link: 'incidents',
      name: 'Инциденты',
      icon: <FiEdit />,
    },
    {
      link: 'monitoring',
      name: 'Мониторинг',
      icon: <AiOutlineAreaChart />,
    },
    {
      link: 'process-metrics',
      name: 'Метрики процессов',
      icon: <FiActivity />,
    },
    {
      link: 'support',
      name: 'Поддержка',
      icon: <BsChatLeft />,
    },
  ],
};

export const links = [
  {
    title: 'Dashboard',
    client: false,
    links: [
      {
        link: 'ecommerce',
        name: 'Статистика',
        icon: <FiShoppingBag />,
      },
    ],
  },
  {
    title: 'Страницы',
    client: true,
    links: [
      {
        link: 'requests',
        name: 'Заявки',
        icon: <SlLayers />,
      },
      {
        link: 'projects',
        name: 'Проекты',
        icon: <AiFillProject />,
      },
      {
        link: 'chats',
        name: 'Чат',
        icon: <BsFillChatDotsFill />,
      },
      {
        link: 'orders',
        name: 'Платежи',
        icon: <AiOutlineShoppingCart />,
      },
      {
        link: 'employees',
        name: 'Сотрудники',
        icon: <IoMdContacts />,
      },
    ],
  },
  {
    title: 'Страницы',
    client: false,
    links: [
      {
        link: 'requests',
        name: 'Заявки',
        icon: <SlLayers />,
      },
      {
        link: 'projects',
        name: 'Проекты',
        icon: <AiFillProject />,
      },
      {
        link: 'clients',
        name: 'Клиенты',
        icon: <SlPeople />,
      },
      {
        link: 'chats',
        name: 'Чат',
        icon: <BsFillChatDotsFill />,
      },
      {
        link: 'orders',
        name: 'Платежи',
        icon: <AiOutlineShoppingCart />,
      },
      {
        link: 'employees',
        name: 'Сотрудники',
        icon: <IoMdContacts />,
      },
    ],
  },
  {
    title: 'Apps',
    client: false,
    links: [
      {
        link: 'calendar',
        name: 'Календарь',
        icon: <AiOutlineCalendar />,
      },
      {
        link: 'kanban',
        name: 'Канбан',
        icon: <BsKanban />,
      },
    ],
  },
  adminLinks,
]; 

// Ниже добавляем заглушки для всех отсутствующих экспортов
export const chatData = [
  {
    image: avatar,
    message: 'Roman Joined the Team!',
    desc: 'Congratulate him',
    time: '9:08 AM',
  },
  {
    image: avatar2,
    message: 'New message received',
    desc: 'Salma sent you new message',
    time: '11:56 AM',
  },
  {
    image: avatar3,
    message: 'New Payment received',
    desc: 'Check your earnings',
    time: '4:39 AM',
  },
  {
    image: avatar4,
    message: 'Jolly completed tasks',
    desc: 'Assign her new tasks',
    time: '1:12 AM',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
  {
    icon: <BsShield />,
    title: 'My Inbox',
    desc: 'Messages & Emails',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
  },
  {
    icon: <FiCreditCard />,
    title: 'My Tasks',
    desc: 'To-do and Daily Tasks',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
  },
];

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const scheduleData = [
  {
    Id: 1,
    Subject: 'Meeting',
    Location: 'Room 1',
    StartTime: '2021-01-10T04:00:00.000Z',
    EndTime: '2021-01-10T05:30:00.000Z',
    CategoryColor: '#1aaa55',
  },
  {
    Id: 2,
    Subject: 'Planning',
    Location: 'Room 2',
    StartTime: '2021-01-11T04:00:00.000Z',
    EndTime: '2021-01-11T05:30:00.000Z',
    CategoryColor: '#357cd2',
  },
];

export const kanbanData = [
  {
    Id: 1,
    Title: 'Task 1',
    Status: 'Open',
    Summary: 'Test Summary 1',
  },
  {
    Id: 2,
    Title: 'Task 2',
    Status: 'InProgress',
    Summary: 'Test Summary 2',
  },
];

export const kanbanGrid = [
  { headerText: 'To Do', keyField: 'Open', allowToggle: true },
  { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
];

// Другие экспорты
export const areaPrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'y',
  majorGridLines: { width: 0 },
  intervalType: 'Years',
  edgeLabelPlacement: 'Shift',
  labelStyle: { color: 'gray' },
};

export const areaPrimaryYAxis = {
  labelFormat: '{value}%',
  lineStyle: { width: 0 },
  maximum: 4,
  interval: 1,
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelStyle: { color: 'gray' },
};

export const areaCustomSeries = [
  {
    dataSource: [
      { x: new Date(2002, 0, 1), y: 2.2 },
      { x: new Date(2003, 0, 1), y: 3.4 },
    ],
    xName: 'x',
    yName: 'y',
    name: 'USA',
    opacity: '0.8',
    type: 'SplineArea',
    width: '2',
  },
];

export const barPrimaryXAxis = {
  valueType: 'Category',
  interval: 1,
  majorGridLines: { width: 0 },
};

export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelStyle: { color: 'transparent' },
};

export const barCustomSeries = [
  {
    dataSource: [
      { x: 'USA', y: 46 },
      { x: 'GBR', y: 27 },
    ],
    xName: 'x',
    yName: 'y',
    name: 'Gold',
    type: 'Column',
    marker: { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
  },
];

export const ColorMappingPrimaryXAxis = {
  valueType: 'Category',
  majorGridLines: { width: 0 },
  title: 'Months',
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}°C',
  title: 'Temperature',
};

export const colorMappingData = [
  [
    { x: 'Jan', y: 6.96 },
    { x: 'Feb', y: 8.9 },
  ],
];

export const rangeColorMapping = [
  { label: '1°C to 10°C', start: '1', end: '10', colors: ['#FFFF99'] },
];

export const financialChartData = [
  {
    x: new Date('2012-04-02'),
    open: 85.9757,
    high: 90.6657,
    low: 85.7685,
    close: 90.5657,
    volume: 660187068,
  },
];

export const FinancialPrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'y',
  intervalType: 'Years',
  edgeLabelPlacement: 'Shift',
};

export const FinancialPrimaryYAxis = {
  labelFormat: '{value}',
  rangePadding: 'None',
  minimum: 10,
  maximum: 90,
  interval: 10,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

export const pieChartData = [
  { x: 'Labour', y: 18, text: '18%' },
  { x: 'Legal', y: 8, text: '8%' },
];

export const PyramidData = [
  { x: 'Sweet Treats', y: 120, text: '120 cal' },
  { x: 'Milk, Yog', y: 435, text: '435 cal' },
];

export const customersData = [
  {
    CustomerID: 1001,
    CustomerName: 'Nirav Joshi',
    CustomerEmail: 'nirav@gmail.com',
    CustomerImage: avatar,
    Status: 'Active',
  },
];

export const customersGrid = [
  { field: 'CustomerName', headerText: 'Name', width: '150', textAlign: 'Center' },
];

export const dropdownData = [
  {
    Id: '1',
    Time: 'March 2021',
  },
  {
    Id: '2',
    Time: 'April 2021',
  },
];

export const SparklineAreaData = [
  { x: 1, yval: 2 },
  { x: 2, yval: 6 },
];

export const ecomPieChartData = [
  { x: '2018', y: 18, text: '35%' },
  { x: '2019', y: 18, text: '15%' },
];

export const recentTransactions = [
  {
    icon: <BsCurrencyDollar />,
    amount: '+$350',
    title: 'Paypal Transfer',
    desc: 'Money Added',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    pcColor: 'green-text',
  },
];

export const weeklyStats = [
  {
    icon: <FiShoppingCart />,
    amount: '-$560',
    title: 'Top Sales',
    desc: 'Johnathan Doe',
    iconBg: '#FB9678',
    pcColor: 'red-text',
  },
];

// Добавляем отсутствующие экспорты
export const cartData = [
  {
    image: product1,
    name: 'Butterscotch ice-cream',
    category: 'Ice Cream',
    price: '$250',
  },
  {
    image: product2,
    name: 'Supreme fresh tomato',
    category: 'Vegetable',
    price: '$450',
  },
  {
    image: product3,
    name: 'Red color candy',
    category: 'Candy',
    price: '$190',
  },
];

// Добавляем экспорты для LineChart
export const LinePrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'y',
  intervalType: 'Years',
  edgeLabelPlacement: 'Shift',
  majorGridLines: { width: 0 },
  background: 'white',
};

export const LinePrimaryYAxis = {
  labelFormat: '{value}%',
  rangePadding: 'None',
  minimum: 0,
  maximum: 100,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

export const lineCustomSeries = [
  {
    dataSource: [
    { x: new Date(2005, 0, 1), y: 21 },
    { x: new Date(2006, 0, 1), y: 24 },
    { x: new Date(2007, 0, 1), y: 36 },
    { x: new Date(2008, 0, 1), y: 38 },
    { x: new Date(2009, 0, 1), y: 54 },
    { x: new Date(2010, 0, 1), y: 57 },
    { x: new Date(2011, 0, 1), y: 70 },
  ],
    xName: 'x',
    yName: 'y',
    name: 'Germany',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line',
  },
  {
    dataSource: [
    { x: new Date(2005, 0, 1), y: 28 },
    { x: new Date(2006, 0, 1), y: 44 },
    { x: new Date(2007, 0, 1), y: 48 },
    { x: new Date(2008, 0, 1), y: 50 },
    { x: new Date(2009, 0, 1), y: 66 },
    { x: new Date(2010, 0, 1), y: 78 },
    { x: new Date(2011, 0, 1), y: 84 },
  ],
    xName: 'x',
    yName: 'y',
    name: 'England',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line',
  },
];

// Добавляем экспорты для Stacked компонента
export const stackedPrimaryXAxis = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  interval: 1,
  lineStyle: { width: 0 },
  labelIntersectAction: 'Rotate45',
  valueType: 'Category',
};

export const stackedPrimaryYAxis = {
  lineStyle: { width: 0 },
  minimum: 0,
  maximum: 100,
  interval: 20,
  majorTickLines: { width: 0 },
  majorGridLines: { width: 1 },
  minorGridLines: { width: 1 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}%',
};

export const stackedCustomSeries = [
  {
    dataSource: [
      { x: 'Jan', y: 62 },
      { x: 'Feb', y: 64 },
      { x: 'Mar', y: 55 },
      { x: 'Apr', y: 73 },
      { x: 'May', y: 35 },
      { x: 'Jun', y: 90 },
    ],
    xName: 'x',
    yName: 'y',
    name: 'Plan',
    type: 'StackingColumn',
    background: 'blue',
  },
  {
    dataSource: [
      { x: 'Jan', y: 43 },
      { x: 'Feb', y: 42 },
      { x: 'Mar', y: 30 },
      { x: 'Apr', y: 39 },
      { x: 'May', y: 25 },
      { x: 'Jun', y: 45 },
    ],
    xName: 'x',
    yName: 'y',
    name: 'Budget',
    type: 'StackingColumn',
    background: 'red',
  },
];

// Добавляем данные для метрик процессов
export const processMetricsData = {
  requestToProjectTime: 86400, // 24 hours in seconds
  chatResponseTime: 900, // 15 minutes in seconds
  invoicePaymentTime: 259200, // 72 hours in seconds
  taskCompletionRate: 0.9, // 90%
  targets: {
    requestToProject: 86400, // Target: 24 hours or less
    chatResponse: 900, // Target: 15 minutes or less
    invoicePayment: 259200, // Target: 72 hours or less
    taskCompletion: 0.9 // Target: 90% or more
  }
};

// История метрик за последние 7 дней
export const processMetricsHistory = [
  {
    date: '2024-05-01',
    requestToProjectTime: 82800, // 23 hours
    chatResponseTime: 850, // 14.1 minutes
    invoicePaymentTime: 248400, // 69 hours
    taskCompletionRate: 0.92 // 92%
  },
  {
    date: '2024-05-02',
    requestToProjectTime: 88200, // 24.5 hours
    chatResponseTime: 920, // 15.3 minutes
    invoicePaymentTime: 262800, // 73 hours
    taskCompletionRate: 0.88 // 88%
  },
  {
    date: '2024-05-03',
    requestToProjectTime: 79200, // 22 hours
    chatResponseTime: 780, // 13 minutes
    invoicePaymentTime: 241200, // 67 hours
    taskCompletionRate: 0.95 // 95%
  },
  {
    date: '2024-05-04',
    requestToProjectTime: 84600, // 23.5 hours
    chatResponseTime: 890, // 14.8 minutes
    invoicePaymentTime: 252000, // 70 hours
    taskCompletionRate: 0.91 // 91%
  },
  {
    date: '2024-05-05',
    requestToProjectTime: 91800, // 25.5 hours
    chatResponseTime: 950, // 15.8 minutes
    invoicePaymentTime: 266400, // 74 hours
    taskCompletionRate: 0.87 // 87%
  },
  {
    date: '2024-05-06',
    requestToProjectTime: 81000, // 22.5 hours
    chatResponseTime: 820, // 13.6 minutes
    invoicePaymentTime: 237600, // 66 hours
    taskCompletionRate: 0.93 // 93%
  },
  {
    date: '2024-05-07',
    requestToProjectTime: 86400, // 24 hours
    chatResponseTime: 900, // 15 minutes
    invoicePaymentTime: 259200, // 72 hours
    taskCompletionRate: 0.90 // 90%
  }
];

// Данные для круговой диаграммы выполнения задач
export const taskCompletionPieData = [
  { name: 'Выполнено в срок', value: 90 },
  { name: 'Просрочено', value: 10 }
];

// Цвета для диаграмм метрик процессов
export const processMetricsColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// SLA определения для метрик
export const slaDefinitions = [
  {
    id: 1,
    metric_name: 'request_to_project_time',
    target_value: 86400,
    period: 'daily',
    description: 'Максимальное время преобразования заявки в проект (в секундах)'
  },
  {
    id: 2,
    metric_name: 'chat_response_time',
    target_value: 900,
    period: 'hourly',
    description: 'Максимальное время ответа в чате (в секундах)'
  },
  {
    id: 3,
    metric_name: 'invoice_payment_time',
    target_value: 259200,
    period: 'weekly',
    description: 'Максимальное время оплаты счета (в секундах)'
  },
  {
    id: 4,
    metric_name: 'task_completion_rate',
    target_value: 0.9,
    period: 'daily',
    description: 'Минимальный процент задач, выполненных в срок'
  }
];
