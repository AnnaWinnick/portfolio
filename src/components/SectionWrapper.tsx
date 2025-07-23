import React from 'react';

type SectionWrapperProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, className }) => (
  <section id={id} className={`py-12 ${className || ''}`}>
    {title && <h2 className="text-2xl font-bold mb-6 tracking-tight">{title}</h2>}
    <div>{children}</div>
  </section>
);

export default SectionWrapper;
