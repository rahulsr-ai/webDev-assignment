"use client";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

export default function SchoolsHomePage() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch schools from API
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/schools/get");

      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }

      const data = await response.json();
      setSchools(data);
      setFilteredSchools(data);
    } catch (err) {
      setError("Failed to load schools. Please try again.");
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique states for filters
  const uniqueStates = [
    ...new Set(schools.map((school) => school.state)),
  ].sort();


  // Filter and search logic
  useEffect(() => {
    let filtered = schools;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (school) =>
          school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (selectedState !== "All") {
      filtered = filtered.filter((school) => school.state === selectedState);
    }

    // Sorting alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredSchools(filtered);
  }, [searchTerm, selectedState, schools]);

  // Helper function to extract public ID from Cloudinary URL
  const getCloudinaryPublicId = (url) => {
    if (!url) return "";

    // Extract public ID from Cloudinary URL
    const matches = url.match(/\/schools\/(.+)$/);
    if (matches) {
      return `schools/${matches[1].split(".")[0]}`;
    }

    // Fallback: return the URL as is
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchSchools}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative">
        {/* Header */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2  text-black/50 z-20" />
                <input
                  type="text"
                  placeholder="Search School..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-300 focus:border-slate-500 transition-all duration-200 text-slate-800"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-300 focus:border-slate-500 transition-all duration-200 text-slate-800"
              >
                <option value="All">All States</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <p className="text-center text-slate-600 mt-4">
              {filteredSchools.length} Schools found
            </p>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="group backdrop-blur-sm bg-white/70 border border-gray-200/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                {/* School Image using CldImage */}
                <div className="relative h-48 overflow-hidden">
                  <CldImage
                    width="400"
                    height="250"
                    src={getCloudinaryPublicId(school.image)}
                    alt={school.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    crop={{
                      type: "fill",
                      source: true,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* School Info */}
                <div className="p-5">
                  {/* School Name */}
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors mb-3 line-clamp-2">
                    {school.name}
                  </h3>

                  {/* Address & City */}
                  <div className="space-y-2">
                    <div className="flex items-start text-slate-600">
                      <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0 text-sm" />
                      <div className="text-sm">
                        <p className="line-clamp-2 mb-1">{school.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-400 p-2 rounded-b-2xl flex items-center justify-center font-semibold text-ll">
                  <p className="font-medium text-white ">
                    {school.city}, {school.state}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSchools.length === 0 && !loading && (
            <div className="text-center py-16">
              <FaBuilding className="text-slate-400 text-6xl mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                No Schools found
              </h3>
              <p className="text-slate-600 mb-6">
                {schools.length === 0
                  ? "No Schools have been added yet."
                  : "Try adjusting your search or filters."}
              </p>
              {schools.length === 0 && (
                <Link
                  href="/schools/add"
                  className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add First School
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
