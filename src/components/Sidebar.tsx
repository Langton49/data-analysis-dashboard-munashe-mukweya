import { TrendingUp, BarChart3, LineChart, Table, MessageCircle, Upload, Moon, Sun, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import logo from '../components/ui/logo(2).png'

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
    { id: 'overview', label: 'Market Overview', icon: TrendingUp },
    { id: 'charts', label: 'Stock Charts', icon: BarChart3 },
    { id: 'insights', label: 'Investment Insights', icon: LineChart },
    { id: 'chat', label: 'AI Analysis', icon: MessageCircle },
    { id: 'data', label: 'Stock Data', icon: Table },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg">
            <img src={logo} alt="Application logo" style={{ width: '50px', height: 'auto' }}/>
          </div>
          <div>
            <h1 className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100">
              Stock Market
            </h1>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400">
              Analyzer
            </p>
          </div>
        </div>
        {fileName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            📊 {fileName}
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
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-950 dark:hover:to-blue-950'
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
