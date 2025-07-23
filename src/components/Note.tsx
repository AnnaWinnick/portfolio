import React from 'react';

type NoteProps = {
  content: string;
  date?: string;
};

const Note: React.FC<NoteProps> = ({ content, date }) => (
  <div className="border border-neutral-200 rounded p-3 mb-2 bg-neutral-50">
    <div className="text-sm text-neutral-800">{content}</div>
    {date && <div className="text-xs text-neutral-400 mt-1">{date}</div>}
  </div>
);

export default Note;
