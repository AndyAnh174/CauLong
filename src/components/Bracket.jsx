import React from 'react';

const Bracket = ({ bracket, matchScores, handleScoreChange }) => {
  const roundLabels = ['Vòng 1', 'Tứ kết', 'Bán kết', 'Chung kết']; // Thêm nhãn cho Vòng 1

  return (
    <div className="bracket-container mt-6">
      {bracket && (
        <div className="bracket">
          {bracket.map((match, matchIndex) => {
            // Tính toán chỉ số vòng đấu
            const roundIndex = Math.floor(matchIndex / (bracket.length / roundLabels.length));

            return (
              <div key={matchIndex} className="match-container"> {/* Thêm container cho mỗi cặp đấu */}
                {matchIndex === roundIndex * (bracket.length / roundLabels.length) && (
                  <h3 className="round-label">{roundLabels[roundIndex]}</h3>
                )}
                <div className="match"> {/* Giữ nguyên class "match" cho cặp đấu */}
                  <div>
                    {match.player1 ? `${match.player1.name} (${match.player1.unit})` : 'TBD'}
                    {match.player1 && (
                      <input
                        type="number"
                        min="0"
                        value={matchScores[matchIndex]?.[0] || ''}
                        onChange={(e) => handleScoreChange(matchIndex, 0, e.target.value)}
                        className="w-16 ml-2"
                        style={{ color: 'white' }}
                      />
                    )}
                  </div>
                  <div>
                    {match.player2 ? `${match.player2.name} (${match.player2.unit})` : 'TBD'}
                    {match.player2 && (
                      <input
                        type="number"
                        min="0"
                        value={matchScores[matchIndex]?.[1] || ''}
                        onChange={(e) => handleScoreChange(matchIndex, 1, e.target.value)}
                        className="w-16 ml-2"
                        style={{ color: 'white' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bracket;