import React, { useState } from 'react';
import Bracket from './components/Bracket';
import PlayerList from './components/PlayerList';
import './App.css';

const App = () => {
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({ numVDV: '', unitName: '', names: [] });
  const [currentNames, setCurrentNames] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [matchScores, setMatchScores] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUnit((prevUnit) => ({ ...prevUnit, [name]: value }));
  };

  const handleNameChange = (index, value) => {
    const newNames = [...currentNames];
    newNames[index] = value;
    setCurrentNames(newNames);
  };

  const handleNext = () => {
    if (currentUnit.numVDV && currentUnit.unitName) {
      setUnits((prevUnits) => [...prevUnits, { ...currentUnit, names: currentNames }]);
      setCurrentUnit({ numVDV: '', unitName: '', names: [] });
      setCurrentNames([]);
    }
  };

  const handleRandom = () => {
    let allPlayers = units.flatMap((unit) => unit.names.map((name) => ({ name, unit: unit.unitName })));
    allPlayers = shuffleArray(allPlayers);

    const newBracket = [];
    let lastUnit = null;
    let i = 0;
    while (i < allPlayers.length - 1) {
      if (
        allPlayers[i] &&
        allPlayers[i + 1] &&
        allPlayers[i].unit !== allPlayers[i + 1].unit &&
        allPlayers[i].unit !== lastUnit &&
        allPlayers[i + 1].unit !== lastUnit
      ) {
        newBracket.push({
          player1: allPlayers[i],
          player2: allPlayers[i + 1],
        });
        lastUnit = allPlayers[i + 1].unit;
        i += 2;
      } else {
        allPlayers.push(allPlayers.splice(i, 1)[0]);
        if (i > 0) {
          i--;
        }
      }
    }

    setBracket(newBracket);
    setMatchScores(Array(newBracket.length).fill({ 0: '', 1: '' }));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateBracket = (players) => {
    // Hàm này có vẻ không được sử dụng, bạn có thể xem xét xóa hoặc sửa đổi
  };

  const handleScoreChange = (matchIndex, playerIndex, score) => {
    setMatchScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[matchIndex] = { ...newScores[matchIndex], [playerIndex]: score };
      return newScores;
    });
  };

  const handleUpdateBracket = () => {
    const newBracket = [];
    const remainingPlayers = [];
    const playerStatuses = {};

    bracket.forEach((match, matchIndex) => {
      const score1 = parseInt(matchScores[matchIndex]?.[0] || 0, 10);
      const score2 = parseInt(matchScores[matchIndex]?.[1] || 0, 10);

      if (match.player1) {
        playerStatuses[match.player1.name] = score1 > score2
          ? 'Vòng tiếp theo'
          : score2 > score1
          ? 'Out'
          : 'Hòa';
        if (score1 > score2) {
          remainingPlayers.push(match.player1);
        }
      }

      if (match.player2) {
        playerStatuses[match.player2.name] = score2 > score1
          ? 'Vòng tiếp theo'
          : score1 > score2
          ? 'Out'
          : 'Hòa';
        if (score2 > score1) {
          remainingPlayers.push(match.player2);
        }
      }
    });

    const generateNextRound = (players) => {
      const roundMatches = [];
      for (let i = 0; i < players.length; i += 2) {
        roundMatches.push({
          player1: players[i],
          player2: players[i + 1] || null, 
        });
      }
      return roundMatches;
    };

    const roundLabels = ['Tứ kết', 'Bán kết', 'Chung kết'];
    let currentRoundPlayers = remainingPlayers;
    let roundIndex = 0;

    // Tạo vòng đấu mới cho đến khi không đủ người chơi hoặc hết vòng
    while (currentRoundPlayers.length >= 2 && roundIndex < roundLabels.length) {
      const roundMatches = generateNextRound(currentRoundPlayers);
      newBracket.push(...roundMatches);

      // Chọn người chơi đầu tiên của mỗi cặp cho vòng tiếp theo
      currentRoundPlayers = roundMatches.map((match) => match.player1);

      roundIndex++;
    }

    setBracket(newBracket);
    setMatchScores(Array(newBracket.length).fill({ 0: '', 1: '' }));

    setUnits((prevUnits) => {
      return prevUnits.map((unit) => {
        return {
          ...unit,
          names: unit.names.map((name) => ({
            name,
            status: playerStatuses[name] || '',
          })),
        };
      });
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Bốc Thăm Giải Cầu Lông</h1>

      {/* Nhập thông tin VĐV */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Số lượng VĐV</label>
        <input
          type="number"
          name="numVDV"
          value={currentUnit.numVDV}
          onChange={handleInputChange}
          className="input input-bordered w-full max-w-xs"
          min="1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium">Đơn vị</label>
        <input
          type="text"
          name="unitName"
          value={currentUnit.unitName}
          onChange={handleInputChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      {currentUnit.numVDV > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Tên VĐV</h3>
          {Array.from({ length: parseInt(currentUnit.numVDV) }).map((_, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder={`VĐV ${index + 1}`}
                value={currentNames[index] || ''}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex space-x-4 mb-4">
        <button onClick={handleNext} className="btn btn-primary">
          Tiếp theo
        </button>
        <button onClick={handleRandom} className="btn btn-secondary">
          Random
        </button>
      </div>

      {/* Hiển thị bracket đấu */}
      <Bracket
        bracket={bracket}
        matchScores={matchScores}
        handleScoreChange={handleScoreChange}
      />

      {/* Nút cập nhật vòng đấu */}
      {bracket && (
        <button onClick={handleUpdateBracket} className="btn btn-success mt-4">
          Cập nhật
        </button>
      )}

      {/* Danh sách VĐV và Đơn vị */}
      <PlayerList units={units} />
    </div>
  );
};

export default App;