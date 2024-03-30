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
  const [dsd, setDsd] = useState('');
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [filteredData, setFilteredData] = useState(null);
  const userId = getUserIdFromSession();

  const fetchData = async (startDate, endDate) => {

    try {
      const  response2 = await axios.get( `${process.env.REACT_APP_SERVER_ENDPOINT}`, {
          params: {
            criteria: `created_date:lte:${endDate}`,
            filter: `created_date:gte:${startDate}`
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
    initialStartDate = initialStartDate.toISOString().split('T')[0];
    initialEndDate.setDate(initialEndDate.getDate() + 1);
    initialEndDate = initialEndDate.toISOString().split('T')[0];

    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    fetchData(initialStartDate, initialEndDate);
    fetchDsd(); 

  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const handlePeriodChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
    fetchData(startDate, endDate);

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
          <tr><td><Legend>Divisional Secretariat</Legend></td><td><Legend>: {dsd}</Legend></td></tr>
          <tr><td><Legend>Start Date</Legend></td><td><Legend>: {startDate}</Legend></td></tr>
          <tr><td><Legend>End Date</Legend></td><td><Legend>: {endDate}</Legend></td></tr>
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
