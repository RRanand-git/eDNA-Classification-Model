
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface w-full mt-auto py-4 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} SIH Hackathon Project. All Rights Reserved.</p>
        <p>AI-Powered eDNA Classification</p>
      </div>
    </footer>
  );
};

export default Footer;
