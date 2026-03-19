import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pb-10 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-3 group">
              <img 
                src="/logo.png" 
                alt="CineScope Logo" 
                className="h-8 w-8 object-contain rounded-lg shadow-xl"
              />
              <span className="font-accent text-2xl tracking-wider text-white">
                Cine<span className="text-yellow-400">Scope</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm max-w-xs leading-relaxed">
              Your cinematic companion for discovering and tracking movies you love.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-surface-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/search" className="hover:text-white transition-colors">Search</Link>
            <Link to="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
            <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-surface-500 font-bold">
          <p>© {currentYear} CineScope</p>
          <div className="flex items-center gap-6">
            <span>Powered by TMDB</span>
            <span className="hidden md:inline">Built for Movie Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
