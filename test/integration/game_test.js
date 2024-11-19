const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
const gameState = require('../../src/league');

function isOutputOfExpectedStructure (expectedStructure, output) {
  const outputLines = output.split('\n');
  let expectedRowValidatedIndex = 0;

  for (const line of outputLines) {

    let allEntitiesPresent = expectedStructure[expectedRowValidatedIndex].every(function (player) {
      return line.includes(player);
    });

    if (allEntitiesPresent) {
      expectedRowValidatedIndex++;
    }

    if (expectedRowValidatedIndex + 1 === expectedStructure.length) {
      return true;
    }
  }

  return false;
}

describe('league app', function () {
  it('prints empty game state', function () {
    const game = app.startGame(gameState.createLeague());

    expect(game.sendCommand('print')).to.equal('No players yet');
  });

  it('prints non-empty game states', function () {
    const game = app.startGame(gameState.createLeague());
    const expectedLeagueStructure = [['Alice'], ['Bob', 'Charlie'], ['David']];

    for (const player of expectedLeagueStructure.flat()) {
      game.sendCommand(`add player ${player}`);
    }

    expect(isOutputOfExpectedStructure(expectedLeagueStructure, game.sendCommand('print'))).to.equal(true);
  });

  it('prints an error if an invalid player name is provided', function () {
    const game = app.startGame(gameState.createLeague());

    const invalidName = 'Bob#';

    expect(game.sendCommand(`add player ${invalidName}`)).to.equal(`Player name ${invalidName} contains invalid characters`);
  });

  it('prints an error if the provided name is already taken', function () {
    const game = app.startGame(gameState.createLeague());

    const repeatedName = 'Bob';
    const command = `add player ${repeatedName}`;

    game.sendCommand(command);

    expect(game.sendCommand(command)).to.equal(
        `Cannot add player '${repeatedName}' because they are already in the game`);
  });
});
