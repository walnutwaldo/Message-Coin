const hre = require("hardhat");
const jsonfile = require('jsonfile');

const MESSAGE_COIN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MESSAGE_COIN_ABI = jsonfile.readFileSync("artifacts/contracts/MessageCoin.sol/MessageCoin.json").abi;

async function sendMessageAtTime(contract, to, message, timeDelay) {
    await hre.network.provider.send("evm_increaseTime", [timeDelay])

    const res = await contract.sendMessage(to, message);
    console.log(`sent message to ${to}`);
}

async function main() {
    const [signer, account2, account3] = await hre.ethers.getSigners();
    const contract = new hre.ethers.Contract(MESSAGE_COIN_ADDRESS, MESSAGE_COIN_ABI, signer);

    await sendMessageAtTime(contract, account2.address, "New Message.", 24 * 60 * 60);
    // await sendMessageAtTime(contract, account2.address, "Hey are you going to respond to me?", 15 * 24 * 60 * 60);
    // await sendMessageAtTime(contract, account2.address, "This is a test", 15 * 24 * 60 * 60);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
