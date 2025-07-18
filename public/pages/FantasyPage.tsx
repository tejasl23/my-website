import React, { useEffect, useState } from 'react';
import { THEME } from '../theme';
import { Button } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH_FANTASY_PAGE } from './routes.constants';

/**
 * Renders the Fantasy Football countdown page.
 * 
 * @component
 */
export const FantasyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        // Set the target date (July 18, 2025 at 9:00 PM EST)
        const targetDate = new Date('2025-07-18T21:00:00-05:00');
        
        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference <= 0) {
                // Countdown is over
                setTimeLeft({
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                });
                return;
            }
            
            // Calculate time units
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            // Update the state
            setTimeLeft({
                days: days.toString().padStart(2, '0'),
                hours: hours.toString().padStart(2, '0'),
                minutes: minutes.toString().padStart(2, '0'),
                seconds: seconds.toString().padStart(2, '0')
            });
        };
        
        // Update immediately and set interval
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            {location.pathname === `/${ROUTE_PATH_FANTASY_PAGE}` && (
                <div style={{
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    margin: 0,
                    backgroundColor: THEME.palette.sleeper.main
                }}>
                    <div style={{
                        textAlign: 'center',
                        backgroundColor: THEME.palette.sleeper.secondary,
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '2rem',
                            color: THEME.palette.sleeper.tertiary
                        }}>Fantasy Football Lottery</div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem'
                        }}>
                            <div style={{
                                backgroundColor: THEME.palette.sleeper.main,
                                color: THEME.palette.sleeper.tertiary,
                                padding: '2rem',
                                borderRadius: '10px',
                                minWidth: '150px'
                            }}>
                                <div style={{
                                    fontSize: '5rem',
                                    fontWeight: 'bold'
                                }}>{timeLeft.days}</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    textTransform: 'uppercase',
                                    opacity: 0.8
                                }}>Days</div>
                            </div>
                            <div style={{
                                backgroundColor: THEME.palette.sleeper.main,
                                color: THEME.palette.sleeper.tertiary,
                                padding: '2rem',
                                borderRadius: '10px',
                                minWidth: '150px'
                            }}>
                                <div style={{
                                    fontSize: '5rem',
                                    fontWeight: 'bold'
                                }}>{timeLeft.hours}</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    textTransform: 'uppercase',
                                    opacity: 0.8
                                }}>Hours</div>
                            </div>
                            <div style={{
                                backgroundColor: THEME.palette.sleeper.main,
                                color: THEME.palette.sleeper.tertiary,
                                padding: '2rem',
                                borderRadius: '10px',
                                minWidth: '150px'
                            }}>
                                <div style={{
                                    fontSize: '5rem',
                                    fontWeight: 'bold'
                                }}>{timeLeft.minutes}</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    textTransform: 'uppercase',
                                    opacity: 0.8
                                }}>Minutes</div>
                            </div>
                            <div style={{
                                backgroundColor: THEME.palette.sleeper.main,
                                color: THEME.palette.sleeper.tertiary,
                                padding: '2rem',
                                borderRadius: '10px',
                                minWidth: '150px'
                            }}>
                                <div style={{
                                    fontSize: '5rem',
                                    fontWeight: 'bold'
                                }}>{timeLeft.seconds}</div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    textTransform: 'uppercase',
                                    opacity: 0.8
                                }}>Seconds</div>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            onClick={() => navigate('lottery')}
                            sx={{
                                marginTop: '20px',
                                backgroundColor: THEME.palette.sleeper.quaternary,
                                color: THEME.palette.common.black,
                                '&:hover': {
                                    backgroundColor: THEME.palette.sleeper.tertiary,
                                }
                             }}
                        >
                            Go to Lottery
                        </Button>
                    </div>
                </div>
            )}
            <Outlet />
        </>
    );
};