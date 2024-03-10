import React, { useState, useEffect, useRef  } from 'react';
import { DataTable, DataTableCell, TableHead, DataTableRow, DataTableColumnHeader, TableBody } from '@dhis2-ui/table';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import { Field, Input, Legend } from '@dhis2/ui';
import { useReactToPrint } from 'react-to-print';
import CalendarDatePicker from './CalendarDatePicker';

const PerfomanceTable = ({ data, onPeriodChange, dsd, transformedStartDate, transformedEndDate}) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const componentRef = useRef();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const startingTime = ' 00:00:00.000';
  const endTime = ' 23:59:59.999';

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
        
        const newDate = new Date(startDate);
        let newStartDate = new Date(newDate);
        let newEndDate = new Date(newDate);
        if (selectedOption.selected === 'daily') {
            newStartDate = newDate.toISOString().split('T')[0] + startingTime;
            newEndDate.setDate(newEndDate.getDate() - 2);
            newEndDate = newEndDate.toISOString().split('T')[0] + endTime;

        } else if (selectedOption.selected === 'monthly') {
            newStartDate = newDate.toISOString().split('T')[0] + startingTime;
            newEndDate.setMonth(newEndDate.getMonth() - 2); // Subtract one month from the start date
            newEndDate.setDate(newEndDate.getDate() - 2);
            newEndDate = newEndDate.toISOString().split('T')[0] + endTime;
            
        }
        onPeriodChange(selectedOption.selected, newStartDate, newEndDate);

    }
};

  useEffect(() => {
    if (selectedFormat === 'pdf') {
      generatePDF();
    } else if (selectedFormat === 'excel') {
      generateExcel();
    }
    setSelectedFormat(null);

  }, [selectedFormat]);

  useEffect(()=>{
    setFilteredData(data)
  },[data])


  const generatePDF = () => {
    handlePrint();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generateExcel = () => {
    alert('Excel generation triggered!');
  };

  const onInputChange = (do_name) => {
    const inputValue = do_name.value.toLowerCase();
    const filtered = data.filter(row => {
      const officerMatches = row[0].toLowerCase().includes(inputValue);
      return officerMatches;
    });
    setFilteredData(filtered);
  };
  
  const handleDateChange = (date) => {
    setStartDate(date);
    setEndDate(date);
    onPeriodChange(selectedPeriod, date);
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
                {/* <SingleSelectOption label="Excel" value="excel" id="excel"/> */}
              </SingleSelect>
            </td>
            <td>
              <CalendarDatePicker onDateChange={handleDateChange} />
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
        <ComponentToPrint ref={componentRef} data={filteredData} dsd={dsd} transformedStartDate={transformedStartDate} transformedEndDate={transformedEndDate}/>
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
        {filteredData.map((row, index) => (
              <DataTableRow key={index}>
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

const ComponentToPrint = React.forwardRef(({ data, dsd, transformedStartDate, transformedEndDate }, ref) => (
  <div ref={ref} style={{ marginTop: '1in', marginLeft: '0.25in', marginRight: '0.25in' }}>
    <table>
            <tr><td><Legend>Divisional Secretariat</Legend></td><td><Legend>: {dsd}</Legend></td></tr>
            <tr><td><Legend>Period</Legend></td><td><Legend>: </Legend></td></tr>
            <tr><td><Legend>Date start</Legend></td><td><Legend>: {transformedStartDate}</Legend></td></tr>
            <tr><td><Legend>Period end</Legend></td><td><Legend>: {transformedEndDate}</Legend></td></tr> 
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
