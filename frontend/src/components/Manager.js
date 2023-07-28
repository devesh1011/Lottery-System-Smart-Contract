import React, { useState, useEffect } from 'react'
import { Web3 } from 'web3'

const Manager = ({ state }) => {

  const [account, setAccount] = useState('Not Connected');
  const [balance, setBalance] = useState(0);
  const [winner, setWinner] = useState('No Winner Yet');

  const setAccountListener = (provider) => {
    provider.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });
  }

  useEffect(() => {
    const getAccount = async () => {
      const { web3 } = state;
      const accoounts = await web3.eth.getAccounts();
      setAccountListener(web3.provider);
      setAccount(accoounts[0]);
    }

    state.web3 && getAccount();
  }, [state.web3, state]);

  const contractBalance = async () => {
    const { contract } = state;

    try {
      const balance = await contract.methods.getBalance().call({ from: account });
      console.log(balance);
      setBalance(Web3.utils.fromWei(balance, 'ether'));
    } catch {
      alert('You are not the manager');
    }
  }

  const getWinner = async () => {
    const { contract } = state;

    try {
      await contract.methods.selectWinner().send({ from: account });

      const lotteryWinner = await contract.methods.winner().call();
      setWinner(lotteryWinner);
    } catch (e) {

      if (e.message.includes("You are not the manager")) {
        setWinner('You are not the manager');
      } else if (e.message.includes("There must be atleast 3 players")) {
        setWinner('There must be atleast 3 players');
      } else {
        setWinner('No Winner Yet');
      }
    }
  }

  return (
    <>
      <div className="container">
        <div className="header-text">
          <h1 className='my-4'>Manager</h1>
        </div>
        <h4>Connected Account: </h4>
        <p>{account}</p>
        <hr />

        <h4>Winner: </h4>
        <p>{winner ? winner : "No winner yet"}</p>
        <button className='btn btn-secondary' onClick={getWinner}>Click for Winner</button>
        <hr />
        <h4>Contract Balance:</h4>
        <p>{`${balance} ETH `} </p>
        <button className='btn btn-secondary' onClick={contractBalance}>Click for Balance</button>
      </div>
    </>
  )
}

export default Manager
