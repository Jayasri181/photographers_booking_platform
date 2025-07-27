import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ContestCard = ({ contest }) => {
  const isActive = new Date(contest.end_date) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {contest.banner_url && (
          <img
            src={contest.banner_url}
            alt={contest.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}>
            {isActive ? 'Active' : 'Ended'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {contest.title}
        </h3>
        <p className="text-gray-600 mb-4">{contest.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>
            Start: {format(new Date(contest.start_date), 'MMM d, yyyy')}
          </span>
          <span>
            End: {format(new Date(contest.end_date), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-900">Prizes:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {contest.prizes.map((prize, index) => (
              <li key={index}>{prize}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {contest.entries_count || 0} Entries
          </div>
          <Link
            to={`/contests/${contest.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isActive ? 'Enter Contest' : 'View Results'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
