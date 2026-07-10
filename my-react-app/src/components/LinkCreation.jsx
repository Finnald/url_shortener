import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/react'

function AddLink({ getPublicLinks, getUserLinks, userId }) {
    const [link, setLink] = useState('');
    const [statusMessage, setStatusMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const API_URL = import.meta.env.VITE_API_URL



    async function addUrl(link) {


        //remove any occurence of these substrings from the link
        link = link.replace("https://", '')
        link = link.replace("http://", '')

        console.log(link)
        var url = "https://" + link.trim()
        console.log(url)

        if (!isUrl(url)) {
            setStatusMessage("Invalid URL: Please try again")
            return
        }

        setLoading(true)
        const res = await fetch(`${API_URL}/addCode`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                link,
                userId
            })
        })
        setLoading(false)

        if (!res.ok) {
            setStatusMessage("error")
        } else {
            setStatusMessage("")
        }

        setLink("")

        if (userId) {
            await getUserLinks(userId)
        } else {
            await getPublicLinks()
        }

    }

    function isUrl(url) {
        try {
            var url_test = new URL(url)
            return true;
        } catch {
            return false;
        }
    }

    function isSanitary(url) {
        const regex = /^[^\s/$.?#].[^\s]*$/
        if (regex.test(url) && !url.includes(":")) {
            console.log('aiii')
        }
    }

    return (
        <>
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

                {loading ? (<button disabled
                    className="bg-blue-300 text-white px-4 py-2 rounded-lg shadow-sm"
                >
                    <LoaderCircle className="animate-spin" />
                </button>) : (<button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                    onClick={() => addUrl(link)}
                >
                    + Add
                </button>)}

            </div >


            <div
                className="text-sm text-red-400"
            >
                {statusMessage}
            </div>
        </>
    );

}
export default AddLink;