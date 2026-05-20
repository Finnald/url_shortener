import { RotateCcw, X } from 'lucide-react'


function UserLinks(props) {

    var data = props.data
    var getUserLinks = props.getUserLinks

    async function deleteCode(code) {
		await fetch(`http://localhost:5231/deleteCode/${code}`, { method: 'POST' })

		getUserLinks()

	}

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Links
            </h2>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                            <th className="p-3 text-left">Full Link</th>
                            <th className="p-3 text-left">Short Link</th>
                            <th className="p-3 text-right">
                                <button
                                    onClick={() => { getUserLinks() }}
                                    className="px-1 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    <RotateCcw />
                                </button>
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition"
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
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => { deleteCode(item.code) }}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <X width='20' height='20' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (<>
                            <tr>
                                <td className="p-4">
                                    <div className="h-4 w-32 bg-gray-300 animate-pulse rounded" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 w-20 bg-gray-300 animate-pulse rounded" />
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4">
                                    <div className="h-4 w-40 bg-gray-300 animate-pulse rounded" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 w-28 bg-gray-300 animate-pulse rounded" />
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4">
                                    <div className="h-4 w-24 bg-gray-300 animate-pulse rounded" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 w-36 bg-gray-300 animate-pulse rounded" />
                                </td>
                            </tr>

                        </>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserLinks;