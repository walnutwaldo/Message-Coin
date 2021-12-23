const hre = require("hardhat");
const jsonfile = require('jsonfile');

const MESSAGE_COIN_ADDRESS = "0xDd3b6fD2C80fCF7352C5B181c620cD773B9f3928";
const MESSAGE_COIN_ABI = jsonfile.readFileSync("artifacts/contracts/MessageCoin.sol/MessageCoin.json").abi;

async function sendMessageCoins(contract, address, amt) {
    await contract.transfer(address, amt);
    console.log(`Send ${amt} Message Coins to ${address}.`);
}

async function main() {
    const [signer, account2] = await hre.ethers.getSigners();
    const contract = new hre.ethers.Contract(MESSAGE_COIN_ADDRESS, MESSAGE_COIN_ABI, signer);

    console.log(`Owner of Message Coin is ${await contract.owner()}`);
    console.log(`Balance of ${signer.address} is ${await contract.balanceOf(signer.address)}`);

    // console.log(`Signer balance is ${await signer.getBalance() / (10.0 ** 18)} ETH`);
    await sendMessageCoins(contract, account2.address, 100);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
