import React from 'react';

const Editor = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-3xl">Editor</p>
          <p className="text-gray-400">Rich Text Editor</p>
        </div>
      </div>
      <div className="mt-10">
        <textarea className="w-full h-64 p-4 border rounded-lg" placeholder="Start typing..."></textarea>
      </div>
    </div>
  );
};

export default Editor; 