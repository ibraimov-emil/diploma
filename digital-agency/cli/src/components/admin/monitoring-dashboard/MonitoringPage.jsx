import React from 'react';

const MonitoringPage = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-3xl">Monitoring Dashboard</p>
          <p className="text-gray-400">System performance monitoring</p>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-nowrap justify-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-400">System Health</p>
                <p className="text-2xl">Good</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage; 