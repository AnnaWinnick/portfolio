import SectionWrapper from '../components/SectionWrapper';
import ToolboxItem from '../components/ToolboxItem';
import React from 'react';
import { SiOpenai } from 'react-icons/si';
import { FaGithub, FaMagic } from 'react-icons/fa';

const favoriteTools = [
  {
    name: 'ChatGPT',
    icon: <SiOpenai />,
    description: 'For brainstorming, code review, and learning. // TODO: Update with your own note',
  },
  {
    name: 'GitHub Copilot',
    icon: <FaGithub />,
    description: 'AI pair programming for faster prototyping. // TODO: Update with your own note',
  },
  {
    name: 'Cursor',
    icon: <FaMagic />,
    description: 'AI-powered code editor. // TODO: Update with your own note',
  },
  // TODO: Add/remove favorite tools
];

const FavoriteTools: React.FC = () => (
  <SectionWrapper id="favorite-tools" title="My Current Go-Tos:" className="bg-accentBlue">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {favoriteTools.map((tool) => (
        <ToolboxItem key={tool.name} {...tool} />
      ))}
    </div>
  </SectionWrapper>
);

export default FavoriteTools;
