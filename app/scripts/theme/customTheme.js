import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: "#235F9C",
        primary2Color: "#003366",
        primary3Color: "#0680CD",
        accent1Color: "#235F9C",
        accent2Color: "#ED2B2B",
        accent3Color: "#F58C8C",
        textColor: "#424242",
        alternateTextColor: "#FFF",
        canvasColor: "#FFF",
        borderColor: "#E0E0E0",
        disabledColor: ColorManipulator.fade("#212121", 0.3),
        pickerHeaderColor: "#00BCD4"
    }
};