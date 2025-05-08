import React from 'react';
import SupportPage from '../../components/admin/support/SupportPage';
import { Header } from '../../components/Dashboard';

const Support = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Administration" title="Support & Incident Reporting" />
      <SupportPage />
    </div>
  );
};

export default Support; 