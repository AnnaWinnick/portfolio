import React, { useRef } from 'react';

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action="mailto:TODO_YOUR_EMAIL" // TODO: Replace with your email
      method="POST"
      encType="text/plain"
      className="space-y-3"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <button
        type="submit"
        className="bg-accentOrange text-white px-4 py-2 rounded hover:bg-accentYellow hover:text-black transition-colors"
      >
        Send
      </button>
    </form>
  );
};

export default ContactForm;
