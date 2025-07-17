import { THEME } from "../theme";

/**
 * Renders the secret page.
 *
 * @component
 */
export const SecretPage = () => {
    return (
        <div
            style={{
                backgroundColor: THEME.palette.primary.main,
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                paddingTop: '100px',
                minHeight: '100vh',
            }}
        >
            <h1 style={{ color: THEME.palette.common.black, fontSize: '3rem' }}>Secret Page</h1>
            <p style={{ color: THEME.palette.secondary.main, fontSize: '1.25rem' }}>Shhhhhh</p>
        </div>
    );
};
