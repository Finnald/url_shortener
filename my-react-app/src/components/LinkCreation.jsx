import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react'

function AddLink({ getPublicLinks, userId }) {
    const [link, setLink] = useState('');


    async function addUrl(link) {

        console.log(userId);

        await fetch('http://localhost:5231/addCode', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                link,
                userId
            })
        })

        setLink("")

        await getPublicLinks()
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-1 shadow-sm rounded-lg">
                <span className="px-3 flex items-center bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg text-gray-400 text-md">
                    https://
                </span>

                <input
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg bg-white"
                />
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                onClick={() => addUrl(link)}
            >
                + Add
            </button>
        </div>

    );

}
export default AddLink;