import React from 'react';
import { NavLink } from 'react-bootstrap';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Main = () => {
  return (
    <div id='home' className='w-full h-screen text-center'>
      <div className='max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center'>
        <div>
          <p className='uppercase text-sm tracking-widest text-gray-600'>
            Добро пожаловать в наше инновационное веб-приложение!
          </p>
          <h1 className='py-4 text-gray-700'>
          Мы предлагаем уникальные решения для управления вашими финансами, общения с нашей командой и оформления заявок на услуги. С нашим приложением вы можете легко и удобно осуществлять оплату, обмениваться сообщениями и следить за статусом ваших заявок. 
          </h1>
          <h1 className='py-2 text-gray-700'>Просто нажмите на кнопку "Стать клиентом", чтобы начать свое незабываемое путешествие в мир инновационных решений и первоклассного обслуживания. </h1>
          <p className='py-4 text-gray-600 sm:max-w-[70%] m-auto'>
          Присоединяйтесь к нам уже сегодня!
          </p>
          <a
              href= '/#clientForm'
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Стать клиентом
          </a>
          <div className='flex items-center justify-between max-w-[330px] m-auto py-4'>
            <a
              href='http://localhost:3000'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaLinkedinIn />
              </div>
            </a>
            <a
                href='http://localhost:3000'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaGithub />
              </div>
            </a>
            <NavLink to='/#contact'>
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <AiOutlineMail />
              </div>
            </NavLink>
            <NavLink to='/resume'>
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <BsFillPersonLinesFill />
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
