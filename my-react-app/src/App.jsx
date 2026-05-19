import React, { useState, useEffect } from 'react';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'
import { RotateCcw, X } from 'lucide-react'


function App() {

	const [data, setData] = useState(null);
	const [link, setLink] = useState('');
	const { isSignedIn, user, isLoaded } = useUser()


	// will implement nicer later
	useEffect(() => {
		getPublicLinks()

	}, []);

	async function addUrl(link) {
		// should work for later
		await fetch(`http://localhost:5231/addCode/${link}`, { method: 'POST' })

		setLink("")

		getPublicLinks()
	}

	function getPublicLinks() {
		console.log("reste")
		setData(null);
		fetch('http://localhost:5231/all')
			.then(response => response.json())
			.then(json => setData(json))
			.catch(error => console.error(error));
	}

	return (

		<div className="min-h-screen flex my-15 justify-center bg-gray-100 p-6">



			<header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
				{/* Logo / Title */}
				<h1 className="text-lg font-semibold text-gray-800">
					smollink
				</h1>

				{/* Auth Section */}
				<div className="flex items-center gap-3">
					<Show when="signed-out">
						<SignInButton mode="modal">
							<button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm">
								Sign In
							</button>
						</SignInButton>

						<SignUpButton mode="modal">
							<button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition text-sm">
								Sign Up
							</button>
						</SignUpButton>
					</Show>

					<Show when="signed-in">
						<UserButton afterSignOutUrl="/" />
					</Show>
				</div>
			</header>



			<div className="w-full max-w-2xl">

				{/* Box 1 — Welcome */}
				<div className="p-6 text-3xl font-bold">
					{user && <p>Greetings {user.username}</p>}
				</div>


				{/* Box 2 — Add Link */}
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

				{/* Box 3 — Link List */}
				<div className="p-6">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Public Links
					</h2>

					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
									<th className="p-3 text-left">Full Link</th>
									<th className="p-3 text-left">Short Link</th>
									<th className="p-3 text-right">
										<button
											onClick={() => { getPublicLinks() }}
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
											<td className="flex justify-center py-2">
												<button
													onClick={() => { getPublicLinks() }}
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
			</div>
		</div>
	);



}

export default App;