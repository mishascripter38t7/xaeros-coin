const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '', difficulty = 2) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce + this.difficulty)
            .digest('hex');
    }

    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        console.log(`⛏️ Майнинг блока #${this.index} (сложность: ${difficulty})...`);
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`✅ Блок #${this.index} добыт! Хэш: ${this.hash}`);
    }
}

class XaerosChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Сначала легко
        this.blockInterval = 5; // Каждые 5 блоков сложность растет
    }

    createGenesisBlock() {
        return new Block(0, Date.parse("2026-10-31"), "Genesis Block: Xaeroscoin Initialized", "0", 1);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.difficulty = this.difficulty;
        newBlock.mineBlock(this.difficulty);
        
        this.chain.push(newBlock);

        if (this.chain.length % this.blockInterval === 0) {
            this.difficulty++;
            console.log(`📈 СЛОЖНОСТЬ СЕТИ ВЫРОСЛА! Новая сложность: ${this.difficulty}`);
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

module.exports = { Block, XaerosChain };
