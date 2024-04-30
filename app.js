document.addEventListener('DOMContentLoaded', function() {
  const addressInput = document.getElementById('address-input');
  const getNftDataBtn = document.getElementById('get-nft-data-btn');
  const nftDataContainer = document.getElementById('nft-data-container');

  getNftDataBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const address = addressInput.value.trim();
    fetchNftData(address);
  });

  async function fetchNftData(address) {
    const response = await fetch(`/api/nfts?address=${encodeURIComponent(address)}`);
    if (response.ok) {
      const ownershipData = await response.json();
      displayNftData(ownershipData);
    } else {
      nftDataContainer.innerHTML = 'Failed to fetch NFT data.';
      console.error('Failed to fetch data:', response.statusText);
    }
  }

  function displayNftData(ownershipData) {
    const nftDataHtml = Object.keys(ownershipData).map(tokenId => {
      return `<p>Token ID: ${tokenId} - Owner: ${ownershipData[tokenId]}</p>`;
    }).join('');
    nftDataContainer.innerHTML = nftDataHtml;
  }
});
