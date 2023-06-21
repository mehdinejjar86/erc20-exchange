const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
  let token, accounts, deployer, receiver
  const name = 'Night^^Stalker'
  const symbol = 'N^^S'
  const decimals = '18'
  const totalSupply = tokens(1000000)

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy(name, symbol, totalSupply)
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
  })

  describe('Deployment', () => {
    it('has a correct name', async () => {
      expect(await token.name()).to.equal(name);
    })

    it('has a correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol);
    })

    it('has a correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals);
    })

    it('has a correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    })
    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    })
  })

  describe('Sending Tokens', () => {
    let amount, transaction, result

    describe('Success', () => {
      beforeEach(async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).transfer(receiver.address, amount)
        result = await transaction.wait()
      })

      it('Transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(amount)
      })

      it('Emits a transfer event', async () => {
        const event = result.events[0]
        expect(event.event).to.equal('Transfer')
        const args = event.args
        expect(args.from).to.equal(deployer.address)
        expect(args.to).to.equal(receiver.address)
        expect(args.value).to.equal(amount)
      })
    })

    describe('Rejects insufficient balances', () => {

      it('Rejects insufficient balances', async () => {
        await expect(token.connect(deployer).transfer(receiver.address, tokens(100000000))).to.be.reverted
      })
      it('Rejects invalid recipent', async () => {
        await expect(token.connect(deployer).transfer("0x0000000000000000000000000000000000000000", tokens(100))).to.be.reverted
      })
    })

  })
})
