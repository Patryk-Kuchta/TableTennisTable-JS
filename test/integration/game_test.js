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

describe('league app with a structure of users', function () {

  let game;
  const initialLeagueStructure = [['Alice'], ['Bob', 'Charlie'], ['David']];

  beforeEach(function () {
    game = app.startGame(gameState.createLeague());

    for (const player of initialLeagueStructure.flat()) {
      game.sendCommand(`add player ${player}`);
    }
  });

  it('prints the game state for games with 5 players', function () {
    expect(isOutputOfExpectedStructure(initialLeagueStructure, game.sendCommand('print'))).to.equal(true);
  });

  it('prints the correct winner when requested', function () {
    expect(game.sendCommand('winner')).to.equal('Alice');
  });

  it('records and adjusts for the wins correctly', function () {
    game.sendCommand('record win Bob Alice');

    const alteredLeagueStructure = [['Bob'], ['Alice', 'Charlie'], ['David']];

    expect(isOutputOfExpectedStructure(alteredLeagueStructure, game.sendCommand('print'))).to.equal(true);
  });
});
