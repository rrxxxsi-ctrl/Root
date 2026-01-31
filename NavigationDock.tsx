import { User, LogOut, LayoutDashboard, ShoppingBag, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavigationDock() {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();
  const { isRTL, language } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 sm:top-6 ${isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-50`}
    >
      <div className="glass rounded-2xl p-1.5 flex items-center gap-1 border border-white/10 shadow-2xl">
        <ThemeToggle />
        <LanguageToggle />
        
        <div className="h-6 w-px bg-white/10 mx-1" />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />
            </motion.div>
          ) : user ? (
            <motion.div
              key="user"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-purple-500/50 transition-all"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold">
                    {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <Link href={location === '/dashboard' ? '/' : '/dashboard'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    location === '/dashboard' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  data-testid="button-dashboard"
                >
                  {location === '/dashboard' ? <ShoppingBag size={18} /> : <LayoutDashboard size={18} />}
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400/70 hover:text-red-400 transition-all"
                data-testid="button-logout"
              >
                <LogOut size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.a
              key="login"
              href="/api/login"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 px-4 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg hover:shadow-purple-500/30 transition-all btn-neon"
              data-testid="button-login"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">{language === 'ar' ? 'دخول' : 'Login'}</span>
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}