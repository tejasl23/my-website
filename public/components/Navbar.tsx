import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTE_PATH_FANTASY_PAGE, ROUTE_PATH_RESUME_PAGE } from '../pages/routes.constants';

export const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: (theme) => theme.palette.navbar.main }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Tejas' Website
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to={`/${ROUTE_PATH_FANTASY_PAGE}`}>
                    Fantasy
                </Button>
                <Button color="inherit" component={Link} to={`/${ROUTE_PATH_RESUME_PAGE}`}>
                    Resume
                </Button>
            </Toolbar>
        </AppBar>
    );
};
