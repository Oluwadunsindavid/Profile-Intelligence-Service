// Define the shape of our data centrally
export interface Profile {
  _id: string;
  name: string;
  age: number;
  gender: string;
  age_group: string;
  country_id: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const profileService = {
  /**
   * Sends a name to the backend to generate or retrieve a profile
   */
  async createProfile(name: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const responseData = await response.json(); // This is the { status, message, data } object

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    // return response.json();
    return responseData.data; // Return only the profile data
  },

  /**
   * Fetches all stored profiles
   */
//   async getAllProfiles(): Promise<Profile[]> {
//     const response = await fetch(`${API_BASE_URL}/profiles`);
//     return response.json();
//   },

  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    const responseData = await response.json();
    if (!response.ok) throw new Error("Failed to fetch history");

    // If your backend returns { status: "success", data: [...] }
    // You MUST return responseData.data
    return Array.isArray(responseData.data) ? responseData.data : [];
  },

  async deleteProfile(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete profile");
  },
};
