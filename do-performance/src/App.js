import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlyoutMenu, MenuItem } from '@dhis2-ui/menu';
import PerfomanceTable from './PerfomanceTable';
import Tasks from './Tasks';
import { Legend } from '@dhis2/ui';

const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/mb4ScGwNDBf/data?criteria=created_by_code:admin';
const personalAccessToken = 'd2pat_XmE7JK8hIAxIlbbyxrllYMIwR0ExyOsD4033580229';
const userDetais = 'http://localhost:8084/dhis/api/me';

const DOPerformanceApp = () => {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(userDetais, {
            headers: {
              Authorization: personalAccessToken,
            },
          }),
          axios.get(serverUrl, {
            headers: {
              Authorization: personalAccessToken,
            },
          }),
        ]);
        setUserData(response1.data);
        console.log('aaabb'+response1.data);
        setData(response2.data.listGrid.rows);

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
            <tr><td><Legend>Divisional Secretariat:</Legend></td><td></td></tr>
            <tr><td><Legend>Period:</Legend></td><td></td></tr>
            <tr><td><Legend>Date start:</Legend></td><td></td></tr>
            <tr><td><Legend>Period end:</Legend></td><td></td></tr>
          </table>
          {loading && <span>Loading data...</span>}
          {error && <span>Error: {error.message}</span>}
          {data && activeMenuItem === 1 && <PerfomanceTable data={data} />}
          {data && activeMenuItem === 2 && <Tasks data={data} />}
        </section>
      </main>
     );
   }



export default DOPerformanceApp;
