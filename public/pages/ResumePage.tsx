import { THEME } from "../theme";

/**
 * Renders the resume page.
 *
 * @component
 */
export const ResumePage = () => {
    return (
        <div
            style={{
                backgroundColor: '#f0f4f8',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                paddingTop: '100px',
                minHeight: '100vh',
            }}
        >
            <h1 style={{ color: THEME.palette.common.black, fontSize: '3rem' }}>
                Welcome to Tejas' Website
            </h1>
            <p style={{ color: THEME.palette.secondary.main, fontSize: '1.25rem' }}>
                Insert Resume
            </p>
        </div>
    );
};
