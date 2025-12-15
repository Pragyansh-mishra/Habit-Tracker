import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center"
        >
          <span className="font-display text-4xl font-bold text-muted-foreground">404</span>
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
