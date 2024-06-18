import React from 'react';

const PlayerList = ({ units }) => {
  return (
    <div className="unit-list mt-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách VĐV và Đơn vị</h2>
      {units.map((unit, unitIndex) => (
        <div key={unitIndex} className="unit mb-4">
          <h3 className="text-xl font-medium">{unit.unitName}</h3>
          <ul>
            {unit.names.map((player, nameIndex) => (
              <li key={nameIndex} className="text-lg">
                {player.name} ({player.status || ''})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;