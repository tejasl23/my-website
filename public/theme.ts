import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Palette {
        tertiary: Palette['primary'];
        quaternary: Palette['primary'];
        wheel: {
            main: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
            quinary: string;
            senary: string;
            septenary: string;
            octonary: string;
            nonary: string;
            denary: string;
            undenary: string;
            duodenary: string;
        };
        button: {
            primary: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
            quinary: string;
        };
        border: {
            primary: string;
        };
        navbar: {
            main: string;
        };
        sleeper: {
            main: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
        };
    }
    interface PaletteOptions {
        tertiary?: PaletteOptions['primary'];
        quaternary?: PaletteOptions['primary'];
        wheel?: {
            main: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
            quinary: string;
            senary: string;
            septenary: string;
            octonary: string;
            nonary: string;
            denary: string;
            undenary: string;
            duodenary: string;
        };
        button?: {
            primary: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
            quinary: string;
        };
        border?: {
            primary: string;
        };
        navbar?: {
            main: string;
        };
        sleeper: {
            main: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
        };
    }
}

/**
 * The main theme of the app.
 *
 * This theme can be customized - visit MUI's documentation for help.
 *
 * @constant
 */
export const THEME = createTheme({
    palette: {
        background: {
            default: '#FFF',
            paper: '#FAFAFA',
        },
        common: {
            black: '#333',
            white: '#FFF',
        },
        primary: {
            main: '#f0f4f8',
        },
        secondary: {
            main: '#666',
        },
        tertiary: {
            main: '#f0f0f0',
        },
        quaternary: {
            main: '#2c3e50',
        },
        wheel: {
            main: '#FF5733',
            secondary: '#33FF57',
            tertiary: '#3357FF',
            quaternary: '#FF33A1',
            quinary: '#A133FF',
            senary: '#33FFA1',
            septenary: '#FF7F50',
            octonary: '#6A5ACD',
            nonary: '#20B2AA',
            denary: '#FF4500',
            undenary: '#D2691E',
            duodenary: '#DC143C',
        },
        button: {
            primary: '#e74c3c',
            secondary: '#2ecc71',
            tertiary: '#95a5a6',
            quaternary: '#c0392b',
            quinary: '#27ae60',
        },
        text: {
            primary: '#7f8c8d',
            secondary: '#f8f9fa',
        },
        border: {
            primary: '#eee',
        },
        navbar: {
            main: '#CDD0E0',
        },
        sleeper: {
            main: '#121428',
            secondary: '#1A1D3A',
            tertiary: '#E5E9F2',
            quaternary: '#00F0FF',
        }
    },
});
