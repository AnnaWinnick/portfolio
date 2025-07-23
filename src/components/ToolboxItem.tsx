import React from 'react';

type ToolboxItemProps = {
  name: string;
  icon: React.ReactNode;
  description?: string;
};

const ToolboxItem: React.FC<ToolboxItemProps> = ({ name, icon, description }) => (
  <div className="flex items-center gap-2 py-1">
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{name}</span>
    {description && <span className="text-neutral-500 text-xs ml-2">{description}</span>}
  </div>
);

export default ToolboxItem;
