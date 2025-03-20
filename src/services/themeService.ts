import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const Colors = {
    primaryText: grey[800],
    backgroundGray: '#F3F3F3',
    white: '#FFFFFF'
};

export const buildTheme = (_overrides?: Record<string, string>) => {
    return createTheme({
        typography: {
            allVariants: {
                color: Colors.primaryText,
                fontFamily: "-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans'"
            }
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
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '6px'
                    }
                },
                defaultProps: {
                    elevation: 2
                }
            },
            MuiCardContent: {
                styleOverrides: {
                    root: {
                        '&:last-child': {
                            paddingBottom: '16px'
                        }
                    }
                }
            },
            MuiSkeleton: {
                styleOverrides: {
                    root: {
                        borderRadius: '4px'
                    }
                }
            },
        },
        palette: {
            text: {
                primary: Colors.primaryText
            }
        },
    });
};
