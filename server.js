const express = require('express');
const { Block, XaerosChain } = require('./blockchain');

const app = express();
app.use(express.json());

const xaerosCoin = new XaerosChain();

app.get('/chain', (req, res) => {
    res.json(xaerosCoin.chain);
});

app.post('/mine', (req, res) => {
    const { minerAddress, reward } = req.body;
    
    const newBlockIndex = xaerosCoin.chain.length;
    const newBlock = new Block(newBlockIndex, Date.now(), { miner: minerAddress, reward: reward || 10 });
    
    xaerosCoin.addBlock(newBlock);
    
    res.json({
        message: "Блок успешно добавлен в блокчейн Xaeroscoin!",
        block: newBlock,
        currentDifficulty: xaerosCoin.difficulty
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Нода Xaeroscoin запущена на порту ${PORT}`);
});
