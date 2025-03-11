import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  format,
  getDaysInMonth,
  isBefore,
  isAfter,
  parseISO,
  startOfToday,
} from 'date-fns';
import {Button, useTheme} from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DatePickerProps {
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  onDateSelect: (date: string) => void;
  mode?: 'default' | 'modal'; // Mode for input behavior
  visible?: boolean; // For "modal" mode (controlled by parent)
  onClose?: () => void; // Callback to close modal in "modal" mode
  label?: string; // Customizable label text (default: "Select Date")
  dateFormat?: string; // Date format for display (default: "MMM d, yyyy")
}

const DatePicker: React.FC<DatePickerProps> = ({
  initialDate,
  minDate,
  maxDate,
  disabledDates = [],
  onDateSelect,
  mode = 'default',
  visible,
  onClose,
  label = 'Select Date',
  dateFormat = 'MMM d, yyyy', // Default format: "Jan 1, 2025"
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const today = startOfToday();

  const [parsedInitialDate, setParsedInitialDate] = useState(
    initialDate ? parseISO(initialDate) : today,
  );

  useEffect(() => {
    setParsedInitialDate(initialDate ? parseISO(initialDate) : startOfToday());
  }, [initialDate]);

  // Modal visibility handling
  const [internalVisible, setInternalVisible] = useState(false);
  const modalVisible = mode === 'modal' ? visible : internalVisible;

  // Confirmed selected date
  const [selectedYear, setSelectedYear] = useState(
    parsedInitialDate.getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    parsedInitialDate.getMonth(),
  );
  const [selectedDay, setSelectedDay] = useState(parsedInitialDate.getDate());

  // Temporary state for pickers (not committed until confirm)
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempDay, setTempDay] = useState(selectedDay);

  const startYear = 1900;
  const endYear = maxDate
    ? parseISO(maxDate).getFullYear()
    : today.getFullYear() + 10;
  const years = Array.from(
    {length: endYear - startYear + 1},
    (_, i) => startYear + i,
  );
  const months = Array.from({length: 12}, (_, i) =>
    format(new Date(today.getFullYear(), i, 1), 'MMM'),
  );

  const daysInMonth = getDaysInMonth(new Date(tempYear, tempMonth));
  const days = Array.from({length: daysInMonth}, (_, i) => {
    const dayDate = new Date(tempYear, tempMonth, i + 1);
    return {
      value: i + 1,
      label: `${i + 1} ${format(dayDate, 'EEE')}`,
    };
  });

  const isDateDisabled = useCallback(
    (year: number, month: number, day: number) => {
      const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
      const dateObj = new Date(year, month, day);

      if (minDate && isBefore(dateObj, parseISO(minDate))) {
        return true;
      }
      if (maxDate && isAfter(dateObj, parseISO(maxDate))) {
        return true;
      }

      return disabledDates.includes(dateStr);
    },
    [minDate, maxDate, disabledDates],
  );

  useEffect(() => {
    if (isDateDisabled(tempYear, tempMonth, tempDay)) {
      setTempDay(1);
    }
  }, [tempYear, tempMonth, isDateDisabled, tempDay]);

  const confirmDate = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
    setSelectedDay(tempDay);

    const formattedDate = format(
      new Date(tempYear, tempMonth, tempDay),
      'yyyy-MM-dd',
    );
    if (!isDateDisabled(tempYear, tempMonth, tempDay)) {
      onDateSelect(formattedDate);
    }

    closeModal();
  };

  const closeModal = () => {
    if (mode === 'modal' && onClose) {
      onClose();
    } else {
      setInternalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {mode === 'default' && (
        <View style={styles.dateButton}>
          <Text style={styles.labelText}>{label}</Text>
          <Pressable onPress={() => setInternalVisible(true)}>
            <Text style={styles.dateText}>
              {format(
                new Date(selectedYear, selectedMonth, selectedDay),
                dateFormat,
              )}
            </Text>
          </Pressable>
        </View>
      )}

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeModal}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
            style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Picker
                selectedValue={tempDay}
                onValueChange={setTempDay}
                style={styles.picker}
                itemStyle={styles.pickerItemStyle}>
                {days.map(day => (
                  <Picker.Item
                    key={day.value}
                    label={day.label}
                    value={day.value}
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={tempMonth}
                onValueChange={setTempMonth}
                style={styles.picker}
                itemStyle={styles.pickerItemStyle}>
                {months.map((month, index) => (
                  <Picker.Item key={index} label={month} value={index} />
                ))}
              </Picker>

              <Picker
                selectedValue={tempYear}
                onValueChange={setTempYear}
                style={styles.picker}
                itemStyle={styles.pickerItemStyle}>
                {years.map(year => (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="text" textColor={colors.error} onPress={closeModal}>
                {'Cancel'}
              </Button>
              <Button
                mode="text"
                textColor={colors.primary}
                onPress={confirmDate}>
                {'Confirm'}
              </Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 20,
    },
    dateButton: {
      padding: 10,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    labelText: {
      fontSize: 16,
      color: colors.onSurface,
      fontWeight: 'bold',
    },
    dateText: {
      fontSize: 16,
      color: colors.onSurface,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 10,
      width: SCREEN_WIDTH,
      alignItems: 'center',
    },
    pickerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    picker: {
      flex: 1,
      height: 200,
    },
    pickerItemStyle: {
      fontSize: 18,
      color: colors.onSurface,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: 'flex-end',
      width: '100%',
    },
  });

export default DatePicker;
