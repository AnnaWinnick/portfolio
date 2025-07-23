import SectionWrapper from '../components/SectionWrapper';
import ProjectCard from '../components/ProjectCard';
import React from 'react';

const projects = [
  {
    title: 'Open Source Dashboard',
    description: 'A dashboard for monitoring platform health, used by 100+ engineers. Public repo with contributions to core UI.',
    link: 'https://github.com/example/dashboard', // TODO: Replace with your project link
    tags: ['React', 'TypeScript', 'Platform'],
  },
  {
    title: 'Design System Contributions',
    description: 'Helped build accessible components for the company design system. Shipped to production.',
    link: 'https://github.com/example/design-system', // TODO: Replace with your project link
    tags: ['Design System', 'Accessibility'],
  },
  // TODO: Add more projects or contributions
];

const WorkHighlights: React.FC = () => (
  <SectionWrapper id="work" title="Work Highlights" className='bg-accentYellow'>
    <div>
      {projects.map((p) => (
        <ProjectCard key={p.title} {...p} />
      ))}
    </div>
  </SectionWrapper>
);

export default WorkHighlights;
