require('mocha-sinon');
const chai = require('chai');
const expect = chai.expect;

const app = require('../src/app');
const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');
const fileService = require('../src/file_service');

describe('app command processing', function () {

  it('prints the current state of the league', function () {
    const league = gameState.createLeague();
    const renderLeague = this.sinon.stub(leagueRenderer, 'render');
    renderLeague.withArgs(league).returns('rendered league');

    const game = app.startGame(league);
    expect(game.sendCommand('print')).to.equal('rendered league');
  });

  it('allows for adding a new player', function () {
    const league = gameState.createLeague();
    const newPlayer = 'Alice';
    const mockedLeague = this.sinon.mock(league, 'addPlayer');
    mockedLeague.expects('addPlayer').once().withArgs(newPlayer);

    const game = app.startGame(league);

    game.sendCommand(`add player ${newPlayer}`);

    mockedLeague.verify();
  });

  it('allows for recording the win', function () {
    const league = gameState.createLeague();
    const winner = 'Alice';
    const looser = 'Bob';
    const mockedLeague = this.sinon.mock(league, 'recordWin');
    mockedLeague.expects('recordWin').once().withArgs(winner, looser);

    const game = app.startGame(league);

    game.sendCommand(`record win ${winner} ${looser}`);

    mockedLeague.verify();
  });

  it('displays the correct winner', function () {
    const league = gameState.createLeague();
    const winner = 'Alice';
    const mockedLeague = this.sinon.stub(league, 'getWinner');
    mockedLeague.withArgs().returns(winner);

    const game = app.startGame(league);

    expect(game.sendCommand('winner')).to.equal(winner);
  });

  it('allows for saving the state to specified path', function () {
    const league = gameState.createLeague();
    const path = 'some/file/path';
    const mockedFileRegister = this.sinon.mock(fileService, 'save');
    mockedFileRegister.expects('save').once().withArgs(path, league);

    const game = app.startGame(league);

    game.sendCommand(`save ${path}`);

    mockedFileRegister.verify();
  });

  it('allows for loading the state to specified path', function () {
    const league = gameState.createLeague();
    const path = 'some/file/path';
    const mockedFileRegister = this.sinon.mock(fileService, 'load');
    mockedFileRegister.expects('load').once().withArgs(path);

    const game = app.startGame(league);

    game.sendCommand(`load ${path}`);

    mockedFileRegister.verify();
  });
});
