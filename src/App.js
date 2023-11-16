import React, { useState } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';

const musicFiles = [
  {
    title: 'Clock alarm',
    source: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  },
  {
    title: 'Crowd celebrating',
    source: 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg',
  },
];

const App = () => {
  const [userAddress, setUserAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [error, setError] = useState('');

  const checkAccess = async () => {
    try {
      if (!userAddress || !collectionAddress) {
        setError('Please enter both wallet address and NFT collection address.');
        return;
      }

      setError('');

      const settings = {
        apiKey: process.env.ALCHEMY_API_KEY,
        network: Network.ETH_MAINNET,
      };
      const alchemy = new Alchemy(settings);

      // Check NFT ownership
      const nfts = await alchemy.nft.verifyNftOwnership(
        userAddress,
        [collectionAddress]
      );

      // Check if the user owns NFTs from the provided collection address
      const userOwnsNFTs = nfts[collectionAddress];

      // Set user access based on NFT ownership
      setUserHasAccess(userOwnsNFTs);
    } catch (error) {
      console.error(error);
      // If there's an error or user doesn't have access, set access to false
      setUserHasAccess(false);
    }
  };

  const handleEntry = () => {
    checkAccess();
  };

  const handleDisconnect = () => {
    // Reset access to false when disconnecting
    setUserHasAccess(false);
    // Clear the user and collection addresses
    setUserAddress('');
    setCollectionAddress('');
    // Clear any previous errors
    setError('');
  };

  return (
    <div>
      <h1>Welcome to the Exclusive Music Collection for NFT holders</h1>
      {!userHasAccess && (
        <div>
          <p>Enter your wallet address and NFT collection address to access the content:</p>
          <input
            type="text"
            placeholder="Your Wallet Address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="NFT Collection Address"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
          />
          <button onClick={handleEntry}>Enter</button>
          {error && <div>{error}</div>}
        </div>
      )}
      {userHasAccess && (
        <div>
          <h2>Access Granted!</h2>
          <button onClick={handleDisconnect}>Disconnect</button>
          <ul>
            {musicFiles.map((file, index) => (
              <li key={index}>
                <p>{file.title}</p>
                <audio controls>
                  <source src={file.source} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
