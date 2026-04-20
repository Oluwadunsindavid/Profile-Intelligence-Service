// This is the "Drop-down" information table the Guest sees after a search.
import React from "react";

export const ProfileResult: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-indigo-600 p-6 text-white text-center">
        <h3 className="text-2xl font-bold capitalize">
          Insights for {data.name}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="p-8 text-center">
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-2">
            Predicted Age
          </p>
          <p className="text-4xl font-black text-slate-800">{data.age}</p>
          <span className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full mt-2 inline-block">
            {data.age_group}
          </span>
        </div>

        <div className="p-8 text-center">
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-2">
            Gender Confidence
          </p>
          <p className="text-4xl font-black text-slate-800 capitalize">
            {data.gender}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {(data.gender_probability * 100).toFixed(0)}% Certainty
          </p>
        </div>

        <div className="p-8 text-center">
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-2">
            Origin
          </p>
          <p className="text-4xl font-black text-slate-800">
            {data.country_id}
          </p>
          <p className="text-sm text-slate-400 mt-1">Primary Region</p>
        </div>
      </div>
    </div>
  );
};
