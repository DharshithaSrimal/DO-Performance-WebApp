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

  const handleDownload = (format) => {
    setSelectedFormat(format);
  };

  const onSingleSelectChange = (selectedOption) => {
    if (selectedOption.selected) {
      handleDownload(selectedOption.selected);
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
    let rangeStartDate = new Date(date[0]);
    rangeStartDate.setDate(rangeStartDate.getDate()+1);
    rangeStartDate = rangeStartDate.toISOString().split('T')[0];
    let rangeEndDate = date[1];
    if (rangeEndDate){
      rangeEndDate.setDate(rangeEndDate.getDate()+1);
      rangeEndDate = rangeEndDate.toISOString().split('T')[0];
      setStartDate(date);
      setEndDate(date);
      onPeriodChange(rangeStartDate, rangeEndDate);
    }
    
    
};


  return (
    <>
      <div>
        <br></br>
        <table>
          <tr>
            <td><Legend>GN Devision</Legend></td>
            <td><Legend>Development Officer</Legend></td>
            <td><Legend>Date Range</Legend></td>
            <td><Legend>Download</Legend></td>
            {/* <td><Legend>Period</Legend></td> */}
          </tr>
          <tr>
            <td>
                <Field>
                    <Input label="An input" name="input" />
                </Field>
            </td>
            <td>
              <Field>
                  <Input label="An input" name="input" onChange={onInputChange} />
              </Field>
            </td>
            <td>
              <CalendarDatePicker onDateChange={handleDateChange} />
            </td>
            <td>
              <SingleSelect label="Download" className="select" onChange={onSingleSelectChange}>
                <SingleSelectOption label="PDF" value="pdf" id="pdf"/>
                {/* <SingleSelectOption label="Excel" value="excel" id="excel"/> */}
              </SingleSelect>
            </td>
            {/* <td>
              <SingleSelect label="Period" className="select" selected={selectedPeriod} onChange={onSingleSelectChangePeriod} style={{ width: '30%' }}>
                <SingleSelectOption label="Daily" value="daily" id="daily"/>
                <SingleSelectOption label="Monthly" value="monthly" id="monthly"/>
              </SingleSelect>
            </td> */}
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
