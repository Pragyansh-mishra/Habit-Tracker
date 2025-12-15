import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart3, Settings } from "lucide-react";

const navItems = [
  { path: "/", icon: Calendar, label: "Tracker" },
  { path: "/analysis", icon: BarChart3, label: "Analysis" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 md:relative md:border-t-0 md:border-r md:h-screen md:w-20">
      <div className="flex md:flex-col items-center justify-around py-2 md:py-8 md:gap-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="relative px-6 py-2 md:px-2">
              <motion.div
                className={`
                  flex flex-col items-center gap-1 transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 md:-right-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 w-8 h-1 md:w-1 md:h-8 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
