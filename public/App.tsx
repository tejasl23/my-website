import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME } from './theme';
import { Router } from './pages/Router';

const App = () => {
    return (
        <ThemeProvider theme={THEME}>
            <CssBaseline />
            <Router />
        </ThemeProvider>
    );
};

export default App;
