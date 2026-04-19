// import { useState } from "react";
// import { profileService,type Profile } from "../api/profileService";

// export const useProfile = () => {
//   const [data, setData] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getProfile = async (name: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await profileService.createProfile(name);
//       setData(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, loading, error, getProfile };
// };
import { useState, useCallback } from "react";
import { profileService, type Profile } from "../api/profileService";

export const useProfile = () => {
  // State for a single searched profile
  const [data, setData] = useState<Profile | null>(null);
  // State for the entire list (History)
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Create/Search Profile
  const getProfile = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.createProfile(name);
      setData(result);
      // Refresh the list automatically after creating a new one
      await fetchAllProfiles();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch All Profiles (History)
  const fetchAllProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allProfiles = await profileService.getProfiles();
      setProfiles(allProfiles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Delete a Profile
  const removeProfile = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await profileService.deleteProfile(id);
      // Optimistic Update: Remove from local state immediately so UI feels snappy
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      // If the deleted profile is the one currently being viewed, clear it
      if (data?._id === id) setData(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data, // Current search result
    profiles, // Full history list
    loading,
    error,
    getProfile,
    fetchAllProfiles,
    removeProfile,
  };
};