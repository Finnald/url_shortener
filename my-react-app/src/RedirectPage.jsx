import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export default function RedirectPage() {
    const { code } = useParams();
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        getLink()
    }, []);

    async function getLink() {
        setloading(true)
        await fetch(`${API_URL}/${code}`)
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error(error));
        setloading(false)
    }

    return (
        <div className="p-4 text-lg flex flex-col justify-center items-center min-h-screen">
            {data ? (<>
                <h1>Link:</h1>

                <a
                    href={`https://${data}`}
                    className="flex text-blue-600 font-semibold hover:underline"
                >
                    {data}
                </a>
            </>
            ) : loading ? (<LoaderCircle className="animate-spin" />
            ) : (
                <>
                    <h1 className="text-gray-500">Link not found</h1>

                    <a
                        href={`http://localhost:5173`}
                        className="flex text-blue-600 font-semibold hover:underline"
                    >
                        Back
                    </a>
                </>
            )}
        </div>




    );
}
