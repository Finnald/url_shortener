import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx'
import AddLink from './components/LinkCreation.jsx'
import LinkTable from './components/LinkTable.jsx'
import { Show, SignInButton, SignUpButton, UserButton, useUser, useAuth } from '@clerk/react'


function App() {



	const [data, setData] = useState(null);
	const [userData, setUserData] = useState(null);
	const { userId, sessionId, getToken, isLoaded, isSignedIn, username } = useAuth()
	const { user } = useUser()
	const [selectedView, setSelectedView] = useState(
		isSignedIn ? "user" : "public"
	);

	// will implement nicer later
	useEffect(() => {

		getPublicLinks()

		getUserLinks()


	}, []);



	async function getPublicLinks() {
		setData(null);
		await fetch('http://localhost:5231/all')
			.then(response => response.json())
			.then(json => setData(json))
			.catch(error => console.error(error));
	}

	async function getUserLinks() {
		if (isSignedIn) {
			const token = await getToken();
			var id = userId
			console.log(id)
			setUserData(null)
			await fetch(`http://localhost:5231/getLinks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
				.then(response => response.json())
				.then(json => setUserData(json))
				.catch(error => console.error(error));
		}
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

				{/* Welcome */}
				<div className="p-6 text-3xl font-bold">
					{userId && <p>Greetings {user.username}</p>}
				</div>

				{/* Add Link box */}
				<AddLink getPublicLinks={getPublicLinks} getUserLinks={getUserLinks} userId={userId}></AddLink>



				<div>

					{/* Side-by-side selector */}
					<div className="flex gap-4 mt-8 text-lg font-medium">

						{/* Public Links */}
						<div
							onClick={() => setSelectedView("public")}
							className={`
                    			cursor-pointer pb-1
                    			${selectedView === "public" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}
							`}
						>
							Public Links
						</div>

						{/* Your Links (only if signed in) */}
						{isSignedIn && (
							<div
								onClick={() => setSelectedView("user")}
								className={`
									cursor-pointer pb-1
									${selectedView === "user" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}
								`}
							>
								Your Links
							</div>
						)}

					</div>

					{/* Render selected table */}
					{selectedView === "public" && (
						<LinkTable
							data={data}
							getLinks={getPublicLinks}
						/>
					)}

					{selectedView === "user" && isSignedIn && (
						<LinkTable
							data={userData}
							getLinks={getUserLinks}
						/>
					)}

				</div>

			</div>
		</div>
	);



}

export default App;