// // function App() {

// //   return (
// //    <>
// //       <h1>Welcome to the App!</h1>
// //    </>
// //   )
// // }

// // export default App
// import { useState } from "react";

// // 1. Define the shape of the data we expect from the backend
// interface Profile {
//   _id: string;
//   name: string;
//   age: number;
//   gender: string;
//   age_group: string;
//   country_id: string;
// }

// function App() {
//   const [name, setName] = useState("");
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 2. Replace this with your actual Railway URL
//   const API_URL = "https://profile-intelligence-service-production-e113.up.railway.app/api/profiles";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setProfile(null);

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }

//       setProfile(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 font-sans">
//       <h1 className="text-4xl font-bold text-blue-600 mb-8">
//         Profile Intelligence
//       </h1>

//       {/* SEARCH FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8"
//       >
//         <label className="block text-gray-700 font-semibold mb-2">
//           Enter Name:
//         </label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g. David"
//             className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
//           >
//             {loading ? "Analyzing..." : "Search"}
//           </button>
//         </div>
//       </form>

//       {/* ERROR MESSAGE */}
//       {error && (
//         <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
//       )}

//       {/* RESULT CARD */}
//       {profile && (
//         <div className="w-full max-w-md bg-white border-l-8 border-blue-500 p-6 rounded-lg shadow-xl">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
//             {profile.name}
//           </h2>
//           <div className="space-y-2">
//             <p>
//               <span className="font-bold text-gray-600">Gender:</span>{" "}
//               {profile.gender}
//             </p>
//             <p>
//               <span className="font-bold text-gray-600">Predicted Age:</span>{" "}
//               {profile.age}
//             </p>
//             <p>
//               <span className="font-bold text-gray-600">Age Group:</span>
//               <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm uppercase">
//                 {profile.age_group}
//               </span>
//             </p>
//             <p>
//               <span className="font-bold text-gray-600">Top Country ID:</span>{" "}
//               {profile.country_id}
//             </p>
//           </div>
//           <p className="mt-4 text-xs text-gray-400 font-mono">
//             ID: {profile._id}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import { ProfileDashboard } from "./features/profile-search/ProfileDashboard";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <ProfileDashboard />
    </main>
  );
}

export default App;