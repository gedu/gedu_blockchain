/*
Commands
    - truffle develop or sudo truffle develop to run Truffle Development environment.
    - compile to compile any changes in the Smart Contract.
    - migrate --reset to migrate and create a fresh and clean Smart contract session.
    - test to run the test cases.
*/

const StarNotary = artifacts.require("StarNotary");

let accounts;
let owner;

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("has correct name", async () => {
  let instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  let starName = await instance.starName.call(); // Calling the starName property (doesn't cost gas, called immediately)
  assert.equal(starName, "Awesome Udacity Star"); // Assert if the starName property was initialized correctly
});

it("can be claimed", async () => {
  const instance = await StarNotary.deployed();
  await instance.claimStar({ from: owner });
  const starOwner = await instance.starOwner.call();
  assert.equal(starOwner, owner);
});

it("can change owners", async () => {
  let instance = await StarNotary.deployed();
  let secondUser = accounts[1];
  await instance.claimStar({ from: owner });
  let starOwner = await instance.starOwner.call();
  assert.equal(starOwner, owner);
  await instance.claimStar({ from: secondUser });
  let secondOwner = await instance.starOwner.call();
  assert.equal(secondOwner, secondUser);
});

it("change star name", async () => {
  const instance = await StarNotary.deployed();
  await instance.changeName("Gedu", { from: owner });
  const starName = await instance.starName.call();
  assert.equal(starName, "Gedu");
});
