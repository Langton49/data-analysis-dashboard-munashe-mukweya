import { BarChart3, PieChart, LineChart, Table, MessageCircle, Upload, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  fileName?: string;
  onReset?: () => void;
}

const Sidebar = ({ activeTab, onTabChange, fileName, onReset }: SidebarProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'charts', label: 'Charts', icon: PieChart },
    { id: 'insights', label: 'Insights', icon: LineChart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'data', label: 'Data', icon: Table },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-light tracking-tight text-gray-900 dark:text-gray-100">
          Data Visualizer
        </h1>
        {fileName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {fileName}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                text-sm font-light tracking-wide transition-all
                ${isActive
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
          >
            <Upload className="h-4 w-4" />
            <span>New Dataset</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
