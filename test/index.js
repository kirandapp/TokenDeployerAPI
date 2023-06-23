const express = require('express');
const app = express();
const port = process.env.PORT || 4080;
const cors = require('cors');

app.use(cors({
  origin:"*"
}));
app.get('/', (req, res) => {
  res.send('TOKEN DEPLOYER PLATFORM');
});

app.use(express.json());

// Import route handlers
const deployRoutes = require('../routes/deploy');

// Register route handlers
app.use('/deploy', deployRoutes);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
