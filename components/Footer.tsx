import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-8">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} رفيق الصحي التكيفي اللامركزي (DAHC). جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};
