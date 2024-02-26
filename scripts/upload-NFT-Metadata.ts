import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const JWT = '<piñata-jwt-token>';

const metadataJSONs = [
  '1-NFTMetadata-code.json',
  '2-NFTMetadata-classic.json',
  '3-NFTMetadata-creative.json',
  '4-NFTMetadata-gold.json',
  '5-NFTMetadata-minimal.json',
  '6-NFTMetadata-nature.json',
];

const pinFileToIPFS = async () => {
  metadataJSONs.forEach(async (metadataJsonFile) => {
    const formData = new FormData();
    const src = './scripts/assets/' + metadataJsonFile;

    const file = fs.createReadStream(src);
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: 'LUKSO LSP8 NFT Proof of Attendance JSON Metadata',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    try {
      const metadata = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          //   maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            Authorization: `Bearer ${JWT}`,
          },
        },
      );
      console.log(`Uploaded JSON metadata ${metadataJsonFile} on IPFS successfully! ⬇️`);
      console.log(metadata.data);
    } catch (error) {
      console.log(error);
    }
  });
};
pinFileToIPFS();
