import { createTheme } from '@mui/material/styles';
import {grey} from '@mui/material/colors';

export const Colors = {
    primaryText: grey[800],
    backgroundGray: '#F3F3F3'
};

export const buildTheme = (overrides?: Record<string, string>) => {
    return createTheme({
        typography: {
            allVariants: {
                color: Colors.primaryText,
                fontFamily: "-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans'"
            },
        },
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: '6px',
                        paddingRight: '6px'
                    }
                }
            },
        },
        palette: {
            text: {
                primary: Colors.primaryText
            }
        },
        // overrides: {
        //     MuiContainer: {
        //         root: {
        //             backgroundColor: overrides.backgroundColor,
        //             paddingTop: '5px',
        //             paddingBottom: '6px'
        //         }
        //     },
        //     MuiButton: {
        //         root: {
        //             color: overrides.textColor
        //         }
        //     },
        //     MuiCard: {
        //         root: {
        //             backgroundColor: overrides.backgroundColor,
        //             border: 'none',
        //             boxShadow: 'none',
        //             color: overrides.textColor
        //         }
        //     },
        //     MuiCardContent: {
        //         root: {
        //             padding: '4px 0 4px 0',
        //             '&:last-child': {
        //                 paddingBottom: '4px'
        //             }
        //         }
        //     },
        //     MuiList: {
        //         root: {
        //             color: overrides.textColor
        //         }
        //     },
        //     MuiInputBase: {
        //         root: {
        //             color: overrides.textColor
        //         }
        //     },
        //     MuiDivider: {
        //         root: {
        //             marginTop: '10px',
        //             marginBottom: '10px'
        //         }
        //     }
        // }
    });
};
