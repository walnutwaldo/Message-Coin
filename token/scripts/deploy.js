const hre = require("hardhat");

async function main() {
    const [signer] = await hre.ethers.getSigners();

    const factory = await hre.ethers.getContractFactory("MessageCoin");
    const contract = await factory.deploy("messagecoin.app", "MXG");
    await contract.deployed();

    console.log("Message Coin deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
