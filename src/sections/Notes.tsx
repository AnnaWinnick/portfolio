import SectionWrapper from '../components/SectionWrapper';
import Note from '../components/Note';
import React from 'react';

const notes = [
  {
    content: 'developer.hiya.com is LIVE!! Check it out!!',
    date: '2024-12-14',
  },
  {
    content: 'First day at Hiya! 🎉',
    date: '2024-07-15',
  },
  {
    content: 'Today, I graduated from the University of Washington with a degree in Computer Science, plus a double minor in Business Administration and Entrepreneurship. Go Dawgs!! 💜',
    date: '2024-06-08',
  },
    {
    content: 'Today, I graduated from the University of Washington with a degree in Computer Science, plus a double minor in Business Administration and Entrepreneurship. Go Dawgs!! 💜',
    date: '2024-06-08',
  },
  // TODO: Add more notes
];

const Notes: React.FC = () => (
  <SectionWrapper id="notes" title="Notes" className='bg-accentOffWhite'>
    <div className="overflow-auto max-h-[220px]">
      {notes.map((note, i) => (
        <Note key={i} {...note} />
      ))}
    </div>
  </SectionWrapper>
);

export default Notes;
