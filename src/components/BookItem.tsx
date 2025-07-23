import React from 'react';
import { FaStar } from 'react-icons/fa';

type BookItemProps = {
  title: string;
  cover: string;
  rating: number;
  inProgress?: boolean;
  onClick: () => void;
};

const BookItem: React.FC<BookItemProps> = ({ title, cover, rating, inProgress, onClick }) => (
  <div className="flex flex-col items-center w-32 mx-2 relative">
    <button
      onClick={onClick}
      className="focus:outline-none"
      aria-label={`Open review for ${title}`}
    >
      <img
        src={cover}
        alt={title}
        className="w-28 h-40 object-cover rounded shadow border border-neutral-200"
      />
      {inProgress && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded shadow">
          In Progress
        </span>
      )}
    </button>
    <div className="mt-2 text-center">
      <div className="font-medium text-sm break-words whitespace-normal" title={title}>{title}</div>
      <div className="flex justify-center mt-1">
        {[1,2,3,4,5].map((i) => (
          <FaStar
            key={i}
            className={
              i <= rating ? 'text-yellow-400' : 'text-neutral-200'
            }
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  </div>
);

export default BookItem;
