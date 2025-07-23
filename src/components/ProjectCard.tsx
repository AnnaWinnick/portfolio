import React from 'react';

type ProjectCardProps = {
  title: string;
  description: string;
  link: string;
  tags?: string[];
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, link, tags }) => (
  <div className="border border-neutral-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
    <a href={link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-700 hover:underline">
      {title}
    </a>
    <p className="mt-1 text-neutral-700 text-sm">{description}</p>
    {tags && (
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="bg-neutral-100 text-xs px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default ProjectCard;
