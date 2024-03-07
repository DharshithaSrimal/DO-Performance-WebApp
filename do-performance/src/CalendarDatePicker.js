import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import './DatePickerStyles.css';

function CalendarDatePicker({ onDateChange }){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChanage = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    }
    return(
        <>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChanage}
                dateFormat="yyyy-MM-dd"
            />
        </>
    );
}
export default CalendarDatePicker;