import React from 'react';

import mockedData from '../../mockedData';
import Layout from './Layout';

export default function graphs({navigation}) {
  const activity = navigation.getParam('activity', null);
  const userInfo = navigation.getParam('userInfo', null);
  const activities = navigation.getParam('activities', null);
  return (
    <Layout
      activities={activities}
      userInfo={userInfo}
    />
  );
}
