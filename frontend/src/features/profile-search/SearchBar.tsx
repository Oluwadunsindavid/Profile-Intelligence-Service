// This handles the input and the API call. I want Guests to search, I used the api instance which handles both Guest and User states automatically.
import React, { useState } from "react";
import api from "../../api/axios";

interface SearchBarProps {
  onResult: (data: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onResult }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      // This call now automatically includes the token in the headers
      const response = await api.post("/profiles", { name });

      // We pass the data up to the Dashboard to show the result table
      onResult(response.data.data);

      // Optional: Clear the input after success
      setName("");
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a name (e.g. David)..."
        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="
        w-full py-4 mt-12 sm:mt-0 rounded-2xl font-bold transition-all sm:absolute sm:right-2 sm:top-2 sm:bottom-2 sm:w-auto sm:px-8 sm:py-0 sm:rounded-xl
        bg-indigo-600 text-white hover:bg-indigo-500 
        disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-indigo-600/20
      "
      >
        {/* {loading ? "Searching..." : "Analyze"} */}
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Searching...</span>
          </div>
        ) : (
          "Analyze"
        )}
      </button>
    </form>
  );
};
