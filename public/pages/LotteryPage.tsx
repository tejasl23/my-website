import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { THEME } from '../theme';

ReactModal.setAppElement('#root');

interface Contestant {
  name: string;
  percent: number;
  color: string;
}

export const LotteryPage = () => {
  const initialContestants: Contestant[] = [
    { name: 'Grosgab', percent: 17.3, color: THEME.palette.wheel.main },
    { name: 'Vikaddy', percent: 13.2, color: THEME.palette.wheel.secondary },
    { name: 'Tac', percent: 12.7, color: THEME.palette.wheel.tertiary },
    { name: 'Prote', percent: 12.2, color: THEME.palette.wheel.quaternary },
    { name: 'Sugasnos', percent: 10.7, color: THEME.palette.wheel.quinary },
    { name: 'Roosh', percent: 9.1, color: THEME.palette.wheel.senary },
    { name: 'Pratek', percent: 7.6, color: THEME.palette.wheel.septenary },
    { name: 'Djez', percent: 6.1, color: THEME.palette.wheel.octonary },
    { name: 'Moon', percent: 4.6, color: THEME.palette.wheel.nonary },
    { name: 'Aster', percent: 3.0, color: THEME.palette.wheel.denary },
    { name: 'Coos', percent: 2.0, color: THEME.palette.wheel.undenary },
    { name: 'Boonx', percent: 1.5, color: THEME.palette.wheel.duodenary },
  ];

  const [contestants, setContestants] = useState<Contestant[]>(initialContestants);
  const [winner, setWinner] = useState<{ name: string, color: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [remainingSpins, setRemainingSpins] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winners, setWinners] = useState<{ name: string, color: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startAngle = 0;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-radius, -radius);

    contestants.forEach((contestant) => {
      const sliceAngle = (contestant.percent / 100) * 2 * Math.PI;

      ctx.fillStyle = contestant.color;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

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

    const duration = 10000 + Math.random() * 5000; // 10–20 sec
    const startTime = performance.now();
    const startRotation = rotation;
    const spinSpeed = 360 * 2;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setRotation(startRotation + easedProgress * spinSpeed * (duration / 1000));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pointerY = 35;
        const pointerX = canvas.width / 2;
        const pixel = ctx.getImageData(pointerX, pointerY, 1, 1).data;
        const color = getHexColor([pixel[0], pixel[1], pixel[2]]);

        const selectedWinner = contestants.find(c => c.color.toLowerCase() === color.toLowerCase());

        if (selectedWinner) {
          setWinner({ name: selectedWinner.name, color: selectedWinner.color });
          setWinners(prev => [...prev, { name: selectedWinner!.name, color: selectedWinner!.color }]);
          setIsSpinning(false);
          setRemainingSpins(prev => prev - 1);
          setIsModalOpen(true);
        } else {
          // Fallback for edge cases where the color is not found
          const finalRotation = (startRotation + spinSpeed * (duration / 1000));
          const pointerAngle = (finalRotation + 270) % 360;
          let accumulatedAngle = 0;
          let fallbackWinner: Contestant | null = null;
          for (const contestant of contestants) {
            const segmentAngle = (contestant.percent / 100) * 360;
            const endAngle = accumulatedAngle + segmentAngle;
            if (pointerAngle >= accumulatedAngle && pointerAngle < endAngle) {
              fallbackWinner = contestant;
              break;
            }
            accumulatedAngle = endAngle;
          }
          if (fallbackWinner) {
            setWinner({ name: fallbackWinner.name, color: fallbackWinner.color });
            setWinners(prev => [...prev, { name: fallbackWinner!.name, color: fallbackWinner!.color }]);
            setIsSpinning(false);
            setRemainingSpins(prev => prev - 1);
            setIsModalOpen(true);
          }
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const removeContestant = (name: string) => {
    const newContestants = contestants.filter(c => c.name !== name);
    const totalPercent = newContestants.reduce((acc, c) => acc + c.percent, 0);
    const updatedContestants = newContestants.map(c => ({
      ...c,
      percent: (c.percent / totalPercent) * 100,
    }));
    setContestants(updatedContestants);
  };

  const resetWheel = () => {
    setContestants(initialContestants);
    setWinner(null);
    setRotation(0);
    setRemainingSpins(12);
    setWinners([]);
  };

  const getHexColor = (rgb: number[]) => {
    return '#' + rgb.map(c => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  return (
    <PageContainer>
      <ResetButtonContainer>
        <ResetButton onClick={resetWheel}>Reset Draft</ResetButton>
      </ResetButtonContainer>
      <Header>Welcome to the 2025 Fantasy Draft</Header>
      <DraftContainer>
    <FlexRow>
        <ContestantList>
            <h3>Remaining Contestants:</h3>
            <ul>
                {contestants.map(contestant => (
                    <ContestantItem key={contestant.name}>
                        {contestant.name} – {contestant.percent.toFixed(1)}% chance
                    </ContestantItem>
                ))}
            </ul>
        </ContestantList>
        <WheelWrapper>
            <WheelContainer>
                <canvas ref={canvasRef} width="400" height="400" style={{ width: '100%', height: '100%' }} />
                <SpinPointer />
            </WheelContainer>
            <Controls>
                <div style={{ height: '60px' }} />
                <SpinButton onClick={spinWheel} disabled={isSpinning || remainingSpins <= 0}>
                    {remainingSpins <= 0 ? 'Draft Complete!' : 'Spin Wheel'}
                </SpinButton>
                <RemainingSpins>Spins remaining: {remainingSpins}</RemainingSpins>
            </Controls>
        </WheelWrapper>
        <WinnersTable>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {winners.length > 0 ? (
                    winners.map((w, i) => (
                        <WinnerRow key={i} $color={w.color}>
                            <td>{i + 1}</td>
                            <td>{w.name}</td>
                        </WinnerRow>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2}>No winners yet!</td>
                    </tr>
                )}
            </tbody>
        </WinnersTable>
    </FlexRow>
</DraftContainer>
<ReactModal
    isOpen={isModalOpen}
    onRequestClose={() => {
        setIsModalOpen(false);
        if (winner) {
            removeContestant(winner.name);
        }
    }}
    style={ModalStyles}
    contentLabel="Winner Modal"
>
    <h2>The Winner Is...</h2>
    <WinnerName $color={winner?.color}>{winner?.name}</WinnerName>
    <ModalCloseButton onClick={() => {
        setIsModalOpen(false);
        if (winner) {
            removeContestant(winner.name);
        }
    }}>Close</ModalCloseButton>
</ReactModal>
</PageContainer>
);
};

const PageContainer = styled.div`
  background-color: ${THEME.palette.sleeper.main};
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 2rem;
  min-height: 100vh;
  position: relative;
`;

const ResetButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const Header = styled.h1`
  color: ${THEME.palette.sleeper.tertiary};
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

// const DraftContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: flex-start;
//   gap: 2rem;
//   margin-bottom: 2rem;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: center;
//   }
// `;

const DraftContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;


const WheelContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 1 / 1;
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
  background-color: ${THEME.palette.sleeper.quaternary};
  color: ${THEME.palette.common.black};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: ${THEME.palette.sleeper.tertiary};
  }

  &:disabled {
    background-color: ${THEME.palette.button.tertiary};
    cursor: not-allowed;
  }
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background-color: ${THEME.palette.button.primary};
  color: ${THEME.palette.common.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${THEME.palette.sleeper.tertiary};
  }
`;

const RemainingSpins = styled.div`
  font-size: 1.1rem;
  color: ${THEME.palette.sleeper.tertiary};
`;

const WinnerName = styled.div<{ $color?: string }>`
  font-size: 2rem;
  color: ${props => props.$color || THEME.palette.button.primary};
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ContestantList = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  background-color: ${THEME.palette.sleeper.secondary};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: ${THEME.palette.sleeper.tertiary};

  @media (max-width: 768px) {
    width: 100%;
  }
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
    backgroundColor: THEME.palette.sleeper.secondary,
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center' as 'center',
    color: THEME.palette.sleeper.tertiary
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const ModalCloseButton = styled.button`
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: ${THEME.palette.sleeper.quaternary};
  color: ${THEME.palette.common.black};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${THEME.palette.sleeper.tertiary};
  }
`;

const WinnersTable = styled.table`
  flex: 1;
  max-width: 400px;
  margin-top: 2rem;
  border-collapse: collapse;

  th, td {
    border: 1px solid ${THEME.palette.sleeper.tertiary};
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: ${THEME.palette.sleeper.secondary};
    color: ${THEME.palette.sleeper.tertiary};
  }
`;

const WinnerRow = styled.tr<{ $color: string }>`
  background-color: ${props => props.$color};
  color: ${THEME.palette.sleeper.tertiary};
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const WheelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
`;


export default LotteryPage;