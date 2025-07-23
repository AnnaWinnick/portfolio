import SectionWrapper from '../components/SectionWrapper';
import ToolboxItem from '../components/ToolboxItem';
import React from 'react';
import { SiTypescript, SiJavascript, SiPython, SiReact, SiVite, SiTailwindcss, SiGit, SiFigma, SiJira } from 'react-icons/si';

const toolbox = [
  {
    category: 'Languages',
    items: [
      { name: 'TypeScript', icon: <SiTypescript /> },
      { name: 'JavaScript', icon: <SiJavascript /> },
      { name: 'Python', icon: <SiPython /> }, // TODO: Add/remove languages and icons
    ],
  },
  {
    category: 'Frameworks',
    items: [
      { name: 'React', icon: <SiReact /> },
      { name: 'Vite', icon: <SiVite /> },
      { name: 'TailwindCSS', icon: <SiTailwindcss /> }, // TODO: Add/remove frameworks and icons
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git', icon: <SiGit /> },
      { name: 'Figma', icon: <SiFigma /> },
      { name: 'Jira', icon: <SiJira /> }, // TODO: Add/remove tools and icons
    ],
  },
  // TODO: Add more categories
];

const Toolbox: React.FC = () => (
  <SectionWrapper id="toolbox" title="Toolbox" className='bg-accentOlive'>
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {/* Large: 3 columns, Medium: 2+1, Small: 1 */}
      {toolbox.map((group) => (
        <div key={group.category}>
          <h3 className="font-semibold text-neutral-700 mb-2">{group.category}</h3>
          <div>
            {group.items.map((item) => (
              <ToolboxItem key={item.name} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default Toolbox;
