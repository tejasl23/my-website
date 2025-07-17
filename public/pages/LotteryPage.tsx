import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { THEME } from '../theme';

interface Contestant {
  name: string;
  initialWeight: number;
  currentWeight: number;
}

/**
 * Renders a fantasy draft wheel with customizable odds
 * 
 * @component
 */
export const LotteryPage = () => {
  // Define contestants with their initial weights (higher = better odds)
  const initialContestants: Contestant[] = [
    { name: 'Alex', initialWeight: 10, currentWeight: 10 },
    { name: 'Jamie', initialWeight: 8, currentWeight: 8 },
    { name: 'Taylor', initialWeight: 7, currentWeight: 7 },
    { name: 'Morgan', initialWeight: 6, currentWeight: 6 },
    { name: 'Casey', initialWeight: 5, currentWeight: 5 },
    { name: 'Riley', initialWeight: 4, currentWeight: 4 },
    { name: 'Jordan', initialWeight: 3, currentWeight: 3 },
    { name: 'Peyton', initialWeight: 3, currentWeight: 3 },
    { name: 'Quinn', initialWeight: 2, currentWeight: 2 },
    { name: 'Avery', initialWeight: 2, currentWeight: 2 },
    { name: 'Skyler', initialWeight: 1, currentWeight: 1 },
    { name: 'Dakota', initialWeight: 1, currentWeight: 1 },
  ];

  const [contestants, setContestants] = useState<Contestant[]>(initialContestants);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [remainingSpins, setRemainingSpins] = useState(12);
  const [overflowNames, setOverflowNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winners, setWinners] = useState<{ name: string, color: string }[]>([]);

  // Calculate total weight for probability distribution
  const totalWeight = contestants.reduce((sum, c) => sum + c.currentWeight, 0);

  const spinWheel = () => {
    if (isSpinning || remainingSpins <= 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Random rotation (5-10 full rotations plus the winning segment)
    const baseRotation = 360 * (5 + Math.random() * 5);
    
    // Select winner based on weights
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

    // Calculate final rotation to land on the selected segment
    let accumulatedAngle = 0;
    for (let i = 0; i < selectedIndex; i++) {
      accumulatedAngle += (contestants[i].currentWeight / totalWeight) * 360;
    }
    const segmentAngle = (contestants[selectedIndex].currentWeight / totalWeight) * 360;
    const finalRotation = baseRotation + accumulatedAngle + segmentAngle / 2;

    setRotation(finalRotation);
    
    setTimeout(() => {
      const selectedWinner = contestants[selectedIndex];
      const winnerName = selectedWinner.name;
      const colors = [
        THEME.palette.wheel.main, THEME.palette.wheel.secondary, THEME.palette.wheel.tertiary, THEME.palette.wheel.quaternary,
        THEME.palette.wheel.quinary, THEME.palette.wheel.senary, THEME.palette.wheel.septenary, THEME.palette.wheel.octonary,
        THEME.palette.wheel.nonary, THEME.palette.wheel.denary, THEME.palette.wheel.undenary, THEME.palette.wheel.duodenary
      ];
      const winnerColor = colors[selectedIndex % 12];

      setWinner(winnerName);
      setWinners(prev => [...prev, { name: winnerName, color: winnerColor }]);
      setIsSpinning(false);
      setRemainingSpins(prev => prev - 1);
      setIsModalOpen(true);
      
      // Remove winner and redistribute weights
      setContestants(prev => {
        const newContestants = prev.filter(c => c.name !== winnerName);
        const totalRemainingWeight = newContestants.reduce((sum, c) => sum + c.initialWeight, 0);
        
        // Redistribute weights proportionally
        return newContestants.map(c => ({
          ...c,
          currentWeight: c.initialWeight + (c.initialWeight / totalRemainingWeight) * selectedWinner.initialWeight
        }));
      });
    }, 12000); // Match this with CSS transition duration
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
            <Wheel
              style={{ transform: `rotate(${rotation}deg)` }}
              $isSpinning={isSpinning}
              $segmentCount={contestants.length}
            >
            {(() => {
              let accumulatedAngle = 0;
              const newOverflowNames: string[] = [];
              const segments = contestants.map((contestant, index) => {
                const percentage = contestant.currentWeight / totalWeight;
                const arc = percentage * 360;
                const startAngle = accumulatedAngle;
                accumulatedAngle += arc;

                const textFits = arc > 15; // Heuristic value, might need adjustment
                if (!textFits) {
                  newOverflowNames.push(contestant.name);
                }

                return (
                  <WheelSegment
                    key={contestant.name}
                    $startAngle={startAngle}
                    $arc={arc}
                    $colorIndex={index % 12}
                  >
                    {textFits ? (
                      <>
                        <SegmentText $arc={arc}>{contestant.name}</SegmentText>
                        <SegmentOdds $arc={arc}>{Math.round(percentage * 100)}%</SegmentOdds>
                      </>
                    ) : (
                      <Arrow>&#x2794;</Arrow>
                    )}
                  </WheelSegment>
                );
              });

              // This is a hack to avoid setState in render
              if (JSON.stringify(overflowNames) !== JSON.stringify(newOverflowNames)) {
                setTimeout(() => setOverflowNames(newOverflowNames), 0);
              }

              return segments;
            })()}
            </Wheel>
            <WheelCenter />
            <SpinPointer />
          </WheelContainer>

          <Controls>
            <SpinButton onClick={spinWheel} disabled={isSpinning || remainingSpins <= 0}>
              {remainingSpins <= 0 ? 'Draft Complete!' : 'Spin Wheel'}
            </SpinButton>
            <RemainingSpins>Spins remaining: {remainingSpins}</RemainingSpins>
            <ResetButton onClick={resetWheel}>Reset Draft</ResetButton>
          </Controls>

          {overflowNames.length > 0 && (
            <OverflowList>
              {overflowNames.map(name => (
                <OverflowItem key={name}>
                  <Arrow>&#x2794;</Arrow> {name}
                </OverflowItem>
              ))}
            </OverflowList>
          )}

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

const WheelSegment = styled.div<{ $startAngle: number; $arc: number; $colorIndex: number }>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  transform: rotate(${props => props.$startAngle}deg) skewY(${props => 90 - props.$arc}deg);
  background: ${props => {
    const colors = [
      THEME.palette.wheel.main, THEME.palette.wheel.secondary, THEME.palette.wheel.tertiary, THEME.palette.wheel.quaternary,
      THEME.palette.wheel.quinary, THEME.palette.wheel.senary, THEME.palette.wheel.septenary, THEME.palette.wheel.octonary,
      THEME.palette.wheel.nonary, THEME.palette.wheel.denary, THEME.palette.wheel.undenary, THEME.palette.wheel.duodenary
    ];
    return colors[props.$colorIndex];
  }};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const SegmentText = styled.div<{ $arc: number }>`
  transform: skewY(${props => -(90 - props.$arc)}deg) rotate(${props => props.$arc / 2}deg);
  font-weight: bold;
  color: ${THEME.palette.common.white};
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-size: 1.2rem;
`;

const SegmentOdds = styled.div<{ $arc: number }>`
  transform: skewY(${props => -(90 - props.$arc)}deg) rotate(${props => props.$arc / 2}deg);
  color: ${THEME.palette.common.white};
  font-size: 0.8rem;
  margin-top: 5px;
`;

const Arrow = styled.div`
  font-size: 2rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
`;

const OverflowList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
`;

const OverflowItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${THEME.palette.text.primary};
`;

const WheelCenter = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: ${THEME.palette.quaternary.main};
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
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