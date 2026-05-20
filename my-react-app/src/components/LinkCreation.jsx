import React, { useState, useEffect } from 'react';
function AddLink({ getPublicLinks }) {
    const [link, setLink] = useState('');

    async function addUrl(link) {
        // should work for later
        await fetch(`http://localhost:5231/addCode/${link}`, { method: 'POST' })

        setLink("")

        await getPublicLinks()
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Add a New Link
            </h3>

            <div className="flex items-center gap-3">
                <input
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="Enter full URL"
                    className="flex-1 rounded-lg shadow-sm px-4 py-2 border border-gray-300 bg-white"
                />

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                    onClick={() => addUrl(link)}
                >
                    + Add
                </button>
            </div>
        </div>
    );

}
export default AddLink;