import React, { useState } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#1A97F5');

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-3xl">Color Picker</p>
          <p className="text-gray-400">Select colors</p>
        </div>
      </div>
      <div className="mt-10 flex items-center space-x-6">
        <div style={{ backgroundColor: color }} className="w-24 h-24 rounded-lg shadow-md"></div>
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-12 w-12 cursor-pointer"
        />
        <div className="text-xl font-semibold">{color}</div>
      </div>
    </div>
  );
};

export default ColorPicker; 