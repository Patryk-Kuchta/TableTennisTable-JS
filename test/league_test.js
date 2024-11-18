const chai = require('chai');
const expect = chai.expect;

const gameState = require('../src/league');

function createAndPopulateLeague (playerList) {
  const league = gameState.createLeague();

  for (const player of playerList.flat()) {
    league.addPlayer(player);
  }

  return league;
}

describe('league', function () {
  describe('#addPlayer', function () {
    it('adds a player to the game', function () {
      const league = createAndPopulateLeague(['Bob']);

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(1);
      expect(players[0]).to.have.members(['Bob']);
    });

    it('refuses to add a player with a name with a tailing whitespace', function () {
      const league = gameState.createLeague();
      expect(() => {league.addPlayer('Bob ');}).to.throw();
    });

    it('refuses to add a player with a name a special character', function () {
      const league = gameState.createLeague();
      expect(() => {league.addPlayer('Bob#');}).to.throw();
    });

    it('refuses to add a player with a name that matches an existing player', function () {
      const league = createAndPopulateLeague(['Bob']);

      expect(() => {league.addPlayer('Bob');}).to.throw();
    });
  });

  describe('#getPlayers', function () {
    it('return the expected set of players', () => {
      const listOfPlayers = ['Amy', 'Bob', 'Charlie'];
      const league = createAndPopulateLeague(listOfPlayers);

      expect(league.getPlayers().flat()).to.deep.equal(listOfPlayers);
    });

    it('return the expected set of players in the expected format', () => {
      const playerStructure = [['Amy'], ['Bob', 'Charlie'], ['Daniel', 'Eve']];
      const league = createAndPopulateLeague(playerStructure);

      expect(league.getPlayers()).to.deep.equal(playerStructure);
    });
  });

  describe('#recordWin', function () {

    const initialPlayerStructure = [['Amy'], ['Bob', 'Charlie'], ['Daniel', 'Eve']];
    let league;

    beforeEach(function () {
      league = createAndPopulateLeague(initialPlayerStructure);
    });

    it('promotes players correctly for valid matches', () => {
      const expectedStructure = [['Bob'], ['Amy', 'Charlie'], ['Daniel', 'Eve']];
      league.recordWin('Bob', 'Amy');
      expect(league.getPlayers()).to.deep.equal(expectedStructure);
    });

    it('refuses to record wins on the same level', () => {
      expect(() => {league.recordWin('Eve', 'Daniel');}).to.throw();
    });

    it('refuses to record after challenger looses', () => {
      expect(() => {league.recordWin('Charlie', 'Daniel');}).to.throw();
    });

    it('refuses to record wins if there is more than one row difference', () => {
      expect(() => {league.recordWin('Amy', 'Daniel');}).to.throw();
    });

    it('refuses to record wins for non existent plays', () => {
      expect(() => {league.recordWin('Amy', 'George');}).to.throw();
    });
  });

  describe('#getWinner', function () {
    it('yields the correct winner', function () {
      const initialPlayerStructure = [['Amy'], ['Bob', 'Charlie'], ['Daniel', 'Eve']];
      let league = createAndPopulateLeague(initialPlayerStructure);

      league.recordWin('Bob', 'Amy');

      expect(league.getWinner()).to.equal('Bob');
    });

    it('yields null for an empty league', function () {
      const league = gameState.createLeague();

      expect(league.getWinner()).to.be.null;
    });
  });
});
