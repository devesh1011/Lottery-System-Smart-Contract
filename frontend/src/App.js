import React, { useState, useEffect } from "react";
import Manager from "./components/Manager";
import Lottery from './contracts/Lottery.json'
import getWeb3 from './getWeb3'
import Player from "./components/Player";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

const App = () => {
	const [state, setState] = useState({
		web3: null,
		contract: null,
	});

	const [address, setAddress] = useState("");

	useEffect(() => {
		const init = async () => {
			try {
				const web3 = await getWeb3();
				const networkId = await web3.eth.net.getId();

				const deployedNetwork = Lottery.networks[networkId];
				setAddress(deployedNetwork.address)
				const instance = new web3.eth.Contract(
					Lottery.abi,
					deployedNetwork && deployedNetwork.address
				);
				setState({ web3, contract: instance });
			} catch (error) {
				alert("Falied to load web3 or contract.");
				console.log(error);
			}
		};
		init();
	}, [])

	return (
		<>
			<BrowserRouter basename="/">
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/manager" element={<Manager state={state} />} />
					<Route exact path="/players" element={<Player state={state} address={address} />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;