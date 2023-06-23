const express = require('express');
const router = express.Router();

const {
  compileAndDeployBigEyes,
  compileAndDeployNeoCypherPunk,
  compileAndDeployJeju,
  compileAndDeployPepeToken,
  compileAndDeployDejitaruTsuka,
  contractArtifacts
} = require('../utils/deploy');

// Route: POST /deploy/bigeyes
router.post('/bigeyes', async (req, res) => {
  const { contractName, templateName, name, symbol, decimals, totalSupply, privateKey } = req.body;
  console.log(req.body,"data from frontend");
  try {
    const { address } = await compileAndDeployBigEyes(contractName, templateName, name, symbol, decimals, totalSupply, privateKey);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});

router.post('/neocypherpunk', async (req, res) => {
  const { contractName, templateName, router, name, symbol, privateKey } = req.body;

  try {
    const { address } = await compileAndDeployNeoCypherPunk(contractName, templateName, router, name, symbol, privateKey);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});

router.post('/jeju', async (req, res) => {
  const { contractName, templateName, router, name, symbol, privateKey } = req.body;

  try {
    const { address } = await compileAndDeployJeju(contractName, templateName, router, name, symbol, privateKey);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});

router.post('/pepetoken', async (req, res) => {
  const { contractName, templateName, name, symbol, totalSupply, privateKey } = req.body;
  try {
    const { address } = await compileAndDeployPepeToken(contractName, templateName, name, symbol, totalSupply, privateKey);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});

router.post('/dejitarutsuka', async (req, res) => {
  const { contractName, templateName, router, name, symbol, decimals, totalSupply, privateKey } = req.body;
  try {
    const { address } = await compileAndDeployDejitaruTsuka(contractName, templateName, router, name, symbol, decimals, totalSupply, privateKey);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Contract deployment failed' });
  }
});



// Add more routes here if needed

module.exports = router;
