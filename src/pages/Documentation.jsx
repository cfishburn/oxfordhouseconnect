import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Documentation() {
  const [documents, setDocuments] = useState([]);
  const [groupedDocs, setGroupedDocs] = useState({});

  useEffect(() => {
    fetch('/docs/docs.json')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        groupByRole(data);
      })
      .catch((err) => console.error('Error loading docs.json:', err));
  }, []);

  const groupByRole = (docs) => {
    const grouped = {};
    docs.forEach((doc) => {
      const role = doc.role;
      if (!grouped[role]) grouped[role] = [];
      grouped[role].push(doc);
    });

    const sortedGrouped = Object.keys(grouped)
      .sort()
      .reduce((acc, role) => {
        acc[role] = grouped[role];
        return acc;
      }, {});

    setGroupedDocs(sortedGrouped);
  };

  const handleSearch = (query) => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase())
    );
    groupByRole(filtered);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Header onSearch={handleSearch} />
        <main className="p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Documentation</h1>

          {Object.entries(groupedDocs).map(([role, docs]) => (
            <section key={role} className="mb-10">
              <h2 className="text-blue-700 font-semibold text-lg mb-4">{role} Documents</h2>
              <div className="space-y-4">
                {docs.map((doc) => (
                  <div
                    key={doc.filename}
                    className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-medium text-gray-800">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    <div className="flex gap-4">
                      <a
                        href={`/docs/${doc.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View PDF
                      </a>
                      <a
                        href={`/docs/${doc.filename}`}
                        download
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
