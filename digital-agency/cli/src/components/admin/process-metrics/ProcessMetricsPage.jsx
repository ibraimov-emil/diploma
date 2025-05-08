import React from 'react';
import ProcessMetrics from './process-metrics';

const ProcessMetricsPage = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-3xl">Process Metrics Dashboard</p>
          <p className="text-gray-400">Key performance indicators for business processes</p>
        </div>
      </div>
      <div className="mt-10">
        <ProcessMetrics />
      </div>
    </div>
  );
};

export default ProcessMetricsPage; 