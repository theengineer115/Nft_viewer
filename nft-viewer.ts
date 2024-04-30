import express from 'express';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import path from 'path';

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/nfts', async (req: express.Request, res: express.Response) => {
  const address = req.query.address as string;
  if (!address || !ethers.utils.isAddress(address)) {
    return res.status(400).send('Invalid Ethereum address');
  }

  try {
    const provider = new ethers.providers.InfuraProvider(process.env.INFURA_NETWORK, {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_API_KEY,
    });
    const nftContract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS!,
      [
        'function balanceOf(address owner) public view returns (uint256)',
        'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)'
      ],
      provider
    );
    
    const balance = await nftContract.balanceOf(address);
    const ownershipData: { [tokenId: string]: string } = {};

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
      ownershipData[tokenId.toString()] = address;
    }

    res.json(ownershipData);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send('Failed to fetch NFT data');
  }
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
