import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState(null);
  const [link, setLink] = useState('');


  // will implement nicer later
  useEffect(() => {
    fetch('http://localhost:5231/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));

  }, []);

  async function addUrl(link) {
    // should work for later
    await fetch(`http://localhost:5231/addCode/${link}`, { method: 'POST' })

    setLink("")

    await fetch('http://localhost:5231/all')
      .then(response => response.json())
      .then(json => setData(json))
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* Box 1 — Add Link */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Add a New Link
          </h3>

          <div className="flex items-center gap-3">
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="Enter full URL"
              className="flex-1 rounded-lg shadow-sm px-4 py-2 border border-gray-300"
            />

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
              onClick={() => addUrl(link)}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Box 2 — Link List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Shortened Links
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <th className="p-3 text-left">Full Link</th>
                  <th className="p-3 text-left">Short Link</th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        <a
                          href={`https://${item.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          https://{item.link}
                        </a>
                      </td>

                      <td className="p-3">
                        <a
                          href={`https://url.com/${item.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 font-medium hover:underline"
                        >
                          url.com/{item.code}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center p-6 text-gray-400">
                      No links yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );



}

export default App;