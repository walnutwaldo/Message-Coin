const hre = require("hardhat");
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'to', alias: 'd', type: String },
    { name: 'amount', alias: 'q', type: Number}
]

const options = commandLineArgs(optionDefinitions)

async function main() {
    const [signer] = await hre.ethers.getSigners();
    const data = {
        to: options['to'],
        value: options['value']
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
