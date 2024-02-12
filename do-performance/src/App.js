import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlyoutMenu, MenuItem } from '@dhis2-ui/menu';
import PerfomanceTable from './PerfomanceTable';
import Tasks from './Tasks';

const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/mb4ScGwNDBf/data';
const username = 'admin';
const password = 'district';

const DOPerformanceApp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(serverUrl, {
          auth: {
            username,
            password,
          },
        });
        setData(response.data.listGrid.rows); // Access the correct data array
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
          {loading && <span>Loading data...</span>}
          {error && <span>Error: {error.message}</span>}
          {data && activeMenuItem === 1 && <PerfomanceTable data={data} />}
          {data && activeMenuItem === 2 && <Tasks data={data} />}
        </section>
      </main>
     );
   }



export default DOPerformanceApp;
