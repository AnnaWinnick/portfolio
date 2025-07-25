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
  <div className="flex flex-col items-center mx-2 relative h-64">
    {/* inProgress pill above the image, absolutely positioned */}
    {inProgress && (
      <span className="absolute left-1/2 -translate-x-1/2 z-20 px-2 py-1 bg-accentBlue text-[8px] font-bold rounded-button shadow whitespace-nowrap">
        Reading now!
      </span>
    )}
    <button
      onClick={onClick}
      className="focus:outline-none z-10 mt-4"
      aria-label={`Open review for ${title}`}
      style={{ background: 'transparent' }}
    >
      <img
        src={cover}
        alt={title}
        className="object-cover rounded shadow border border-neutral-200 relative h50"
      />
    </button>
    <div className="mt-2 text-center z-10 flex flex-col items-center w-full">
      {!inProgress && <div className="flex justify-center mt-1">
        {[1,2,3,4,5].map((i) => (
          <FaStar
            key={i}
            className={i <= rating ? 'text-accentYellow' : 'text-neutral-200'}
            aria-hidden="true"
          />
        ))}
      </div> }
      <div className="font-medium text-xs break-words whitespace-normal" title={title}>{title}</div>
    </div>
  </div>
);

export default BookItem;
