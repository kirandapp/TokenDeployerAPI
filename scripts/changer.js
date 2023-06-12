const fs = require('fs');
const Web3 = require('web3').Web3
const solc = require('solc');
const path = require('path');

async function deployContract(tokenName) {

  // Read the template contract
  const contractTemplate = fs.readFileSync('./contracts/BigEyes.sol', 'utf8');

  // Replace the placeholder with the user-provided name in the contract template
  const updatedContractSource = contractTemplate.replace('CONTRACTNAME', tokenName);

  // Check if the replacement occurred successfully
  if (updatedContractSource === contractTemplate) {
    throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
  }

  // Write the updated contract to a temporary file
  fs.writeFileSync(`./contracts/${tokenName}.sol`, updatedContractSource, 'utf8');

  // Compile the updated contract
  const contractSourceCode = fs.readFileSync(`./contracts/${tokenName}.sol`, 'utf8');
  const input = {
    language: 'Solidity',
    sources: {
      [`${tokenName}.sol`]: {
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
  const contractName = tokenName;
  console.log("contractName", contractName);

  const contractBytecode = output.contracts[`${tokenName}.sol`][contractName].evm.bytecode.object;
  // console.log("contractBytecode", contractBytecode);

  const contractAbi = JSON.parse(output.contracts[`${tokenName}.sol`][contractName].metadata).output.abi;
  // console.log("contractAbi", contractAbi);


  const artifactsFolderPath = path.join(__dirname, '..', 'artifacts');
  if (!fs.existsSync(artifactsFolderPath)) {
    fs.mkdirSync(artifactsFolderPath);
  }

  const artifacts = {
    contractName,
    bytecode: contractBytecode,
    abi: contractAbi,
  };
  fs.writeFileSync(path.join(artifactsFolderPath, `${tokenName}.json`), JSON.stringify(artifacts, null, 2));
  console.log('\nContract compiled successfully.\n');


  // Deploy the contract
  const providerUrl = 'https://ftm.getblock.io/7176162d-8e17-43dc-a78a-2837fcc423d3/testnet/';
  // const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  const web3 = new Web3(providerUrl);
  const privateKey = '0x668af6677a1198e3c6f9d7ba24385d17e78e8f32a1faa116f6f61df19e3f4067';

  const contract = new web3.eth.Contract(contractAbi);
  web3.eth.accounts.wallet.add(privateKey);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//param
const _name = "Big Eyes";
const _symbol = "$BIG";
const _decimals = 18;
const _totalSupply = "200000000000000000000000000000";

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

async function main() {
  const tokenName = 'TEST_1';

  try {
    // Deploy the contract
    await deployContract(tokenName);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
