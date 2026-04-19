import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { ProfileList } from './ProfileList'; // Import the ProfileList component

export const ProfileDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data,
    profiles,
    loading,
    error,
    getProfile,
    fetchAllProfiles,
    removeProfile,
  } = useProfile();

  // 1. Fetch history as soon as the dashboard mounts
  useEffect(() => {
    fetchAllProfiles();
  }, [fetchAllProfiles]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      await getProfile(searchTerm);
    } catch (err) {
      // Error is already handled by the hook's state
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Section */}
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Profile <span className="text-blue-600">Intelligence</span>
        </h1>
        <p className="text-gray-500">
          Enter a name to predict demographics using our cloud-powered AI
          engine.
        </p>
      </section>

      {/* Input Section */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100"
      >
        <Input
          placeholder="Enter name (e.g., David, Sarah...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" isLoading={loading}>
          Analyze
        </Button>
      </form>

      {/* State Handlers: Error */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          {/* <p className="font-medium">Error: {error}</p> */}
          <p className="text-sm">Invalid Input</p>
        </div>
      )}

      {/* Result Card Section */}
      {data && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-600 p-6 text-white">
            <h2 className="text-3xl font-bold capitalize">{data.name}</h2>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-400 uppercase font-semibold">
                Predicted Gender
              </p>
              <p className="text-xl font-medium text-gray-800">{data.gender}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400 uppercase font-semibold">
                Age Group
              </p>
              <Badge>{data.age_group}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400 uppercase font-semibold">
                Estimated Age
              </p>
              <p className="text-xl font-medium text-gray-800">
                {data.age} years
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400 uppercase font-semibold">
                Primary Location
              </p>
              <p className="text-xl font-medium text-gray-800">
                {data.country_id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Display the History List */}
      <ProfileList
        profiles={profiles}
        onDelete={removeProfile}
        isLoading={loading}
      />
    </div>
  );
};;
