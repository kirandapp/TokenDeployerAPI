// const fs = require('fs');
// const Web3 = require('web3').Web3;
// const solc = require('solc');
// const path = require('path');

// module.exports = (req, res) => {
//   if (req.method === 'GET') {
//     res.json({ message: 'GET method chl gya' });
//   } else if (req.method === 'POST') {
//     const { contractName, templateName, name, symbol, decimals, totalSupply, privateKey } = req.body;

//     // Read the template contract
//     const contractTemplate = fs.readFileSync(path.join(__dirname, 'Templates', `${templateName}.sol`), 'utf8');

//     // Replace the placeholder with the user-provided name in the contract template
//     const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

//     // Check if the replacement occurred successfully
//     if (updatedContractSource === contractTemplate) {
//       return res.status(400).json({ error: "Placeholder 'CONTRACTNAME' not found in the contract template." });
//     }

//     // Compile the updated contract
//     const input = {
//       language: 'Solidity',
//       sources: {
//         [`${contractName}.sol`]: {
//           content: updatedContractSource,
//         },
//       },
//       settings: {
//         outputSelection: {
//           '*': {
//             '*': ['*'],
//           },
//         },
//         optimizer: {
//           enabled: true,
//           runs: 200, // Set the number of optimization runs here
//         },
//       },
//     };

//     const output = JSON.parse(solc.compile(JSON.stringify(input)));

//     // Check for compilation errors
//     if (output.errors && output.errors.length > 0) {
//       const errors = output.errors.filter((error) => String(error).includes('Error'));
//       if (errors.length > 0) {
//         console.error('Contract compilation failed:');
//         errors.forEach((error) => {
//           console.error(error);
//         });
//         return res.status(400).json({ error: 'Contract compilation failed' });
//       }
//     }

//     const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
//     const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

//     const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
//     const web3 = new Web3(providerUrl);
//     const contract = new web3.eth.Contract(contractAbi);

//     web3.eth.accounts.wallet.add(privateKey);
//     const account = web3.eth.accounts.privateKeyToAccount(privateKey);

//     const deployOptions = {
//       data: '0x' + contractBytecode,
//       arguments: [name, symbol, decimals, totalSupply],
//     };

//     contract.deploy(deployOptions)
//       .estimateGas({ from: account.address })
//       .then((gasEstimate) => {
//         return Promise.all([Promise.resolve(gasEstimate), web3.eth.getGasPrice()]);
//       })
//       .then(([gasEstimate, gasPrice]) => {
//         return contract.deploy(deployOptions).send({
//           from: account.address,
//           gas: gasEstimate,
//           gasPrice: gasPrice,
//         });
//       })
//       .then((deployedContract) => {
//         console.log('Contract deployed at address:', deployedContract.options.address);
//         res.json({ address: deployedContract.options.address });
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).json({ error: 'Contract deployment failed' });
//       });
//   } else {
//     res.status(404).send('Not Found');
//   }
// };


const express = require('express');
const fs = require('fs');
const Web3 = require('web3').Web3;
const solc = require('solc');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.send('TOKEN DEPLOYER PLATFORM');
});

app.use(express.json());

const contractCache = {}; // Object to store contract source code
const artifactsCache = {}; // Object to store contract artifacts

app.post('/api/deploy-bigeyes', async (req, res) => {
  const { contractName, templateName, name, symbol, decimals, totalSupply, privateKey } = req.body;

  // Read the template contract
  const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');

  // Replace the placeholder with the user-provided name in the contract template
  const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

  // Check if the replacement occurred successfully
  if (updatedContractSource === contractTemplate) {
    return res.status(400).json({ error: "Placeholder 'CONTRACTNAME' not found in the contract template." });
  }

  // // Write the updated contract to a temporary file
  // fs.writeFileSync(path.join(__dirname, '..', 'Generated', `${contractName}.sol`), updatedContractSource, 'utf8');

  contractCache[contractName] = updatedContractSource;

  // // Compile the updated contract
  // const contractSourceCode = fs.readFileSync(path.join(__dirname, '..', 'Generated', `${contractName}.sol`), 'utf8');
  const contractSourceCode = contractCache[contractName];
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
    const errors = output.errors.filter((error) => String(error).includes('Error'));
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
  // fs.writeFileSync(path.join(artifactsFolderPath, `${contractName}.json`), JSON.stringify(artifacts, null, 2));
  artifactsCache[contractName] = artifacts;
  console.log('\nContract compiled successfully.\n');

  const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const web3 = new Web3(providerUrl);

  const contract = new web3.eth.Contract(contractAbi);
  web3.eth.accounts.wallet.add(privateKey);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const deployOptions = {
    data: '0x' + contractBytecode,
    arguments: [name, symbol, decimals, totalSupply],
  };

  (async () => {
    try {
      const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
      const gasPrice = await web3.eth.getGasPrice();
      const deployment = contract.deploy(deployOptions).send({
        from: account.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
      });

      console.log("Before calling deploy function");
      // let deployedContract = await deployment;
      const deployedContract = await deployment;
      console.log("waiting to deploy");
      const contractAddress = deployedContract.options.address;
      console.log('Contract deployed at address:', contractAddress);
      // res.json({ address: deployedContract.options.address });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Contract deployment failed' });
    }
  })();
});

app.post('/api/deploy-neocypherpunk', async (req, res) => {
  const { contractName, templateName, router, name, symbol, privateKey } = req.body;

  // Read the template contract
  const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'templates', `${templateName}.sol`), 'utf8');

  // Replace the placeholder with the user-provided name in the contract template
  const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

  // Check if the replacement occurred successfully
  if (updatedContractSource === contractTemplate) {
    return res.status(400).json({ error: "Placeholder 'CONTRACTNAME' not found in the contract template." });
  }

  // Write the updated contract to a temporary file
  fs.writeFileSync(path.join(__dirname, '..', 'generated', `${contractName}.sol`), updatedContractSource, 'utf8');

  // Compile the updated contract
  const contractSourceCode = fs.readFileSync(path.join(__dirname, '..', 'generated', `${contractName}.sol`), 'utf8');
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
    const errors = output.errors.filter((error) => String(error).includes('Error'));
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
    arguments: [router, name, symbol],
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
