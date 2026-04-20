import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "./SearchBar";
import { ProfileResult } from "./ProfileResult";
import { HistoryTable } from "./HistoryTable";

export const ProfileDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [currentResult, setCurrentResult] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleNewResult = (data: any) => {
    setCurrentResult(data);
    setRefreshHistory((prev) => prev + 1);
  };

  useEffect(() => {
    if (token) {
      console.log("User is now authenticated:", user?.name);
    }
  }, [token, user]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-20">
      {/* --- RESPONSIVE DYNAMIC NAVBAR --- */}
      <nav className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 mb-8 sm:mb-12 border-b border-slate-200/60 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg sm:text-xl">i</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight uppercase">
            profile <span className="text-indigo-600">intelligence</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-center">
          {!token ? (
            /* GUEST VIEW */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm sm:text-base text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          ) : (
            /* LOGGED-IN VIEW */
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Account
                </p>
                <p className="text-slate-900 font-bold text-sm">
                  Welcome,{" "}
                  <span className="text-indigo-600">
                    {user?.name || "User"}
                  </span>
                </p>
              </div>
              {/* Show name on mobile too but more compact */}
              <p className="sm:hidden text-sm font-bold text-slate-900">
                Hi,{" "}
                <span className="text-indigo-600">
                  {user?.name?.split(" ")[0]}
                </span>
              </p>
              <button
                onClick={logout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="flex flex-col items-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 text-center px-2">
          Profile Intelligence
        </h2>
        <p className="text-sm sm:text-base text-slate-500 text-center max-w-lg mb-6 sm:mb-8 px-4">
          Enter a name to predict age, gender, and national origin using our
          advanced AI handshakes.
        </p>
        <SearchBar onResult={handleNewResult} />
      </div>

      {currentResult && (
        <section className="mb-12 sm:mb-20 animate-in fade-in slide-in-from-top-6 duration-700 ease-out">
          <ProfileResult data={currentResult} />
        </section>
      )}

      {/* History Section */}
      <div className="mt-8 sm:mt-12">
        {token ? (
          <div className="animate-in fade-in duration-1000">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-indigo-600 rounded-full"></span>
              Your Recent Searches
            </h3>
            <HistoryTable
              key={refreshHistory}
              onDeleteSuccess={() => setRefreshHistory((prev) => prev + 1)}
            />
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Save Your Insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
              Don't lose your data. Create a free account to track your search
              history and access analytics from anywhere.
            </p>
            <Link
              to="/register"
              className="inline-block bg-indigo-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/40"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
