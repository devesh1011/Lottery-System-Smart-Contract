import React, { useEffect, useState } from 'react'

const Player = ({ state, address }) => {

    const [account, setAccount] = useState("No account connected");
    const [registeredPlayers, setRegisteredPlayers] = useState([]);

    const setAccountListener = (provider) => {
        provider.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
        });
    }

    useEffect(() => {
        const getAccount = async () => {
            const { web3 } = state;
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            setAccountListener(web3.provider);
        }

        state.web3 && getAccount();
    }, [state, state.web3]);

    useEffect(() => {
        const getPlayers = async () => {
            const { contract } = state;
            const players = await contract.methods.allParticipants().call();

            const registeredPlayers = await Promise.all(
                players.map((player) => {
                    return player;
                })
            )

            setRegisteredPlayers(registeredPlayers);
        }

        state.contract && getPlayers();
    }, [state, state.contract]);

    return (
        <>
            <div className="container">
                <div className="header-text">
                    <h1 className='my-4'>Players</h1>
                </div>

                <h4>Connected Account: </h4>
                <p>{account}</p>
                <hr />

                <p>Players pay 2 ether on this contract address: <strong>{address}</strong></p>

                {
                    registeredPlayers.length !== 0 ?
                        registeredPlayers.map((player) => {
                            return (
                                <div key={player} className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{player}</h5>
                                    </div>
                                </div>
                            )
                        }) : <p>No players yet</p>
                }
            </div>

        </>
    )
}

export default Player
