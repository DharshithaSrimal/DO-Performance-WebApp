import React, { useState, useEffect } from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import classes from './App.module.css';
import { DataTable } from '@dhis2-ui/table';
import { DataTableCell } from '@dhis2-ui/table';
import { TableHead } from '@dhis2-ui/table';
import { DataTableRow } from '@dhis2-ui/table';
import { DataTableColumnHeader } from '@dhis2-ui/table';
import { TableBody } from '@dhis2-ui/table';
import { useDataQuery } from '@dhis2/app-runtime';
import axios from 'axios';

const serverUrl = 'http://localhost:8084/dhis/api/sqlViews/qU1fqvtLn7e/data';
const username = 'admin';
const password = 'district';

const MyApp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={classes.container}>
      <h2>{i18n.t('Development Officer Performance Report')}</h2>
      {loading && <span>Loading data...</span>}
      {error && <span>Error: {error.message}</span>}
      {data && (
        <DataTable>
          <TableHead>
            <DataTableRow>
            <DataTableCell></DataTableCell>
            <DataTableCell colSpan={3}>Registration and screening</DataTableCell>
            <DataTableCell colSpan={2}>Referral and clinic visits</DataTableCell>
            </DataTableRow>
            <DataTableRow>
                <DataTableColumnHeader>Development Officer</DataTableColumnHeader>
                <DataTableColumnHeader>Clients registered</DataTableColumnHeader>
                <DataTableColumnHeader>Clients screened not at risk</DataTableColumnHeader>
                <DataTableColumnHeader>Clients not consenting to screening</DataTableColumnHeader>
                <DataTableColumnHeader>Clients referred</DataTableColumnHeader>
                <DataTableColumnHeader>Clients not referred</DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <DataTableRow key={row[0]}>
                <DataTableCell>{row[0]}</DataTableCell>
                <DataTableCell>{row[1]}</DataTableCell>
                <DataTableCell>{row[2]}</DataTableCell>
                <DataTableCell>{row[3]}</DataTableCell>
                <DataTableCell>{row[4]}</DataTableCell>
                <DataTableCell>{row[5]}</DataTableCell>
              </DataTableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </div>
  );
};

export default MyApp;
