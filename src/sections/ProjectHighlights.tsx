import SectionWrapper from '../components/SectionWrapper';
import ProjectCard from '../components/ProjectCard';
import React from 'react';

const projects = [
  {
    title: 'Hiya Developer Documentation',
    description: 'My first task at Hiya - build a documentation site for the Hiya team to publish and polish APIs for public access.',
    link: 'https://developer.hiya.com',
    tags: ['TypeScript', 'React'],
  },
  {
    title: 'Cactus Kefir',
    description: 'One class project turned into $10k in sales, 6 retail locations, 1 seasonal restaurant feature and Sweet-Sixteen status in the Dempsey Startup Competition.',
    link: 'https://instagram.com/cactuskefir',
    tags: ['Leadership'],
  },
  // TODO: Add more projects or contributions
];

const ProjectHighlights: React.FC = () => (
  <SectionWrapper id="work" title="Project Highlights" className='bg-accentYellow'>
    <div className="overflow-auto">
      {projects.map((p) => (
        <ProjectCard key={p.title} {...p} />
      ))}
    </div>
  </SectionWrapper>
);

export default ProjectHighlights;
