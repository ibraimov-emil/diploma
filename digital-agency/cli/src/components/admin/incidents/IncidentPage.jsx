import React from 'react';
import { Tabs, Card } from 'antd';
import IncidentForm from './IncidentForm';
import IncidentList from './IncidentList';

const { TabPane } = Tabs;

const IncidentPage = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Tabs defaultActiveKey="report" size="large">
        <TabPane tab="Сообщить об инциденте" key="report">
          <IncidentForm />
        </TabPane>
        <TabPane tab="Просмотр инцидентов" key="view">
          <IncidentList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default IncidentPage; 