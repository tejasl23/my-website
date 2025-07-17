import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { THEME } from '../theme';

ReactModal.setAppElement('#root');

interface Contestant {
  name: string;
  initialWeight: number;
  currentWeight: number;
  color: string;
}

/**
 * Renders a fantasy draft wheel with customizable odds
 * 
 * @component
 */
export const LotteryPage = () => {
  // Define contestants with their initial weights (higher = better odds)
  const initialContestants: Contestant[] = [
    { name: 'Alex', initialWeight: 10, currentWeight: 10, color: THEME.palette.wheel.main },
    { name: 'Jamie', initialWeight: 8, currentWeight: 8, color: THEME.palette.wheel.secondary },
    { name: 'Taylor', initialWeight: 7, currentWeight: 7, color: THEME.palette.wheel.tertiary },
    { name: 'Morgan', initialWeight: 6, currentWeight: 6, color: THEME.palette.wheel.quaternary },
    { name: 'Casey', initialWeight: 5, currentWeight: 5, color: THEME.palette.wheel.quinary },
    { name: 'Riley', initialWeight: 4, currentWeight: 4, color: THEME.palette.wheel.senary },
    { name: 'Jordan', initialWeight: 3, currentWeight: 3, color: THEME.palette.wheel.septenary },
    { name: 'Peyton', initialWeight: 3, currentWeight: 3, color: THEME.palette.wheel.octonary },
    { name: 'Quinn', initialWeight: 2, currentWeight: 2, color: THEME.palette.wheel.nonary },
    { name: 'Avery', initialWeight: 2, currentWeight: 2, color: THEME.palette.wheel.denary },
    { name: 'Skyler', initialWeight: 1, currentWeight: 1, color: THEME.palette.wheel.undenary },
    { name: 'Dakota', initialWeight: 1, currentWeight: 1, color: THEME.palette.wheel.duodenary },
  ];

  const [contestants, setContestants] = useState<Contestant[]>(initialContestants);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [remainingSpins, setRemainingSpins] = useState(12);
  const [overflowNames, setOverflowNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winners, setWinners] = useState<{ name: string, color: string }[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const totalWeight = contestants.reduce((sum, c) => sum + c.currentWeight, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalWeight = contestants.reduce((sum, c) => sum + c.currentWeight, 0);
    let startAngle = 0;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-radius, -radius);

    contestants.forEach((contestant, i) => {
      const sliceAngle = (contestant.currentWeight / totalWeight) * 2 * Math.PI;

      ctx.fillStyle = contestant.color;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + sliceAngle / 2);

      const text = contestant.name;
      const textFits = ctx.measureText(text).width < radius - 20;

      if (textFits) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(text, radius - 10, 0);
      } else {
        // Draw arrow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(radius - 10, 0);
        ctx.lineTo(radius - 30, -10);
        ctx.lineTo(radius - 30, 10);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      startAngle += sliceAngle;
    });

    ctx.restore();

  }, [contestants, rotation]);

  const spinWheel = () => {
    if (isSpinning || remainingSpins <= 0) return;

    setIsSpinning(true);
    setWinner(null);

    const totalWeight = contestants.reduce((sum, c) => sum + c.currentWeight, 0);
    let random = Math.random() * totalWeight;
    let accumulatedWeight = 0;
    let selectedIndex = 0;

    for (let i = 0; i < contestants.length; i++) {
      accumulatedWeight += contestants[i].currentWeight;
      if (random <= accumulatedWeight) {
        selectedIndex = i;
        break;
      }
    }

    let accumulatedAngle = 0;
    for (let i = 0; i < selectedIndex; i++) {
      accumulatedAngle += (contestants[i].currentWeight / totalWeight) * 360;
    }
    const segmentAngle = (contestants[selectedIndex].currentWeight / totalWeight) * 360;
    const targetRotation = 360 * (5 + Math.random() * 5) + (360 - (accumulatedAngle + segmentAngle / 2));

    console.log('Selected Winner:', contestants[selectedIndex].name);
    console.log('Selected Index:', selectedIndex);
    console.log('Accumulated Angle:', accumulatedAngle);
    console.log('Segment Angle:', segmentAngle);
    console.log('Target Rotation:', targetRotation);

    const duration = 12000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setRotation(easedProgress * targetRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const selectedWinner = contestants[selectedIndex];
        const winnerName = selectedWinner.name;
        const winnerColor = selectedWinner.color;

        setWinner(winnerName);
        setWinners(prev => [...prev, { name: winnerName, color: winnerColor }]);
        setIsSpinning(false);
        setRemainingSpins(prev => prev - 1);
        setIsModalOpen(true);
        
        setContestants(prev => {
          const newContestants = prev.filter(c => c.name !== winnerName);
          const totalRemainingWeight = newContestants.reduce((sum, c) => sum + c.initialWeight, 0);

          return newContestants.map(c => ({
            ...c,
            currentWeight: c.initialWeight + (c.initialWeight / totalRemainingWeight) * selectedWinner.initialWeight
          }));
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const resetWheel = () => {
    setContestants(initialContestants);
    setWinner(null);
    setRotation(0);
    setRemainingSpins(12);
    setWinners([]);
  };

  return (
    <PageContainer>
      <Header>Welcome to the 2025 Fantasy Draft</Header>
      
      <DraftContainer>
        <div>
          <WheelContainer>
            <canvas ref={canvasRef} width="400" height="400" />
            <SpinPointer />
          </WheelContainer>

          <Controls>
            <SpinButton onClick={spinWheel} disabled={isSpinning || remainingSpins <= 0}>
              {remainingSpins <= 0 ? 'Draft Complete!' : 'Spin Wheel'}
            </SpinButton>
            <RemainingSpins>Spins remaining: {remainingSpins}</RemainingSpins>
            <ResetButton onClick={resetWheel}>Reset Draft</ResetButton>
          </Controls>
        </div>

        <ContestantList>
          <h3>Remaining Contestants:</h3>
          <ul>
            {contestants.map(contestant => (
              <ContestantItem key={contestant.name}>
                {contestant.name} - {Math.round((contestant.currentWeight / totalWeight) * 100)}% chance
              </ContestantItem>
            ))}
          </ul>
        </ContestantList>
      </DraftContainer>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={ModalStyles}
        contentLabel="Winner Modal"
      >
        <h2>The Winner Is...</h2>
        <WinnerName>{winner}</WinnerName>
        <ModalCloseButton onClick={() => setIsModalOpen(false)}>Close</ModalCloseButton>
      </ReactModal>

      {winners.length > 0 && (
        <WinnersTable>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((w, i) => (
              <WinnerRow key={i} $color={w.color}>
                <td>{i + 1}</td>
                <td>{w.name}</td>
              </WinnerRow>
            ))}
          </tbody>
        </WinnersTable>
      )}
    </PageContainer>
  );
};

// Styled components
const PageContainer = styled.div`
  background-color: ${THEME.palette.primary.main};
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 2rem;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: ${THEME.palette.quaternary.main};
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const DraftContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
`;

const Wheel = styled.div<{ $isSpinning: boolean; $segmentCount: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: ${props => props.$isSpinning ? 'transform 12s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;



const SpinPointer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid ${THEME.palette.button.primary};
  z-index: 10;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const SpinButton = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: ${THEME.palette.button.secondary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: ${THEME.palette.button.quinary};
  }

  &:disabled {
    background-color: ${THEME.palette.button.tertiary};
    cursor: not-allowed;
  }
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background-color: ${THEME.palette.button.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${THEME.palette.button.quaternary};
  }
`;

const RemainingSpins = styled.div`
  font-size: 1.1rem;
  color: ${THEME.palette.text.primary};
`;

const WinnerDisplay = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${THEME.palette.text.secondary};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const WinnerName = styled.div`
  font-size: 2rem;
  color: ${THEME.palette.button.primary};
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ContestantList = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background-color: ${THEME.palette.common.white};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ContestantItem = styled.li`
  text-align: left;
  padding: 8px 0;
  border-bottom: 1px solid ${THEME.palette.border.primary};
  list-style-type: none;
  display: flex;
  justify-content: space-between;
`;

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: THEME.palette.common.white,
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center' as 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const ModalCloseButton = styled.button`
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: ${THEME.palette.button.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${THEME.palette.button.quaternary};
  }
`;

const WinnersTable = styled.table`
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;

  th, td {
    border: 1px solid ${THEME.palette.border.primary};
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: ${THEME.palette.quaternary.main};
    color: ${THEME.palette.common.white};
  }
`;

const WinnerRow = styled.tr<{ $color: string }>`
  background-color: ${props => props.$color};
  color: ${THEME.palette.common.white};
`;

export default LotteryPage;