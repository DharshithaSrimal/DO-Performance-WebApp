import React, { useState, useEffect, useRef  } from 'react';
import { DataTable, DataTableCell, TableHead, DataTableRow, DataTableColumnHeader, TableBody } from '@dhis2-ui/table';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import { Field, Input, Legend } from '@dhis2/ui';
import { useReactToPrint } from 'react-to-print';
import CalendarDatePicker from './CalendarDatePicker';

const PerfomanceTable = ({ data, onPeriodChange  }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const componentRef = useRef();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const handleDownload = (format) => {
    setSelectedFormat(format);
  };

  const onChange = (selectedOption) => {
    if (selectedOption) {
      handleDownload(selectedOption.value);
    }
  };

  const onSingleSelectChange = (selectedOption) => {
    if (selectedOption.selected) {
      handleDownload(selectedOption.selected);
    }
  };

  const onSingleSelectChangePeriod = (selectedOption) => {
    if (selectedOption.selected) {
      setSelectedPeriod(selectedOption.selected);
      onPeriodChange(selectedOption.selected);
  
      const currentDate = new Date();
      let newStartDate, newEndDate;
  
      if (selectedOption.selected === 'daily') {
        newStartDate = currentDate.toISOString().split('T')[0] + ' 00:00:00.000';
        newEndDate = currentDate.toISOString().split('T')[0] + ' 23:59:59.999';
      } else if (selectedOption.selected === 'monthly') {
        const startDate = new Date(currentDate);
        startDate.setDate(1);
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        newStartDate = startDate.toISOString().split('T')[0] + ' 00:00:00.000';
        newEndDate = endDate.toISOString().split('T')[0] + ' 23:59:59.999';
      }
      // Use startDate and endDate as needed in your application
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      console.log('aaa '+data);
      // Filter the data based on the new start date and end date
      const filteredData = data.filter(item => {
        const itemDate = item[11];
        console.log('ccc '+itemDate);
        return itemDate >= newStartDate && itemDate <= newEndDate;
      });
      console.log('bbb '+filteredData);
      // Update the filtered data state
      setFilteredData(filteredData);
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
    handlePrint();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generateExcel = () => {
    // Implement your Excel generation logic using your data and formatting requirements
    alert('Excel generation triggered!');
  };

  const onInputChange = (do_name) => {
    const inputValue = do_name.value.toLowerCase();
    const filtered = data.filter(row => {
      const officerMatches = row[0].toLowerCase().includes(inputValue);
      const dateMatches = row[11] >= startDate && row[11] <= endDate; // Assuming date is at index 11 in your data array, adjust if needed
      return officerMatches && dateMatches;
    });
    setFilteredData(filtered);
  };

  return (
    <>
      <div>
        <br></br>
        <table>
          <tr>
            <td><Legend>Development Officer</Legend></td>
            <td><Legend>Download</Legend></td>
            <td><Legend>Date</Legend></td>
            <td><Legend>Period</Legend></td>
          </tr>
          <tr>
            <td>
              <Field>
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
              <CalendarDatePicker></CalendarDatePicker>
            </td>
            <td>
              <SingleSelect label="Period" className="select" selected={selectedPeriod} onChange={onSingleSelectChangePeriod} style={{ width: '30%' }}>
                <SingleSelectOption label="Daily" value="daily" id="daily"/>
                <SingleSelectOption label="Monthly" value="monthly" id="monthly"/>
              </SingleSelect>
            </td>
          </tr>
        </table>
      </div>

      <div style={{ display: selectedFormat === 'pdf' ? 'block' : 'none' }}>
        <ComponentToPrint ref={componentRef} data={filteredData} />
      </div>

      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableCell></DataTableCell>
            <DataTableCell colSpan={3} align="center">Registration and screening</DataTableCell>
            <DataTableCell colSpan={1} align="center">Referral</DataTableCell>
            <DataTableCell colSpan={6} align="center">Follow-ups</DataTableCell>
          </DataTableRow>
          <DataTableRow>
            <DataTableColumnHeader>Development Officer</DataTableColumnHeader>
            <DataTableColumnHeader>Screenings due</DataTableColumnHeader>
            <DataTableColumnHeader>Clients screened</DataTableColumnHeader>
            <DataTableColumnHeader>Clients not consenting to screening</DataTableColumnHeader>
            <DataTableColumnHeader>Clients referred</DataTableColumnHeader>
            <DataTableColumnHeader>Phone calls due</DataTableColumnHeader>
            <DataTableColumnHeader>Phone calls overdue</DataTableColumnHeader>
            <DataTableColumnHeader>Phone calls completed</DataTableColumnHeader>
            <DataTableColumnHeader>Home visits due</DataTableColumnHeader>
            <DataTableColumnHeader>Home visits overdue</DataTableColumnHeader>
            <DataTableColumnHeader>Home visits completed</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
        {filteredData.map((row) => (
              <DataTableRow key={row[0]}>
                <DataTableCell>{row[0]}</DataTableCell>
                <DataTableCell align="center">{row[1]}</DataTableCell>
                <DataTableCell align="center">{row[2]}</DataTableCell>
                <DataTableCell align="center">{row[3]}</DataTableCell>
                <DataTableCell align="center">{row[4]}</DataTableCell>
                <DataTableCell align="center">{row[5]}</DataTableCell>
                <DataTableCell align="center">{row[6]}</DataTableCell>
                <DataTableCell align="center">{row[7]}</DataTableCell>
                <DataTableCell align="center">{row[8]}</DataTableCell>
                <DataTableCell align="center">{row[9]}</DataTableCell>
                <DataTableCell align="center">{row[10]}</DataTableCell>
              </DataTableRow>
            ))}
        </TableBody>
      </DataTable>
    </>
  );
};

const ComponentToPrint = React.forwardRef(({ data }, ref) => (
  <div ref={ref}>
    <table>
            <tr><td><Legend>Divisional Secretariat</Legend></td><td><Legend>: </Legend></td></tr>
            <tr><td><Legend>Period</Legend></td><td><Legend>: </Legend></td></tr>
            <tr><td><Legend>Date start</Legend></td><td><Legend>: </Legend></td></tr>
            <tr><td><Legend>Period end</Legend></td><td><Legend>: </Legend></td></tr> 
          </table>
    <DataTable>
      <TableHead>
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
                <DataTableCell align="center">{row[1]}</DataTableCell>
                <DataTableCell align="center">{row[2]}</DataTableCell>
                <DataTableCell align="center">{row[3]}</DataTableCell>
                <DataTableCell align="center">{row[4]}</DataTableCell>
                <DataTableCell align="center">{row[5]}</DataTableCell>
                <DataTableCell align="center">{row[6]}</DataTableCell>
                <DataTableCell align="center">{row[7]}</DataTableCell>
                <DataTableCell align="center">{row[8]}</DataTableCell>
                <DataTableCell align="center">{row[9]}</DataTableCell>
                <DataTableCell align="center">{row[10]}</DataTableCell>
              </DataTableRow>
            ))}
        </TableBody>
      </DataTable>
  </div>
));

export default PerfomanceTable;
