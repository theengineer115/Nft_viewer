import { ethers } from 'ethers';
import * as infura from '@infura/sdk';

interface NftOwnershipData {
  [tokenId: string]: string;
}

class NftViewer {
  private infuraProjectId: string;
  private infuraApiKey: string;
  private provider: ethers.providers.InfuraProvider;
  private nftContractAddress: string;
  private erc721Abi: ethers.utils.Interface;

  constructor(infuraProjectId: string, infuraApiKey: string, nftContractAddress: string) {
    this.infuraProjectId = infuraProjectId;
    this.infuraApiKey = infuraApiKey;
    this.nftContractAddress = nftContractAddress;
    this.provider = new ethers.providers.InfuraProvider(infuraProjectId, infuraApiKey);
    this.erc721Abi = new ethers.utils.Interface([
      'function balanceOf(address owner) public view returns (uint256)',
      'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
    ]);
  }

  async getNftOwnershipData(address: string): Promise<NftOwnershipData> {
    try {
      const nftContract = new ethers.Contract(this.nftContractAddress, this.erc721Abi, this.provider);
      const balance = await nftContract.balanceOf(address);
      const ownershipData: NftOwnershipData = {};

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        ownershipData[tokenId.toString()] = address;
      }

      return ownershipData;
    } catch (error) {
      console.error(`Error getting NFT ownership data: ${error.message}`);
      throw error;
    }
  }
}

export default NftViewer;
