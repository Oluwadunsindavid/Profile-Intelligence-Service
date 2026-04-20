import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Visual Icon */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-5xl sm:text-6xl font-black text-indigo-600">
            404
          </span>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-200 rounded-full blur-sm"></div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
        Lost in the <span className="text-indigo-600">Intelligence</span> Cloud?
      </h2>

      <p className="text-slate-500 max-w-md mb-10 text-sm sm:text-base leading-relaxed">
        The profile or page you are looking for doesn't exist or has been moved
        to a private directory.
      </p>

      {/* Action Button */}
      <Link
        to="/"
        className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Dashboard
      </Link>

      {/* Subtle branding footer */}
      <div className="mt-20 opacity-20 grayscale pointer-events-none">
        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
          profile <span className="text-indigo-600">intelligence</span>
        </h1>
      </div>
    </div>
  );
};

export default NotFound;
