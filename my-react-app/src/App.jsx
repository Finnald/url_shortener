import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react'
import Header from './components/Header.jsx'
import AddLink from './components/LinkCreation.jsx'
import PublicLinks from './components/PublicLinks.jsx'


function App() {

	const [data, setData] = useState(null);
	const { isSignedIn, user, isLoaded } = useUser()


	// will implement nicer later
	useEffect(() => {
		getPublicLinks()

	}, []);



	function getPublicLinks() {
		setData(null);
		fetch('http://localhost:5231/all')
			.then(response => response.json())
			.then(json => setData(json))
			.catch(error => console.error(error));
	}



	return (

		<div className="min-h-screen flex my-15 justify-center bg-gray-100 p-6">



			<Header></Header>



			<div className="w-full max-w-2xl">

				{/* Box 1 — Welcome */}
				<div className="p-6 text-3xl font-bold">
					{user && <p>Greetings {user.username}</p>}
				</div>


				<AddLink getPublicLinks={getPublicLinks}></AddLink>

				<PublicLinks data={data} getPublicLinks={getPublicLinks}></PublicLinks>
			</div>
		</div>
	);



}

export default App;