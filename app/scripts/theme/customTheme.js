import * as Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

export const Theme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#235F9C',
        primary2Color: '#235F9C',
        primary3Color: '#0680CD',
        accent1Color: '#235F9C',
        accent2Color: '#ECEFF1',
        accent3Color: '#F58C8C',
        textColor: '#424242',
        alternateTextColor: '#FFF',
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        pickerHeaderColor: '#235F9C',
        shadowColor: Colors.fullBlack
    },
    textField: {
        floatingLabelColor: Colors.grey400,
    },
};

export const Color = {
    blue:  '#235F9C',
    dkBlue: '#303F9F',
    ltBlue: '#0680CD',
    ltBlue2: '#69A3DD',
    pink: '#EC407A',
    ltPink: '#F58C8C',
    green: '#66BB6A',
    ltGreen: '#C8E6C9',
    ltGreen2: '#A5D6A7',
    red: '#F44336',
    ltRed: '#EF5350',
    ltGrey: '#BDBDBD',
    ltGrey2: '#E0E0E0',
    ltGrey3: '#F5F5F5',
    dkGrey: '#757575',
    dkGrey2: '#616161',
    white: '#FFF',
};

export const WindowBreak = {
    sm: 680,
    md: 840,
    tablet: 720,
};
