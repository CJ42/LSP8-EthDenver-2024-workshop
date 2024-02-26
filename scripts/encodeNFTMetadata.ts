import ERC725 from '@erc725/erc725.js';
import LSP4schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

const METADATA_LIST = [
  {
    jsonFile: './scripts/assets/1-NFTMetadata-code.json',
    ipfsUrl: 'ipfs://QmTq8tHEWwEh88oLwH8dkwP8w33ua1Z6nYk6Pi11KFzVK9',
  },
  {
    jsonFile: './scripts/assets/2-NFTMetadata-classic.json',
    ipfsUrl: 'ipfs://Qmba8hbQX4VDjjwg6NUQq3wzqw7Gb65KRM3BBGo96TPPXK',
  },
  {
    jsonFile: './scripts/assets/3-NFTMetadata-creative.json',
    ipfsUrl: 'ipfs://QmbM6PMujJzUirEYzKbTTvELSEhYGemjbWUiN9Y34SczcE',
  },
  {
    jsonFile: './scripts/assets/4-NFTMetadata-gold.json',
    ipfsUrl: 'ipfs://QmP9VdkG3RsBGWYhr9bZiwo7D2iBVSNxfMW2vLcB63KAoW',
  },
  {
    jsonFile: './scripts/assets/5-NFTMetadata-minimal.json',
    ipfsUrl: 'ipfs://QmeoGq8H6u9JEAe6m4MhN5jjSmoNJ82yZMD3DQkvxA8XKe',
  },
  {
    jsonFile: './scripts/assets/6-NFTMetadata-nature.json',
    ipfsUrl: 'ipfs://QmQLyLcb3ncAPCLfHynvc7ARo428cxziSSqiADW3p53coW',
  },
];

const erc725 = new ERC725(LSP4schema);

METADATA_LIST.forEach((metadata) => {
  const encodedMetadata = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: import(metadata.jsonFile),
        url: metadata.ipfsUrl,
      },
    },
  ]);

  const decodedMetadata = erc725.decodeData([
    {
      keyName: 'LSP4Metadata',
      value: encodedMetadata.values[0],
    },
  ]);

  console.log('processed encoding/decoding of metadata for ', metadata.jsonFile);
  console.log('encodedMetadata: ', encodedMetadata);
  console.log('decodedMetadata: ', decodedMetadata);
});
