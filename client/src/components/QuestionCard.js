import React from 'react';

const QuestionCard = ({ question, options, selected, onSelect, onMarkReview, marked }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name="option"
              value={option}
              checked={selected === option}
              onChange={() => onSelect(option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={onMarkReview}
          className={`px-4 py-2 rounded ${marked ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}
        >
          {marked ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;