/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF3B30'; // A vibrant red for light mode
const tintColorDark = '#FF453A'; // A slightly brighter red for dark mode

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#F5F5F5',
    border: '#E0E0E0',
    button: tintColorLight,
    buttonText: '#FFFFFF',
    secondaryButton: '#EFEFF4',
    secondaryButtonText: '#000000',
  },
  dark: {
    text: '#E4E6EB',
    background: '#121212',
    tint: tintColorDark,
    icon: '#B0B3B8',
    tabIconDefault: '#B0B3B8',
    tabIconSelected: tintColorDark,
    card: '#1C1C1E',
    border: '#3E4042',
    button: tintColorDark,
    buttonText: '#FFFFFF',
    secondaryButton: '#3A3B3C',
    secondaryButtonText: '#E4E6EB',
  },
};
