'use client';


import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaBuilding, FaPlus } from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();

  //hide Add button on specific route
  const showAddButton = pathname !== '/schools/add';

  return (
    <div className="backdrop-blur-sm bg-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg shadow-md">
              <FaBuilding className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Educational Schools Directory
              </h1>
              <p className="text-slate-600">
                Discover and connect with quality educational 
              </p>
            </div>
          </div>
          
          {showAddButton && (
            <Link
              href="/schools/add"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="mr-2" />
              Add School
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
