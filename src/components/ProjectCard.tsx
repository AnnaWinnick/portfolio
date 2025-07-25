import React from 'react';

type ProjectCardProps = {
  title: string;
  description: string;
  link: string;
  tags?: string[];
};

const tagList = {
  "Accessibility": "bg-accentBlue",
  "Design System": "bg-accentPink",
  "Platform": "bg-accentYellow",
  "React": "bg-accentOrange",
  "TypeScript": "bg-accentOlive"
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, link, tags }) => (
  <div className="rounded-lg p-4 mb-4 bg-neutral-50 shadow-sm hover:bg-accentBlue">
    <a href={link} target="_blank" rel="noopener noreferrer" >
      <div className="text-lg font-semibold text-black">
        {title}
      </div>
      <p className="mt-1 text-neutral-700 text-sm">{description}</p>
      {tags && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-button font-bold ${tagList[tag] ?? 'bg-accentOffWhite'}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  </div>
);

export default ProjectCard;
