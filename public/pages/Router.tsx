import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { ROUTE_PATH_SECRET_PAGE } from './routes.constants';
import { HomePage } from './HomePage';
import { SecretPage } from './SecretPage';
/**
 * Renders pages based on url.
 *
 * @component
 */
export const Router = () => {
    return (
        // Semoss projects typically use HashRouters
        <HashRouter>
            <Routes>
                {/* If the path is empty, use the home page */}
                <Route index element={<HomePage />} />

                <Route path={ROUTE_PATH_SECRET_PAGE} element={<SecretPage />} />

                {/* Any other urls should be sent to the home page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};
