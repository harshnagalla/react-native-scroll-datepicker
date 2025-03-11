# 📆 react-native-scroll-datepicker

A modern, performant scrollable date picker for React Native applications with an intuitive wheel-style interface. Perfect for mobile apps requiring date selection with a native feel.

[![npm version](https://img.shields.io/npm/v/react-native-scroll-datepicker.svg)](https://www.npmjs.com/package/react-native-scroll-datepicker)
[![license](https://img.shields.io/github/license/yourusername/react-native-scroll-datepicker.svg)](LICENSE)

<p align="center">
  <img src="https://via.placeholder.com/300x200?text=DatePicker+Screenshot" alt="React Native Scroll DatePicker" />
</p>

## ✨ Features

- 🔄 Natural wheel-style scrolling date selection
- 🔒 Date range restrictions (min/max dates)
- ⛔ Disable specific dates for selection
- 🎨 Theme-aware with full style customization
- 🌐 Internationalization support via `date-fns`
- 📱 Multiple display modes (inline/modal)
- ⚡ Optimized performance

## 📦 Installation

```bash
# Using npm
npm install react-native-scroll-datepicker

# Using yarn
yarn add react-native-scroll-datepicker

# Using pnpm
pnpm add react-native-scroll-datepicker
```

### Dependencies

This package requires the following dependencies:

```bash
npm install @react-native-picker/picker date-fns react-native-paper
```

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DatePicker from 'react-native-scroll-datepicker';

const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState('2025-03-11');

  return (
    <View style={{ padding: 20 }}>
      <Text>Selected Date: {selectedDate}</Text>
      
      <DatePicker
        mode="default"
        initialDate={selectedDate}
        minDate="2024-01-01"
        maxDate="2026-12-31"
        disabledDates={['2025-03-15', '2025-03-20']}
        onDateSelect={setSelectedDate}
      />
    </View>
  );
};

export default MyComponent;
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `string` | `'default'` | Display mode: `'default'` (inline) or `'modal'` |
| `initialDate` | `string` | Current date | The initial date (format: `'YYYY-MM-DD'`) |
| `minDate` | `string` | - | Minimum selectable date (format: `'YYYY-MM-DD'`) |
| `maxDate` | `string` | - | Maximum selectable date (format: `'YYYY-MM-DD'`) |
| `disabledDates` | `string[]` | `[]` | Array of specific dates to disable (format: `'YYYY-MM-DD'`) |
| `onDateSelect` | `function` | - | Callback function when date is selected or changed |
| `theme` | `object` | - | Custom theme object (React Native Paper compatible) |
| `style` | `object` | - | Additional styles for the container |

## 🎨 Styling

The component uses React Native Paper's theming system. You can customize the appearance by:

```jsx
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    surface: '#FFFFFF',
    // Add more colors as needed
  },
};

// In your app
<PaperProvider theme={theme}>
  <App />
</PaperProvider>
```

## 🌐 Localization

The component uses `date-fns` for date formatting and can be localized:

```jsx
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

// In your component
const locale = fr; // Or any other locale

<DatePicker
  // ...other props
  formatOptions={{ locale }}
/>
```

## 📱 Display Modes

### Default (Inline) Mode

```jsx
<DatePicker
  mode="default"
  initialDate="2025-03-11"
  onDateSelect={setSelectedDate}
/>
```

### Modal Mode

```jsx
<DatePicker
  mode="modal"
  initialDate="2025-03-11"
  onDateSelect={setSelectedDate}
/>
```

## 🧩 Advanced Usage

### Custom Day Rendering

```jsx
<DatePicker
  initialDate="2025-03-11"
  onDateSelect={setSelectedDate}
  renderDay={(day, month, year, isSelected, isDisabled) => (
    <View style={[isSelected && styles.selectedDay, isDisabled && styles.disabledDay]}>
      <Text>{day}</Text>
    </View>
  )}
/>
```

### With Custom Button Trigger (Modal Mode)

```jsx
<DatePicker
  mode="modal"
  initialDate="2025-03-11"
  onDateSelect={setSelectedDate}
  renderTrigger={(openModal) => (
    <Button onPress={openModal} title="Select Date" />
  )}
/>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [React Native](https://reactnative.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [date-fns](https://date-fns.org/)
- [@react-native-picker/picker](https://github.com/react-native-picker/picker)