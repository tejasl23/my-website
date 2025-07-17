import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
    const segmentAngle = 360 / contestants.length;
    const finalRotation = baseRotation + (segmentAngle * selectedIndex) + (segmentAngle / 2);

    setRotation(finalRotation);
    
    setTimeout(() => {
      const selectedWinner = contestants[selectedIndex].name;
      setWinner(selectedWinner);
      setIsSpinning(false);
      setRemainingSpins(prev => prev - 1);
      
      // Remove winner and redistribute weights
      setContestants(prev => {
        const newContestants = prev.filter(c => c.name !== selectedWinner);
        const totalRemainingWeight = newContestants.reduce((sum, c) => sum + c.initialWeight, 0);
        
        // Redistribute weights proportionally
        return newContestants.map(c => ({
          ...c,
          currentWeight: c.initialWeight + (c.initialWeight / totalRemainingWeight) * prev[selectedIndex].initialWeight
        }));
      });
    }, 5000); // Match this with CSS transition duration
  };

  const resetWheel = () => {
    setContestants(initialContestants);
    setWinner(null);
    setRotation(0);
    setRemainingSpins(12);
  };

  return (
    <PageContainer>
      <Header>Welcome to the 2025 Fantasy Draft</Header>
      
      <DraftContainer>
        <WheelContainer>
          <Wheel
            style={{ transform: `rotate(${rotation}deg)` }}
            $isSpinning={isSpinning}
            $segmentCount={contestants.length}
          >
            {contestants.map((contestant, index) => (
              <WheelSegment
                key={contestant.name}
                $index={index}
                $segmentCount={contestants.length}
                $colorIndex={index % 12}
              >
                <SegmentText>{contestant.name}</SegmentText>
                <SegmentOdds>{Math.round((contestant.currentWeight / totalWeight) * 100)}%</SegmentOdds>
              </WheelSegment>
            ))}
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

        {winner && (
          <WinnerDisplay>
            <h2>Draft Selection:</h2>
            <WinnerName>{winner}</WinnerName>
          </WinnerDisplay>
        )}
      </DraftContainer>

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
  display: flex;
  flex-direction: column;
  align-items: center;
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
  transition: ${props => props.$isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const WheelSegment = styled.div<{ $index: number; $segmentCount: number; $colorIndex: number }>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  transform: rotate(${props => (360 / props.$segmentCount) * props.$index}deg) skewY(${props => 90 - (360 / props.$segmentCount)}deg);
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

const SegmentText = styled.div`
  transform: skewY(${props => (90 - (360 / 12))}deg) rotate(${props => (360 / 12) / 2}deg);
  font-weight: bold;
  color: ${THEME.palette.common.white};
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-size: 1.2rem;
`;

const SegmentOdds = styled.div`
  transform: skewY(${props => (90 - (360 / 12))}deg) rotate(${props => (360 / 12) / 2}deg);
  color: ${THEME.palette.common.white};
  font-size: 0.8rem;
  margin-top: 5px;
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

export default LotteryPage;