import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlyoutMenu, MenuItem } from '@dhis2-ui/menu';
import PerfomanceTable from './PerfomanceTable';
import Tasks from './Tasks';
import { Legend } from '@dhis2/ui';

const getUserIdFromSession = () => {
  const userId = localStorage.getItem('dhis2.latestUser');
  return userId;
};

const DOPerformanceApp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [dsd, setDsd] = useState('');
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [filteredData, setFilteredData] = useState(null);
  const startingTime = ' 00:00:00.000';
  const endTime = ' 23:59:59.999';
  const userId = getUserIdFromSession();

  const transformDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async (period, startDate, endDate) => {

    try {
      const  response2 = await axios.get( `${process.env.REACT_APP_SERVER_ENDPOINT}`, {
          params: {
            filter: `created_date:lte:${startDate}`,
            filter: `created_date:gte:${endDate}`
          },
          auth: {
            username: `${process.env.REACT_APP_UN}`,
            password: `${process.env.REACT_APP_PW}`
          },
        });
        
      setData(response2.data.listGrid.rows);
      setFilteredData(response2.data.listGrid.rows);

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  const fetchDsd = async () => {
    try { 
      const response1 = await axios.get( `${process.env.REACT_APP_ORG_UNIT_GROUPS}`, {
          auth: {
            username: `${process.env.REACT_APP_UN}`,
            password: `${process.env.REACT_APP_PW}`
          },
        });

        if (response1.data) {
          const foundUser = response1.data.listGrid.rows.find(row => {
            const sharing = JSON.parse(row[1]);
            return sharing.users && sharing.users[userId];
          });

          if (foundUser) {
            setDsd(foundUser[0]);
          }
        }

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let initialStartDate = new Date(startDate);
    let initialEndDate = new Date(startDate);
    initialStartDate = currentDate.toISOString().split('T')[0];
    initialEndDate.setMonth(initialEndDate.getMonth() - 2);
    initialEndDate.setDate(initialEndDate.getDate());
    initialEndDate = initialEndDate.toISOString().split('T')[0];

    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    fetchData(selectedPeriod, initialStartDate, initialEndDate);
    fetchDsd(); 

  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const handlePeriodChange = (period, startDate, endDate) => {
    const currentDate = new Date(startDate);
    let newStartDate = new Date(currentDate);
    let newEndDate = new Date(currentDate);
    if (period === 'daily') {
      newStartDate.setDate(newStartDate.getDate() + 1);
      newStartDate = newStartDate.toISOString().split('T')[0] + startingTime;
      newEndDate.setDate(newEndDate.getDate());
      newEndDate = newEndDate.toISOString().split('T')[0] + endTime;
    } else if (period === 'monthly') {
      newStartDate.setDate(newStartDate.getDate() + 1);
      newStartDate = newStartDate.toISOString().split('T')[0] + startingTime;
      newEndDate.setMonth(newEndDate.getMonth() - 2); // Subtract one month from the start date
      newEndDate.setDate(newEndDate.getDate());
      newEndDate = newEndDate.toISOString().split('T')[0] + endTime;

    }
    const transformedStartDate = transformDate(newStartDate);
    const transformedEndDate = transformDate(newEndDate);
    setSelectedPeriod(period);

    setStartDate(transformedStartDate);
    setEndDate(transformedEndDate);
    fetchData(period, transformedStartDate, transformedEndDate);

  };


  return (
    <main style={{ border: '1px solid grey', display: 'flex', height: '100%' }}>
      <FlyoutMenu activeItem={activeMenuItem}>
        <MenuItem onClick={() => handleMenuItemClick(1)} label="DO Performance" />
        {/* <MenuItem onClick={() => handleMenuItemClick(2)} label="Tasks" /> */}
      </FlyoutMenu>
      <section
        style={{
          backgroundColor: '#f3ffff',
          borderLeft: '1px solid grey',
          flexGrow: 1,
          padding: 20,
        }}>
        <table>
          <tr><td><Legend>Divisional Secretariat</Legend></td><td><Legend>:{dsd}</Legend></td></tr>
          <tr><td><Legend>Period</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? 'Daily' : 'Monthly'}</Legend></td></tr>
          <tr><td><Legend>Date start</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? startDate : startDate}</Legend></td></tr>
          <tr><td><Legend>Period end</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? endDate : endDate}</Legend></td></tr>
        </table>
        {loading && <span>Loading data...</span>}
        {error && <span>Error: {error.message}</span>}
        {data && activeMenuItem === 1 && <PerfomanceTable data={data} onPeriodChange={handlePeriodChange} dsd={dsd}  transformedStartDate={startDate} transformedEndDate={endDate} />}
        {/* {data && activeMenuItem === 2 && <Tasks data={data} />} */}
      </section>
    </main>
  );
}

export default DOPerformanceApp;
