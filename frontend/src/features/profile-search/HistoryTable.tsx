// This only loads if the User is logged in. It fetches the private history from your backend.
import React, { useEffect } from "react";
import api from "../../api/axios";

interface HistoryTableProps {
  onDeleteSuccess: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  onDeleteSuccess,
}) => {
  const [history, setHistory] = React.useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/profiles");
        setHistory(response.data.data);
      } catch (err) {
        console.error("Could not fetch history");
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this search?")) return;
    try {
      await api.delete(`/profiles/${id}`);
      onDeleteSuccess();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete the record.");
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 italic">No search history found yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* --- DESKTOP VIEW (Visible on sm screens and up) --- */}
      <div className="hidden sm:block overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Gender</th>
              <th className="p-4 font-bold">Age</th>
              <th className="p-4 font-bold">Country</th>
              <th className="p-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item: any) => (
              <tr
                key={item._id}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="p-4 font-bold capitalize text-slate-900">
                  {item.name}
                </td>
                <td className="p-4 text-slate-600 capitalize">{item.gender}</td>
                <td className="p-4 text-slate-600">{item.age}</td>
                <td className="p-4 text-slate-600 font-mono">
                  {item.country_id}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Visible only on small screens) --- */}
      <div className="sm:hidden space-y-4">
        {history.map((item: any) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900 capitalize text-lg">
                  {item.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                    {item.gender}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                    Age: {item.age}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                    {item.country_id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 bg-red-50 text-red-500 rounded-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
