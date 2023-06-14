const express = require('express');
const app = express();
const fs = require('fs');
const Web3 = require('web3').Web3;
const solc = require('solc');
const path = require('path');

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hi');
});

app.use(express.json());

app.post('/deploy-contract', async (req, res) => {
  const { contractName, templateName, router, name, symbol, decimals, totalSupply, privateKey } = req.body;

  // Read the template contract
  const contractTemplate = fs.readFileSync(`./Templates/${templateName}.sol`, 'utf8');

  // Replace the placeholder with the user-provided name in the contract template
  const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

  // Check if the replacement occurred successfully
  if (updatedContractSource === contractTemplate) {
    return res.status(400).json({ error: "Placeholder 'CONTRACTNAME' not found in the contract template." });
  }

  // Write the updated contract to a temporary file
  fs.writeFileSync(`./Generated/${contractName}.sol`, updatedContractSource, 'utf8');

  // Compile the updated contract
  const contractSourceCode = fs.readFileSync(`./Generated/${contractName}.sol`, 'utf8');
  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: {
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

  // Check for compilation errors
  if (output.errors && output.errors.length > 0) {
    const errors = output.errors.filter(error => String(error).includes('Error'));
    if (errors.length > 0) {
      console.error('Contract compilation failed:');
      errors.forEach((error) => {
        console.error(error);
      });
      return res.status(400).json({ error: 'Contract compilation failed' });
    }
  }

  const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
  const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

  const artifactsFolderPath = path.join(__dirname, '..', 'artifacts');
  if (!fs.existsSync(artifactsFolderPath)) {
    fs.mkdirSync(artifactsFolderPath);
  }

  const artifacts = {
    contractName,
    bytecode: contractBytecode,
    abi: contractAbi,
  };
  fs.writeFileSync(path.join(artifactsFolderPath, `${contractName}.json`), JSON.stringify(artifacts, null, 2));
  console.log('\nContract compiled successfully.\n');

  const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const web3 = new Web3(providerUrl);

  const contract = new web3.eth.Contract(contractAbi);
  web3.eth.accounts.wallet.add(privateKey);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const deployOptions = {
    data: '0x' + contractBytecode,
    arguments: [router, name, symbol, decimals, totalSupply],
  };

  try {
    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const deployment = contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    const deployedContract = await deployment;
    console.log('Contract deployed at address:', deployedContract.options.address);
    res.json({ address: deployedContract.options.address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});

app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});

/*
{
    "contractName": "DEJITARU_1",
    "templateName": "DejitaruTsuka",
    "router" : "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    "name": "Dejitaru Tsuka",
    "symbol": "$TSUKA",
    "decimals": 9,
    "totalSupply": "200000000000000000000000000000",
    "privateKey" : ""
}
*/
