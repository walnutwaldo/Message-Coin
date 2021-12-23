import MessageCoinContract from '../contracts/MessageCoin.json';

export const MESSAGE_COIN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MESSAGE_COIN_ABI = MessageCoinContract.abi;