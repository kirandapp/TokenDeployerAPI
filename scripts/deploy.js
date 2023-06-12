const fs = require('fs');
const Web3 = require('web3').Web3;

// Read the contract artifacts
const contractArtifacts = require('./artifacts/Storage.json');

const web3 = new Web3(`https://ftm.getblock.io/7176162d-8e17-43dc-a78a-2837fcc423d3/testnet/`);

async function deployContract() {
  const contract = new web3.eth.Contract(contractArtifacts.abi);

  const privateKey = `0x668af6677a1198e3c6f9d7ba24385d17e78e8f32a1faa116f6f61df19e3f4067`;
  web3.eth.accounts.wallet.add(privateKey);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const deployTransaction = contract.deploy({
    data: '0x' + contractArtifacts.bytecode,
  });

  const gasEstimate = await deployTransaction.estimateGas();
  const gasPrice = await web3.eth.getGasPrice();

  const deployment = deployTransaction.send({
    from: account.address,
    gas: gasEstimate,
    gasPrice: gasPrice,
  });

  const deployedContract = await deployment;
  console.log('Contract deployed at address:', deployedContract.options.address);
}

deployContract()
  .catch(console.error);
