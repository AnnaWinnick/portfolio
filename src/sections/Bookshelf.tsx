import SectionWrapper from '../components/SectionWrapper';
import BookItem from '../components/BookItem.tsx';
import Modal from '../components/Modal';
import React, { useState } from 'react';

const bookshelf = [
  {
    title: 'Designing Data-Intensive Applications',
    cover: 'https://covers.openlibrary.org/b/id/8231996-L.jpg', // TODO: Replace with your own image
    rating: 5,
    inProgress: false,
    review: 'A must-read for backend and platform engineers. Key takeaways: scalability, reliability, and maintainability. // TODO: Add your own review',
  },
  {
    title: 'Refactoring UI',
    cover: 'https://covers.openlibrary.org/b/id/10523338-L.jpg', // TODO: Replace with your own image
    rating: 4,
    inProgress: true,
    review: 'Great for practical UI improvements. // TODO: Add your own review',
  },
  {
    title: 'React 18 Docs',
    cover: 'https://placehold.co/200x300?text=React+18', // TODO: Replace with your own image
    rating: 3,
    inProgress: false,
    review: 'Helpful for learning concurrent features. // TODO: Add your own review',
  },
  {
    title: 'Designing Data-Intensive Applications',
    cover: 'https://covers.openlibrary.org/b/id/8231996-L.jpg', // TODO: Replace with your own image
    rating: 5,
    inProgress: false,
    review: 'A must-read for backend and platform engineers. Key takeaways: scalability, reliability, and maintainability. // TODO: Add your own review',
  },
  {
    title: 'Refactoring UI',
    cover: 'https://covers.openlibrary.org/b/id/10523338-L.jpg', // TODO: Replace with your own image
    rating: 4,
    inProgress: true,
    review: 'Great for practical UI improvements. // TODO: Add your own review',
  },
  {
    title: 'React 18 Docs',
    cover: 'https://placehold.co/200x300?text=React+18', // TODO: Replace with your own image
    rating: 3,
    inProgress: false,
    review: 'Helpful for learning concurrent features. // TODO: Add your own review',
  },
  // TODO: Add more books/articles/videos
];

const Bookshelf: React.FC = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  return (
    <SectionWrapper id="bookshelf" title="Bookshelf" className='bg-accentPink'>
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-row gap-4 min-w-full">
          {bookshelf.map((item, idx) => (
            <BookItem
              key={item.title}
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              inProgress={item.inProgress}
              onClick={() => setModalIdx(idx)}
            />
          ))}
        </div>
      </div>
      {modalIdx !== null && (
        <Modal
          isOpen={modalIdx !== null}
          onClose={() => setModalIdx(null)}
          title={bookshelf[modalIdx].title}
        >
          <div className="mb-2">
            <img
              src={bookshelf[modalIdx].cover}
              alt={bookshelf[modalIdx].title}
              className="w-32 h-44 object-cover rounded mb-2 mx-auto"
            />
            <div className="text-neutral-700 text-sm">
              {bookshelf[modalIdx].review}
            </div>
          </div>
        </Modal>
      )}
    </SectionWrapper>
  );
};

export default Bookshelf;
