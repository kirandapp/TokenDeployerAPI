const fs = require('fs');
const Web3 = require('web3').Web3
const solc = require('solc');
const path = require('path');

const contractname = "BigEyes_flattened";
const contractSourceCode = fs.readFileSync(`./contracts/${contractname}.sol`, 'utf8');

const web3 = new Web3(`https://ftm.getblock.io/7176162d-8e17-43dc-a78a-2837fcc423d3/testnet/`);
const privateKey = `0x668af6677a1198e3c6f9d7ba24385d17e78e8f32a1faa116f6f61df19e3f4067`;

 //param
 const _name = "Big Eyes";
 const _symbol = "$BIG";
 const _decimals = 18;
 const _totalSupply = "200000000000000000000000000000";

 async function compileAndDeployContract() {
  // Compile the contract using solc
  const input = {
    language: 'Solidity',
    sources: {
        [`${contractname}.sol`]: {
        content: contractSourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200, // Set the number of optimization runs here
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const contractName = "CONTRACTNAME";
  // const contractName = Object.keys(output.contracts[`${contractname}.sol`])[0];
  const contractBytecode = output.contracts[`${contractname}.sol`][contractName].evm.bytecode.object;
  const contractAbi = JSON.parse(output.contracts[`${contractname}.sol`][contractName].metadata).output.abi;
  // Create the artifacts folder if it doesn't exist
  const artifactsFolderPath = path.join(__dirname, '..', 'artifacts');
  if (!fs.existsSync(artifactsFolderPath)) {
    fs.mkdirSync(artifactsFolderPath);
  }

  // Save the contract artifacts
  const artifacts = {
    contractName,
    bytecode: contractBytecode,
    abi: contractAbi,
  };
  fs.writeFileSync(path.join(artifactsFolderPath, `${contractname}.json`), JSON.stringify(artifacts, null, 2));
  console.log('Contract compiled successfully.');

  const contract = new web3.eth.Contract(contractAbi);
///////////////////////////////// DEPLOY ///////////////////////
  
  web3.eth.accounts.wallet.add(privateKey);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

 

  const deployOptions = {
    data: '0x' + contractBytecode,
    arguments: [_name, _symbol, _decimals, _totalSupply],
  };
  const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();
  const deployment = contract.deploy(deployOptions)
    .send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

  const deployedContract = await deployment;
  console.log('Contract deployed at address:', deployedContract.options.address);
}
compileAndDeployContract()
  .catch(console.error);
  