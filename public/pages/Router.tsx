import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTE_PATH_SECRET_PAGE, ROUTE_PATH_FANTASY_PAGE, ROUTE_PATH_RESUME_PAGE, ROUTE_PATH_LOTTERY_PAGE } from './routes.constants';
import { HomePage } from './HomePage';
import { SecretPage } from './SecretPage';
import { FantasyPage } from './FantasyPage';
import { ResumePage } from './ResumePage';
import { LotteryPage } from './LotteryPage';
import { Layout } from '../components/Layout';

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
                <Route element={<Layout />}>
                    {/* If the path is empty, use the home page */}
                    <Route index element={<HomePage />} />

                    <Route path={ROUTE_PATH_FANTASY_PAGE} element={<FantasyPage />} />
                    <Route path={ROUTE_PATH_RESUME_PAGE} element={<ResumePage />} />
                    <Route path={ROUTE_PATH_LOTTERY_PAGE} element={<LotteryPage />} />
                </Route>

                <Route path={ROUTE_PATH_SECRET_PAGE} element={<SecretPage />} />


                {/* Any other urls should be sent to the home page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};
