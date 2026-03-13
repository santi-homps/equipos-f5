import { Home, Settings, Menu } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-bold">My App</h1>
        </div>
        <div className="flex items-center gap-4">
          <Home className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <Settings className="w-5 h-5 cursor-pointer hover:text-blue-600" />
        </div>
      </div>
    </nav>
  );
};
