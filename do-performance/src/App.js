import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlyoutMenu, MenuItem } from '@dhis2-ui/menu';
import PerfomanceTable from './PerfomanceTable';
import Tasks from './Tasks';
import { Legend } from '@dhis2/ui';

//const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/mb4ScGwNDBf/data?criteria=created_by_code:admin';
const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/GB4zoRiLoor/data';
const getUserIdFromSession = () => {
  const userId = localStorage.getItem('dhis2.latestUser');
  return userId;
};

const DOPerformanceApp = () => {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState(1); 
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // Default to daily
  
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [filteredData, setFilteredData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserIdFromSession();
        const userDetais = `${process.env.REACT_APP_SERVER_ENDPOINT}`+userId;
        const [response1, response2] = await Promise.all([
          axios.get(userDetais, {
            auth: {
              username: `${process.env.REACT_APP_UN}`,
              password: `${process.env.REACT_APP_PW}`
            },
          }),
          axios.get(serverUrl, {
            auth: {
              username: `${process.env.REACT_APP_UN}`,
              password: `${process.env.REACT_APP_PW}`
            },
          }),
        ]);
        setUserData(response1.data);
        setData(response2.data.listGrid.rows);
        setFilteredData(response2.data.listGrid.rows); 

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString();
    let newStartDate, newEndDate;

    if (period === 'daily') {
      newStartDate = formattedCurrentDate;
      newEndDate = formattedCurrentDate;
    } else if (period === 'monthly') {
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 30);
      newStartDate = startDate.toLocaleDateString();
      newEndDate = formattedCurrentDate;
    }

    // Use startDate and endDate as needed in your application
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // Filter the data based on the new start date and end date
    const filteredData = data.filter(row => {
    const rowDate = new Date(row[11]);
    return rowDate >= new Date(newStartDate) && rowDate <= new Date(newEndDate);
  });
  setFilteredData(filteredData);
  };


  return (
    <main style={{ border: '1px solid grey', display: 'flex', height: '100%' }}>
      <FlyoutMenu activeItem={activeMenuItem}>
        <MenuItem onClick={() => handleMenuItemClick(1)} label="DO Performance" />
        <MenuItem onClick={() => handleMenuItemClick(2)} label="Tasks" />
      </FlyoutMenu>
      <section
        style={{
          backgroundColor: '#f3ffff',
          borderLeft: '1px solid grey',
          flexGrow: 1,
          padding: 20,
        }}>
          <table>
            <tr><td><Legend>Divisional Secretariat</Legend></td><td><Legend>: Kalutara DSD</Legend></td></tr>
            <tr><td><Legend>Period</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? 'Daily' : 'Monthly'}</Legend></td></tr>
            <tr><td><Legend>Date start</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? startDate : startDate}</Legend></td></tr>
            <tr><td><Legend>Period end</Legend></td><td><Legend>: {selectedPeriod === 'daily' ? endDate : endDate}</Legend></td></tr> 
          </table>
          {loading && <span>Loading data...</span>}
          {error && <span>Error: {error.message}</span>}
          {data && activeMenuItem === 1 && <PerfomanceTable data={data} onPeriodChange={handlePeriodChange}/>}
          {data && activeMenuItem === 2 && <Tasks data={data} />}
        </section>
      </main>
     );
   }



export default DOPerformanceApp;
