import React, { useState, useEffect } from 'react';
import { DataTable } from '@dhis2-ui/table';
import { DataTableCell } from '@dhis2-ui/table';
import { TableHead } from '@dhis2-ui/table';
import { DataTableRow } from '@dhis2-ui/table';
import { DataTableColumnHeader } from '@dhis2-ui/table';
import { TableBody } from '@dhis2-ui/table';

const PerfomanceTable = ({ data }) => (
    <DataTable>
            <TableHead>
              <DataTableRow>
              <DataTableCell></DataTableCell>
              <DataTableCell colSpan={2}>Registration and screening</DataTableCell>
              <DataTableCell colSpan={2}>Referral and clinic visits</DataTableCell>
              <DataTableCell colSpan={6}>Follow-ups</DataTableCell>
              </DataTableRow>
              <DataTableRow>
                  <DataTableColumnHeader>Development Officer</DataTableColumnHeader>
                  <DataTableColumnHeader>Clients registered</DataTableColumnHeader>
                  <DataTableColumnHeader>Clients not consenting to screening</DataTableColumnHeader>
                  <DataTableColumnHeader>Clients referred</DataTableColumnHeader>
                  <DataTableColumnHeader>Clients not referred</DataTableColumnHeader>
                  <DataTableColumnHeader>Screenings due</DataTableColumnHeader>
                  <DataTableColumnHeader>Screenings overdue</DataTableColumnHeader>
                  <DataTableColumnHeader>Phone calls due</DataTableColumnHeader>
                  <DataTableColumnHeader>Phone calls overdue</DataTableColumnHeader>
                  <DataTableColumnHeader>Home visits due</DataTableColumnHeader>
                  <DataTableColumnHeader>Home visits overdue</DataTableColumnHeader>
              </DataTableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <DataTableRow key={row[0]}>
                  <DataTableCell>{row[0]}</DataTableCell>
                  <DataTableCell>{row[1]}</DataTableCell>
                  <DataTableCell>{row[3]}</DataTableCell>
                  <DataTableCell>{row[4]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                  <DataTableCell>{row[5]}</DataTableCell>
                </DataTableRow>
              ))}
            </TableBody>
          </DataTable>
  );

  export default PerfomanceTable;