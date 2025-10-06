'use client';

import { useState } from 'react';
import CreateWebsiteForm from '@/components/CreateWebsiteForm';

export default function Home() {
  const [createdWebsite, setCreatedWebsite] = useState(null);

  const handleWebsiteCreated = (website) => {
    setCreatedWebsite(website);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Umami Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreateWebsiteForm onWebsiteCreated={handleWebsiteCreated} />
          
          {createdWebsite && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Website Created Successfully!
              </h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {createdWebsite.name}</p>
                <p><strong>Domain:</strong> {createdWebsite.domain}</p>
                <p><strong>Website ID:</strong> 
                  <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
                    {createdWebsite.websiteId}
                  </code>
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Tracking Script:</h3>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`<script src="${window.location.origin}/api/tracker/${createdWebsite.websiteId}"></script>`}
                </pre>
                <p className="text-sm text-blue-800 mt-2">
                  Add this script to your website and visit{' '}
                  <a href={`/dashboard/${createdWebsite.websiteId}`} className="underline">
                    your dashboard
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}