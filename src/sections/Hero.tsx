import SectionWrapper from '../components/SectionWrapper';
import React from 'react';
import { FaLinkedin, FaFilePdf } from 'react-icons/fa';

const Hero: React.FC = () => (
  <SectionWrapper id="hero">
    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left py-16 gap-8">
      <img
        src="https://placehold.co/180x180?text=Photo" // TODO: Replace with your photo
        alt="Profile"
        className="w-44 h-44 rounded-full object-cover border-4 border-white shadow mb-6 md:mb-0"
      />
      <div className="flex-1 flex flex-col items-center md:items-start">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Anna Winnick</h1> {/* TODO: Replace with your name */}
        <p className="text-lg text-blue-700 font-medium mb-2">Platform Engineer @ Acme Corp</p> {/* TODO: Replace with your current role */}
        <div className="flex gap-4 mb-4">
          <a
            href="/resume.pdf"
            download
            className="text-blue-700 hover:text-blue-900 text-2xl"
            title="Download Resume"
          >
            <FaFilePdf />
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin" // TODO: Replace with your LinkedIn
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 text-2xl"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
        <p className="text-neutral-700 max-w-xl mb-0">Building reliable platforms and delightful UIs. Junior software engineer with a passion for frontend and developer experience.</p> {/* TODO: Update tagline/summary */}
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
