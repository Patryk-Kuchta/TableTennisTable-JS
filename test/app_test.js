require('mocha-sinon');
const chai = require('chai');
const expect = chai.expect;

const app = require('../src/app');
const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');
const fs = require('node:fs');
const {createAndPopulateLeague} = require('./league_test');

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
    const players = [['Alice'], ['Bob']];
    const league = createAndPopulateLeague(players);

    const path = 'some/file/path';
    const fsMock = this.sinon.mock(fs, 'writeFileSync');
    fsMock.expects('writeFileSync').once().withArgs(path, JSON.stringify(players), {flag: 'w'});

    const game = app.startGame(league);

    game.sendCommand(`save ${path}`);
    fsMock.verify();
  });

  it('allows for loading the state to specified path', function () {
    const players = [['Alice'], ['Bob']];

    const league = gameState.createLeague();
    const path = 'some/file/path';
    const fsStub = this.sinon.stub(fs, 'readFileSync');
    fsStub.withArgs(path, 'utf8').returns(JSON.stringify(players));

    const game = app.startGame(league);

    game.sendCommand(`load ${path}`);

    expect(game.sendCommand('winner')).to.equal('Alice');
  });
});
