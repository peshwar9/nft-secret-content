const { Network, Alchemy } = require('alchemy-sdk');

const BAYC_CONTRACT_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'; // Replace with the actual BAYC contract address
const USER_ADDRESS = '0x441c5d77Fb66C185235844A1036e02b8C425D7E3'; // Replace with the user's actual address
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; // Replace with your Alchemy API key

const checkAccess = async () => {
  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  try {
    const nfts = await alchemy.nft.verifyNftOwnership(USER_ADDRESS, [BAYC_CONTRACT_ADDRESS]);
    console.log('NFTs:', nfts);
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAccess();
