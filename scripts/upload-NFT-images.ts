import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const JWT = 'your-piñata-jwt-token';

const imageFiles = [
  '1-nft-icon-code.webp',
  '2-nft-icon-classic.webp',
  '3-nft-icon-creative.webp',
  '4-nft-icon-gold.webp',
  '5-nft-icon-minimal.webp',
  '6-nft-icon-nature.webp',
];

const uploadImagesTOIPFS = async () => {
  imageFiles.forEach(async (image) => {
    const formData = new FormData();
    const src = './scripts/img/' + image;

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
      const image = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        //   maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `Bearer ${JWT}`,
        },
      });
      console.log(`Uploaded image ${image} on IPFS successfully! --> ${image.data}`);
    } catch (error) {
      console.log(error);
    }
  });
};
uploadImagesTOIPFS();
