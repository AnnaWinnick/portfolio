import SectionWrapper from '../components/SectionWrapper';
import Note from '../components/Note';
import React from 'react';

const notes = [
  {
    content: 'Started learning about platform observability tools. Excited to dig deeper!',
    date: '2024-06-01',
  },
  {
    content: 'Shipped my first PR to the design system repo! 🎉',
    date: '2024-05-20',
  },
  // TODO: Add more notes
];

const Notes: React.FC = () => (
  <SectionWrapper id="notes" title="Notes" className='bg-accentOffWhite'>
    <div>
      {notes.map((note, i) => (
        <Note key={i} {...note} />
      ))}
    </div>
  </SectionWrapper>
);

export default Notes;
