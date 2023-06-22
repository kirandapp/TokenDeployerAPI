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
const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('TOKEN DEPLOYER PLATFORM');
});

app.use(express.json());

const contractCache = {}; // Object to store contract source code
const artifactsCache = {}; // Object to store contract artifacts
const contractArtifacts = {};
// app.post('/api/deploy-bigeyes', async (req, res) => {

app.post('/api/deploy-bigeyes', async (req, res) => {
  const { contractName, templateName, name, symbol, decimals, totalSupply, privateKey } = req.body;

  // Check if contract artifacts already exist
  if (contractArtifacts[contractName]) {
    // Use existing contract artifacts for deployment
    try {
      const { address } = contractArtifacts[contractName];
      res.json({ address });
    } catch (error) {
      res.status(500).json({ error: 'Contract deployment failed' });
    }
  } else {
    // Compile and deploy the contract
    try {
      const { address } = await compileAndDeployContract(contractName, templateName, name, symbol, decimals, totalSupply, privateKey);
      res.json({ address });
    } catch (error) {
      res.status(500).json({ error: 'Contract deployment failed' });
    }
  }
});

const compileAndDeployContract = (contractName, templateName, name, symbol, decimals, totalSupply, privateKey) => {
  return new Promise(async (resolve, reject) => {
    // Read the template contract
    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');

    // Replace the placeholder with the user-provided name in the contract template
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    // Check if the replacement occurred successfully
    if (updatedContractSource === contractTemplate) {
      return reject({ error: "Placeholder 'CONTRACTNAME' not found in the contract template." });
    }

    // Check if contract artifacts are already cached
    if (contractArtifacts[contractName]) {
      try {
        const { address } = await deployContract(contractArtifacts[contractName].bytecode, contractArtifacts[contractName].abi, name, symbol, decimals, totalSupply, privateKey);
        resolve({ address });
      } catch (error) {
        reject({ error: 'Contract deployment failed' });
      }
    } else {
      // Compile the updated contract
      const input = {
        language: 'Solidity',
        sources: {
          [`${contractName}.sol`]: {
            content: updatedContractSource,
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
          return reject({ error: 'Contract compilation failed' });
        }
      }

      const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
      const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

      try {
        const address = await deployContract(contractBytecode, contractAbi, name, symbol, decimals, totalSupply, privateKey);
        // Cache the contract artifacts for future use
        contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };
        resolve({ address });
      } catch (error) {
        reject({ error: 'Contract deployment failed' });
      }
    }
  });
};

const deployContract = (bytecode, abi, name, symbol, decimals, totalSupply, privateKey) => {
  return new Promise(async (resolve, reject) => {
    const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [name, symbol, decimals, totalSupply],
    };

    try {
      const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
      const gasPrice = await web3.eth.getGasPrice();
      const deployment = contract.deploy(deployOptions).send({
        from: account.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
      });

      console.log("Before calling deploy function");
      const deployedContract = await deployment;
      console.log('Contract deployed at address:', deployedContract.options.address);
      resolve({ address: deployedContract.options.address });
    } catch (error) {
      console.error(error);
      reject('Contract deployment failed');
    }
  });
};

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
