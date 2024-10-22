import React, { useState, useEffect, useRef  } from 'react';
import { DataTable, DataTableCell, TableHead, DataTableRow, DataTableColumnHeader, TableBody } from '@dhis2-ui/table';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import { Field, Input, Legend } from '@dhis2/ui';
import { useReactToPrint } from 'react-to-print';
import CalendarDatePicker from './CalendarDatePicker';

const ReferralsAndVisits = ({ data, onPeriodChange, dsd, transformedStartDate, transformedEndDate}) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const componentRef = useRef();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [doInputValue, setDoInputValue] = useState();
  const [gnInputValue, setGnInputValue] = useState();

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
    setDoInputValue(inputValue);
    if(gnInputValue!=undefined){
    const filtered = data.filter(row => {
      const officerMatches = row[1].toLowerCase().includes(inputValue);
        const gnMatches = row[0].toLowerCase().includes(gnInputValue);
        return officerMatches && gnMatches;
      });
      setFilteredData(filtered);
    } else{
      const filtered = data.filter(row => {
        const officerMatches = row[1].toLowerCase().includes(inputValue);
        return officerMatches;
        });
        setFilteredData(filtered);
    }
    
  };

  const onGNChange = (gn_name) => {
    const inputValue = gn_name.value.toLowerCase();
    setGnInputValue(inputValue);
    if(doInputValue!=undefined){
      const filtered = data.filter(row => {
      const gnMatches = row[0].toLowerCase().includes(inputValue);
        const officerMatches = row[1].toLowerCase().includes(doInputValue);
        return officerMatches && gnMatches;
    });
    setFilteredData(filtered);
    } else{
      const filtered = data.filter(row => {
        const gnMatches = row[0].toLowerCase().includes(inputValue);
        return gnMatches;
      });
      setFilteredData(filtered);
    }
  }
  
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
            {/* <td><Legend>Date Range</Legend></td> */}
            <td><Legend>GN Division</Legend></td>
            <td><Legend>Screener name</Legend></td>
            <td><Legend>Download</Legend></td>
            
          </tr>
          <tr>
            {/* <td>
              <CalendarDatePicker onDateChange={handleDateChange} />
            </td> */}
            <td>
                <Field>
                    <Input label="An input" name="input" onChange={onGNChange} />
                </Field>
            </td>
            <td>
              <Field>
                  <Input label="An input" name="input" onChange={onInputChange} />
              </Field>
            </td>
            <td>
              <SingleSelect label="Download" className="select" onChange={onSingleSelectChange}>
                <SingleSelectOption label="PDF" value="pdf" id="pdf"/>
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
            <DataTableColumnHeader>GN division</DataTableColumnHeader>
            <DataTableColumnHeader>Screener name</DataTableColumnHeader>
            <DataTableColumnHeader>Clients referred</DataTableColumnHeader>
            <DataTableColumnHeader>Clients not referred</DataTableColumnHeader>
            <DataTableColumnHeader>Client visits</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
        {filteredData.map((row, index) => (
              <DataTableRow key={index}>
                <DataTableCell>{row[0]}</DataTableCell>
                <DataTableCell align="center">{row[1]}</DataTableCell>
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
            <DataTableColumnHeader>GN division</DataTableColumnHeader>
            <DataTableColumnHeader>Screener name</DataTableColumnHeader>
            <DataTableColumnHeader>Clients referred</DataTableColumnHeader>
            <DataTableColumnHeader>Clients not referred</DataTableColumnHeader>
            <DataTableColumnHeader>Client visits</DataTableColumnHeader>
        </DataTableRow>
      </TableHead>
      <TableBody>
      {data.map((row) => (
              <DataTableRow key={row[0]}>
                <DataTableCell>{row[0]}</DataTableCell>
                <DataTableCell align="center">{row[1]}</DataTableCell>
                <DataTableCell align="center">{row[8]}</DataTableCell>
                <DataTableCell align="center">{row[9]}</DataTableCell>
                <DataTableCell align="center">{row[10]}</DataTableCell>
              </DataTableRow>
            ))}
        </TableBody>
      </DataTable>
  </div>
));

export default ReferralsAndVisits;
