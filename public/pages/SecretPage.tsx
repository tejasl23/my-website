/**
 * Renders the home page.
 *
 * @component
 */
export const SecretPage = () => {
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
            <h1 style={{ color: '#333', fontSize: '3rem' }}>Secret Page</h1>
            <p style={{ color: '#666', fontSize: '1.25rem' }}>Shhhhhh</p>
        </div>
    );
};
