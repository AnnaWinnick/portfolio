import SectionWrapper from '../components/SectionWrapper';
import ContactForm from '../components/ContactForm';
import React from 'react';

const Contact: React.FC = () => (
  <SectionWrapper id="resume" title="Resume & Contact">
    <div className="space-y-4">
      <ContactForm />
    </div>
  </SectionWrapper>
);

export default Contact;
