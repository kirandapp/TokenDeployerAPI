const fs = require('fs');
const solc = require('solc');
const path = require('path');

const contractSourceCode = fs.readFileSync('./contracts/Storage.sol', 'utf8');

function compileContract() {
  // Compile the contract using solc
  const input = {
    language: 'Solidity',
    sources: {
      'Storage.sol': {
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

  // Get the contract bytecode and ABI from the compilation output
  const contractName = Object.keys(output.contracts['Storage.sol'])[0];
  const contractBytecode = output.contracts['Storage.sol'][contractName].evm.bytecode.object;
  const contractAbi = JSON.parse(output.contracts['Storage.sol'][contractName].metadata).output.abi;

  // Create the artifacts folder if it doesn't exist
  const artifactsFolderPath = path.join(__dirname, 'artifacts');
  if (!fs.existsSync(artifactsFolderPath)) {
    fs.mkdirSync(artifactsFolderPath);
  }

  // Save the contract artifacts
  const artifacts = {
    contractName,
    bytecode: contractBytecode,
    abi: contractAbi,
  };

  fs.writeFileSync(path.join(artifactsFolderPath, 'Storage.json'), JSON.stringify(artifacts, null, 2));

  console.log('Contract compiled successfully.');
}

compileContract();
