import React from 'react';

const accentColorClasses = [
  'bg-accentYellow',
  'bg-accentBlue',
  'bg-accentOffWhite',
  'bg-accentPink',
  'bg-accentOrange',
  'bg-accentOlive',
];

type SectionWrapperProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, className }) => {
  return (
    <section
      id={id}
      className={`my-8 p-8 rounded-section ${className || ''}`}
    >
      {title && <h2 className="text-2xl font-bold mb-6 tracking-tight">{title}</h2>}
      <div>{children}</div>
    </section>
  );
};

export default SectionWrapper;
