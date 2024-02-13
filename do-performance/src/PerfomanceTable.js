import React, { useState, useEffect } from 'react';
import { DataTable, DataTableCell, TableHead, DataTableRow, DataTableColumnHeader, TableBody } from '@dhis2-ui/table';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import { Button } from '@dhis2/ui';
import { Field, Input } from '@dhis2/ui';

const PerfomanceTable = ({ data }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const handleDownload = (format) => {
    setSelectedFormat(format);
  };

  const onChange = (selectedOption) => {
    if (selectedOption) {
      handleDownload(selectedOption.value);
    }
  };

  const onSingleSelectChange = (selectedOption) => {
    if (selectedOption) {
      handleDownload(selectedOption.value);
    }
  };

  useEffect(() => {
    if (selectedFormat === 'pdf') {
      generatePDF();
    } else if (selectedFormat === 'excel') {
      generateExcel();
    }
    // Reset selected format for the next selection
    setSelectedFormat(null);
  }, [selectedFormat]);

  const generatePDF = () => {
    // Implement your PDF generation logic using your data and formatting requirements
    alert('PDF generation triggered!');
  };

  const generateExcel = () => {
    // Implement your Excel generation logic using your data and formatting requirements
    alert('Excel generation triggered!');
  };

  const onInputChange = (do_name) => {
    const inputValue = do_name.value.toLowerCase();
    console.log('Input value:', inputValue);
    const filtered = data.filter(row => row[0].toLowerCase().includes(inputValue));
    setFilteredData(filtered);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <table>
          <tr>
            <td>
              <Field
                  helpText="Search Development Officer"
                  label="Development Officer">
                  <Input label="An input" name="input" onChange={onInputChange} />
              </Field>
            </td>
            <td>
              <SingleSelect label="Download" className="select" onChange={onSingleSelectChange}>
                <SingleSelectOption label="PDF" value="pdf" id="pdf"/>
                <SingleSelectOption label="Excel" value="excel" id="excel"/>
              </SingleSelect>
            </td>
            <td>
              <Button name="share" value="default"> Share </Button>
            </td>
          </tr>
        </table>
      </div>

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
          {filteredData.map((row) => (
            <DataTableRow key={row[0]}>
              {row.map((cell, index) => (
                <DataTableCell key={index}>{cell}</DataTableCell>
              ))}
            </DataTableRow>
          ))}
        </TableBody>
      </DataTable>
    </>
  );
};

export default PerfomanceTable;
