import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, StyleSheet, Pressable, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { format, getDaysInMonth, isBefore, isAfter, parseISO, startOfToday, } from 'date-fns';
import { Button, useTheme } from 'react-native-paper';
var SCREEN_WIDTH = Dimensions.get('window').width;
var DatePicker = function (_a) {
    var initialDate = _a.initialDate, minDate = _a.minDate, maxDate = _a.maxDate, _b = _a.disabledDates, disabledDates = _b === void 0 ? [] : _b, onDateSelect = _a.onDateSelect, _c = _a.mode, mode = _c === void 0 ? 'default' : _c, visible = _a.visible, onClose = _a.onClose, _d = _a.label, label = _d === void 0 ? 'Select Date' : _d, _e = _a.dateFormat, dateFormat = _e === void 0 ? 'MMM d, yyyy' : _e;
    var colors = useTheme().colors;
    var styles = makeStyles(colors);
    var today = startOfToday();
    var _f = useState(initialDate ? parseISO(initialDate) : today), parsedInitialDate = _f[0], setParsedInitialDate = _f[1];
    useEffect(function () {
        setParsedInitialDate(initialDate ? parseISO(initialDate) : startOfToday());
    }, [initialDate]);
    // Modal visibility handling
    var _g = useState(false), internalVisible = _g[0], setInternalVisible = _g[1];
    var modalVisible = mode === 'modal' ? visible : internalVisible;
    // Confirmed selected date
    var _h = useState(parsedInitialDate.getFullYear()), selectedYear = _h[0], setSelectedYear = _h[1];
    var _j = useState(parsedInitialDate.getMonth()), selectedMonth = _j[0], setSelectedMonth = _j[1];
    var _k = useState(parsedInitialDate.getDate()), selectedDay = _k[0], setSelectedDay = _k[1];
    // Temporary state for pickers (not committed until confirm)
    var _l = useState(selectedYear), tempYear = _l[0], setTempYear = _l[1];
    var _m = useState(selectedMonth), tempMonth = _m[0], setTempMonth = _m[1];
    var _o = useState(selectedDay), tempDay = _o[0], setTempDay = _o[1];
    var startYear = 1900;
    var endYear = maxDate
        ? parseISO(maxDate).getFullYear()
        : today.getFullYear() + 10;
    var years = Array.from({ length: endYear - startYear + 1 }, function (_, i) { return startYear + i; });
    var months = Array.from({ length: 12 }, function (_, i) {
        return format(new Date(today.getFullYear(), i, 1), 'MMM');
    });
    var daysInMonth = getDaysInMonth(new Date(tempYear, tempMonth));
    var days = Array.from({ length: daysInMonth }, function (_, i) {
        var dayDate = new Date(tempYear, tempMonth, i + 1);
        return {
            value: i + 1,
            label: "".concat(i + 1, " ").concat(format(dayDate, 'EEE')),
        };
    });
    var isDateDisabled = useCallback(function (year, month, day) {
        var dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
        var dateObj = new Date(year, month, day);
        if (minDate && isBefore(dateObj, parseISO(minDate))) {
            return true;
        }
        if (maxDate && isAfter(dateObj, parseISO(maxDate))) {
            return true;
        }
        return disabledDates.includes(dateStr);
    }, [minDate, maxDate, disabledDates]);
    useEffect(function () {
        if (isDateDisabled(tempYear, tempMonth, tempDay)) {
            setTempDay(1);
        }
    }, [tempYear, tempMonth, isDateDisabled, tempDay]);
    var confirmDate = function () {
        setSelectedYear(tempYear);
        setSelectedMonth(tempMonth);
        setSelectedDay(tempDay);
        var formattedDate = format(new Date(tempYear, tempMonth, tempDay), 'yyyy-MM-dd');
        if (!isDateDisabled(tempYear, tempMonth, tempDay)) {
            onDateSelect(formattedDate);
        }
        closeModal();
    };
    var closeModal = function () {
        if (mode === 'modal' && onClose) {
            onClose();
        }
        else {
            setInternalVisible(false);
        }
    };
    return (<View style={styles.container}>
      {mode === 'default' && (<View style={styles.dateButton}>
          <Text style={styles.labelText}>{label}</Text>
          <Pressable onPress={function () { return setInternalVisible(true); }}>
            <Text style={styles.dateText}>
              {format(new Date(selectedYear, selectedMonth, selectedDay), dateFormat)}
            </Text>
          </Pressable>
        </View>)}

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity activeOpacity={1} onPress={function (e) { return e.stopPropagation(); }} style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Picker selectedValue={tempDay} onValueChange={setTempDay} style={styles.picker} itemStyle={styles.pickerItemStyle}>
                {days.map(function (day) { return (<Picker.Item key={day.value} label={day.label} value={day.value}/>); })}
              </Picker>

              <Picker selectedValue={tempMonth} onValueChange={setTempMonth} style={styles.picker} itemStyle={styles.pickerItemStyle}>
                {months.map(function (month, index) { return (<Picker.Item key={index} label={month} value={index}/>); })}
              </Picker>

              <Picker selectedValue={tempYear} onValueChange={setTempYear} style={styles.picker} itemStyle={styles.pickerItemStyle}>
                {years.map(function (year) { return (<Picker.Item key={year} label={year.toString()} value={year}/>); })}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="text" textColor={colors.error} onPress={closeModal}>
                {'Cancel'}
              </Button>
              <Button mode="text" textColor={colors.primary} onPress={confirmDate}>
                {'Confirm'}
              </Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>);
};
var makeStyles = function (colors) {
    return StyleSheet.create({
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
};
export default DatePicker;
