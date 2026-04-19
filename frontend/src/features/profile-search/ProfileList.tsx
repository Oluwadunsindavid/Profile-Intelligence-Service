import { Badge } from "../../components/ui/badge";

interface Profile {
  _id: string;
  name: string;
  age: number;
  gender: string;
  age_group: string;
  country_id: string;
}

interface ProfileListProps {
  profiles: Profile[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const ProfileList = ({
  profiles,
  onDelete,
  isLoading,
}: ProfileListProps) => {
  if (!isLoading && profiles.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-sm">No profiles found in history.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        Search History
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
          {profiles.length}
        </span>
      </h3>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Demographics
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {Array.isArray(profiles) &&
              profiles.map((profile) => (
                <tr
                  key={profile._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 capitalize">
                      {profile.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600">
                        {profile.gender} ({profile.age} yrs)
                      </span>
                      <Badge>{profile.age_group}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {profile.country_id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(profile._id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Profile"
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
    </div>
  );
};
