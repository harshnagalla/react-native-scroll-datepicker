import React from 'react';
interface DatePickerProps {
    initialDate?: string;
    minDate?: string;
    maxDate?: string;
    disabledDates?: string[];
    onDateSelect: (date: string) => void;
    mode?: 'default' | 'modal';
    visible?: boolean;
    onClose?: () => void;
    label?: string;
    dateFormat?: string;
}
declare const DatePicker: React.FC<DatePickerProps>;
export default DatePicker;
