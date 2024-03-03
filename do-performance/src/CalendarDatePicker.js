import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import './DatePickerStyles.css';

function CalendarDatePicker(){
    const [selectedDate, setSelectedDate] = useState(null);
    const handleDateChanage = (date) => {
        console.log('dsadas '+ date);
        setSelectedDate(date);
    }
    return(
        <>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChanage}
                dateFormat="YYYY/MM/DD/"
            />
        </>
    );
}
export default CalendarDatePicker;