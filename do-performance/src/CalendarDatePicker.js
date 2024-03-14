import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerStyles.css';

function DateRangePicker({ onDateChange }) {
  const initialStartDate = new Date(); 
  const initialEndDate = new Date(); 
  initialStartDate.setDate(initialEndDate.getDate() - 1);

  const [dateRange, setDateRange] = useState([initialStartDate, initialEndDate]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (update) => {
    console.log(update[0]);
    console.log(update[1]);
    setDateRange(update);
    onDateChange(update);
  };

  return (
    <>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        isClearable={false}
        dateFormat="yyyy-MM-dd"
      />
    </>
  );
}

export default DateRangePicker;
