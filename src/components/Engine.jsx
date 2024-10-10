import { Chess } from "./MonsterChessLogic";

const VICTORY = Infinity;

function scorePosition(board) {
  if (board.getWinner() !== null) {
    if (board.getWinner() === board.turn) {
      return VICTORY;
    } else {
      return -VICTORY;
    }
  }
  // TODO add some sort of scoring system for non victories
  return 0;
}

function alphaBeta(position, depth, alpha, beta) {
  // scores the position of the board
  const board = new Chess(position);
  const ascii = board.ascii();
  if (depth === 0 || board.getWinner() !== null) {
    return scorePosition(board);
  }
  let bestScore = -Infinity;
  let currentAlpha = alpha;
  const children = board.children();
  for (const child of children) {
    const score = -alphaBeta(child, depth - 1, -beta, -currentAlpha);
    bestScore = Math.max(bestScore, score);
    currentAlpha = Math.max(currentAlpha, score);
    if (currentAlpha >= beta) {
      break;
    }
  }
  return bestScore;
}

export { alphaBeta };
