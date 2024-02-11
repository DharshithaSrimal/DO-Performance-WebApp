import React, { useState, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import classes from './App.module.css';
import { DataTable } from '@dhis2-ui/table';
import { DataTableCell } from '@dhis2-ui/table';
import { TableHead } from '@dhis2-ui/table';
import { DataTableRow } from '@dhis2-ui/table';
import { DataTableColumnHeader } from '@dhis2-ui/table';
import { TableBody } from '@dhis2-ui/table';
import axios from 'axios';
import { Menu, MenuItem } from '@dhis2-ui/menu';
import PerfomanceTable from './PerfomanceTable';

const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/qU1fqvtLn7e/data';
const username = 'admin';
const password = 'district';

const MyApp = () => {
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
      <Menu activeItem={activeMenuItem}>
        <MenuItem onClick={() => handleMenuItemClick(1)} label="DO Performance" />
        <MenuItem onClick={() => handleMenuItemClick(2)} label="Tasks" />
      </Menu>
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



export default MyApp;
