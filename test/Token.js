const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
    let token;
    const name = "Night^^Stalker";
    const symbol = "N^^S";
    const decimals = '18';
    const totalSupply = "1000000";

    beforeEach(async () => {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(name, symbol, totalSupply);
    });

    describe("Deployment", () => {
        it("has a correct name", async () => {
            expect(await token.name()).to.equal(name);
        });

        it("has a correct symbol", async () => {
            expect(await token.symbol()).to.equal(symbol);
        });

        it("has a correct decimals", async () => {
            expect(await token.decimals()).to.equal(decimals);
        });

        it("has a correct total supply", async () => {
            expect(await token.totalSupply()).to.equal(tokens(totalSupply));
        });
    });
});
