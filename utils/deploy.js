const fs = require('fs');
const Web3 = require('web3').Web3;
const solc = require('solc');
const path = require('path');

const contractArtifacts = {};
const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const compileAndDeployBigEyes = async (contractName, templateName, name, symbol, decimals, totalSupply, privateKey) => {
  try {
    if (contractArtifacts[contractName]) {
      const { address } = contractArtifacts[contractName];
      return { address };
    }

    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    if (updatedContractSource === contractTemplate) {
      throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
    }

    const output = compileContract(updatedContractSource, contractName);

    const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
    const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

    const address = await deployBigEyes(contractBytecode, contractAbi, name, symbol, decimals, totalSupply, privateKey);

    contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };

    return { address };
  } catch (error) {
    throw new Error('Contract deployment failed');
  }
};

const deployBigEyes = async (bytecode, abi, name, symbol, decimals, totalSupply, privateKey) => {
  try {
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [name, symbol, decimals, totalSupply],
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const deployedContract = await contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error(error);
    throw new Error('Contract deployment failed');
  }
};

const compileAndDeployNeoCypherPunk = async (contractName, templateName, router, name, symbol, privateKey) => {
  try {
    if (contractArtifacts[contractName]) {
      const { address } = contractArtifacts[contractName];
      return { address };
    }

    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    if (updatedContractSource === contractTemplate) {
      throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
    }

    const output = compileContract(updatedContractSource, contractName);

    const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
    const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

    const address = await deployNeoCypherPunk(contractBytecode, contractAbi, router, name, symbol, privateKey);

    contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };

    return { address };
  } catch (error) {
    throw new Error('Contract deployment failed');
  }
};

const deployNeoCypherPunk = async (bytecode, abi, router, name, symbol, privateKey) => {
  try {
    
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [router, name, symbol],
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const deployedContract = await contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error(error);
    throw new Error('Contract deployment failed');
  }
};

const compileAndDeployJeju = async (contractName, templateName, router, name, symbol, privateKey) => {
  try {
    if (contractArtifacts[contractName]) {
      const { address } = contractArtifacts[contractName];
      return { address };
    }

    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    if (updatedContractSource === contractTemplate) {
      throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
    }

    const output = compileContract(updatedContractSource, contractName);

    const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
    const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

    const address = await deployJeju(contractBytecode, contractAbi, router, name, symbol, privateKey);

    contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };

    return { address };
  } catch (error) {
    throw new Error('Contract deployment failed');
  }
};

const deployJeju = async (bytecode, abi, router, name, symbol, privateKey) => {
  try {
    
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [router, name, symbol],
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const deployedContract = await contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error(error);
    throw new Error('Contract deployment failed');
  }
};

const compileAndDeployPepeToken = async (contractName, templateName, name, symbol, totalSupply, privateKey) => {
  try {
    if (contractArtifacts[contractName]) {
      const { address } = contractArtifacts[contractName];
      return { address };
    }

    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    if (updatedContractSource === contractTemplate) {
      throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
    }

    const output = compileContract(updatedContractSource, contractName);

    const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
    const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

    const address = await deployPepeToken(contractBytecode, contractAbi, name, symbol, totalSupply, privateKey);

    contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };

    return { address };
  } catch (error) {
    throw new Error('Contract deployment failed');
  }
};

const deployPepeToken = async (bytecode, abi, name, symbol, totalSupply, privateKey) => {
  try {
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [name, symbol, totalSupply,],
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const deployedContract = await contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error(error);
    throw new Error('Contract deployment failed');
  }
};

const compileAndDeployDejitaruTsuka = async (contractName, templateName, router, name, symbol, decimals, totalSupply, privateKey) => {
  try {
    if (contractArtifacts[contractName]) {
      const { address } = contractArtifacts[contractName];
      return { address };
    }

    const contractTemplate = fs.readFileSync(path.join(__dirname, '..', 'Templates', `${templateName}.sol`), 'utf8');
    const updatedContractSource = contractTemplate.replace('CONTRACTNAME', contractName);

    if (updatedContractSource === contractTemplate) {
      throw new Error("Placeholder 'CONTRACTNAME' not found in the contract template.");
    }

    const output = compileContract(updatedContractSource, contractName);

    const contractBytecode = output.contracts[`${contractName}.sol`][`${contractName}`].evm.bytecode.object;
    const contractAbi = JSON.parse(output.contracts[`${contractName}.sol`][`${contractName}`].metadata).output.abi;

    const address = await deployDejitaruTsuka(contractBytecode, contractAbi, router, name, symbol, decimals, totalSupply, privateKey);

    contractArtifacts[contractName] = { bytecode: contractBytecode, abi: contractAbi, address };

    return { address };
  } catch (error) {
    throw new Error(`${contractName} deployment failed`);
  }
};

const deployDejitaruTsuka = async (bytecode, abi, router, name, symbol, decimals, totalSupply, privateKey) => {
  try {
    const web3 = new Web3(providerUrl);

    const contract = new web3.eth.Contract(abi);
    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const deployOptions = {
      data: '0x' + bytecode,
      arguments: [router, name, symbol, decimals, totalSupply],
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const deployedContract = await contract.deploy(deployOptions).send({
      from: account.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error(error);
    throw new Error('Contract deployment failed');
  }
};

const compileContract = (contractSource, contractName) => {
  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: {
        content: contractSource,
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

  if (output.errors && output.errors.length > 0) {
    const errors = output.errors.filter((error) => String(error).includes('Error'));
    if (errors.length > 0) {
      console.error('Contract compilation failed:');
      errors.forEach((error) => {
        console.error(error);
      });
      throw new Error('Contract compilation failed');
    }
  }

  return output;
};

module.exports = {
  compileAndDeployBigEyes,
  compileAndDeployNeoCypherPunk,
  compileAndDeployJeju,
  compileAndDeployPepeToken,
  compileAndDeployDejitaruTsuka,
  contractArtifacts
};
