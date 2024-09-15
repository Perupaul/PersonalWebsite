const numberMap = new Map();
numberMap.set(0, "a");
numberMap.set(1, "b");
numberMap.set(2, "c");
numberMap.set(3, "d");
numberMap.set(4, "e");
numberMap.set(5, "f");
numberMap.set(6, "g");
numberMap.set(7, "h");

const letterMap = new Map();
letterMap.set("a", 0);
letterMap.set("b", 1);
letterMap.set("c", 2);
letterMap.set("d", 3);
letterMap.set("e", 4);
letterMap.set("f", 5);
letterMap.set("g", 6);
letterMap.set("h", 7);

const WhitePieces = ["P", "R", "N", "B", "Q", "K"];
const BlackPieces = ["p", "r", "n", "b", "q", "k"];

class Chess {
  constructor(fen) {
    this.fen_string = fen;
    this.pastMoves = [];
    this.undoneMoves = [];

    this.board = [[]];
    let current = 0;
    for (const char of fen.split(" ")[0]) {
      if (char === "/") {
        this.board.push([]);
        current += 1;
      } else if (char >= "1" && char <= "8") {
        for (let i = 0; i < parseInt(char); i++) {
          this.board[current].push(null);
        }
      } else {
        this.board[this.board.length - 1].push(char);
      }
    }

    this.turn = fen.split(" ")[1];
    this.castling = fen.split(" ")[2];
    this.blackEnPassant = null;
    this.whiteEnPassant = [null, null];
    if (this.turn === "w2") {
      this.blackEnPassant = this.notationToIndex(fen.split(" ")[3]);
    } else if (this.turn === "b") {
      this.whiteEnPassant = [this.notationToIndex(fen.split(" ")[3]), null];
    }
    this.halfMove = fen.split(" ")[4];
    this.fullMove = fen.split(" ")[5];
  }

  ascii() {
    let output = "  +-----------------+\n";
    for (let i = 0; i < this.board.length; i++) {
      output += `${8 - i} | `;
      for (let j = 0; j < this.board[i].length; j++) {
        output += this.board[i][j] === null ? ". " : `${this.board[i][j]} `;
      }
      output += "|\n";
    }
    output += "  +-----------------+\n";
    output += "    a b c d e f g h\n";
    return output;
  }

  logBoard() {
    console.log(ascii());
  }

  notationToIndex(notation) {
    if (notation === "-") {
      return null;
    }
    let letter = notation[0];
    let number = parseInt(notation[1]);
    return [8 - number, letterMap.get(letter)];
  }

  indexToNotation(index) {
    return `${numberMap.get(index[1])}${8 - index[0]}`;
  }

  fen() {
    let result = "";
    for (const row of this.board) {
      let empty = 0;
      for (const piece of row) {
        if (piece === null) {
          empty += 1;
        } else {
          if (empty > 0) {
            result += empty;
            empty = 0;
          }
          result += piece;
        }
      }
      if (empty > 0) {
        result += empty;
      }
      if (row !== this.board[this.board.length - 1]) {
        result += "/";
      }
    }
    result += ` ${this.turn} ${this.castling} ${
      this.blackEnPassant === null ? "-" : this.blackEnPassant
    } ${this.halfMove} ${this.fullMove}`;
    return result;
  }

  cleanFen() {
    // Doesn't have w2 as an option
    let fen = this.fen().split(" ");
    if (fen[1] === "w2") {
      fen[1] = "w";
    }
    return fen.join(" ");
  }

  move(move) {
    let from = null;
    let to = null;
    let piece = null;
    let dead = null;

    if (typeof move === "string") {
    } else {
      from = this.notationToIndex(move.from);
      to = this.notationToIndex(move.to);
      piece = move.promotion;
      if (move.promotion === null || move.promotion === undefined) {
        piece = this.board[from[0]][from[1]];
      }
      if (this.turn === "b") {
        piece = piece.toLowerCase();
      }
    }

    let valid = false;
    for (const validMove of this.moves()) {
      if (validMove.to === move.to && validMove.from === move.from) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return false;
    }

    // Past move stuff
    if (this.turn === "w2" || this.turn === "w") {
      if (
        this.blackEnPassant !== null &&
        to[0] === this.blackEnPassant[0] &&
        to[1] === this.blackEnPassant[1]
      ) {
        let row = 3;
        dead = {
          piece: this.board[row][to[1]],
          location: this.indexToNotation([row, to[1]]),
        };
        this.board[row][to[1]] = null;
      } else {
        dead = { piece: this.board[to[0]][to[1]], location: move.to };
      }
    } else {
      if (
        (this.whiteEnPassant[0] !== null &&
          to[0] === this.whiteEnPassant[0][0] &&
          to[1] === this.whiteEnPassant[0][1]) ||
        (this.whiteEnPassant[1] !== null &&
          to[0] === this.whiteEnPassant[1][0] &&
          to[1] === this.whiteEnPassant[1][1])
      ) {
        let row = 4;
        dead = {
          piece: this.board[row][to[1]],
          location: this.indexToNotation([row, to[1]]),
        };
        this.board[row][to[1]] = null;
      } else {
        dead = { piece: this.board[to[0]][to[1]], location: move.to };
      }
    }

    this.pastMoves.push({
      from: move.from,
      to: move.to,
      dead: dead,
      previousPiece: this.board[from[0]][from[1]],
      blackEnPassant: this.blackEnPassant,
      whiteEnPassant: this.whiteEnPassant,
      castling: this.castling,
    });

    // Actually Move
    this.board[to[0]][to[1]] = piece;
    this.board[from[0]][from[1]] = null;

    // handle Castling Permissions
    if (piece === "K") {
      this.castling = this.castling.replace("K", "");
      this.castling = this.castling.replace("Q", "");
    }
    if (piece === "k") {
      this.castling = this.castling.replace("k", "");
      this.castling = this.castling.replace("q", "");
    }
    if (from === "a1" || to === "a1") {
      this.castling = this.castling.replace("Q", "");
    }
    if (from === "h1" || to === "h1") {
      this.castling = this.castling.replace("K", "");
    }
    if (from === "a8" || to === "a8") {
      this.castling = this.castling.replace("q", "");
    }
    if (from === "h8" || to === "h8") {
      this.castling = this.castling.replace("k", "");
    }

    // handle next En Passant
    if (this.turn === "w2") {
      if (piece === "P" && from[0] === 6 && to[0] === 4) {
        this.whiteEnPassant[0] = [5, from[1]];
      } else {
        this.whiteEnPassant[0] = null;
      }
    }

    if (this.turn === "w") {
      if (piece === "P" && from[0] === 6 && to[0] === 4) {
        this.whiteEnPassant[1] = [5, from[1]];
      } else {
        this.whiteEnPassant[1] = null;
      }
    }

    if (this.turn === "b") {
      if (piece === "p" && from[0] === 1 && to[0] === 3) {
        this.blackEnPassant = [2, from[1]];
      } else {
        this.blackEnPassant = null;
      }
    }

    if (this.turn === "w2") {
      this.turn = "w";
    } else if (this.turn === "w") {
      this.turn = "b";
    } else if (this.turn === "b") {
      this.turn = "w2";
      this.fullMove += 1;
    }
    return true;
  }

  undo() {
    let lastMove = this.pastMoves.pop();
    let from = this.notationToIndex(lastMove.from);
    let to = this.notationToIndex(lastMove.to);
    let piece = lastMove.previousPiece;

    this.undoneMoves.push({
      from: lastMove.from,
      to: lastMove.to,
      promotion: this.board[to[0]][to[1]],
    });

    this.board[from[0]][from[1]] = piece;
    this.board[to[0]][to[1]] = null; // Will get overwritten if a piece was taken.

    let dead = lastMove.dead;
    let deadPosition = this.notationToIndex(dead.location);
    this.board[deadPosition[0]][deadPosition[1]] = dead.piece;

    if (this.turn === "w2") {
      this.turn = "b";
      this.fullMove -= 1;
    } else if (this.turn === "w") {
      this.turn = "w2";
    } else if (this.turn === "b") {
      this.turn = "w";
    }
    this.blackEnPassant = lastMove.blackEnPassant;
    this.whiteEnPassant = lastMove.whiteEnPassant;
    this.castling = lastMove.castling;
  }

  redo() {
    let pastUndo = this.undoneMoves.pop();
    this.move(pastUndo);
  }

  getKingMoves(i, j, enemyPieces) {
    let result = [];
    let possibleMoves = [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
      [i + 1, j + 1],
      [i + 1, j - 1],
      [i - 1, j + 1],
      [i - 1, j - 1],
    ];
    for (const [newI, newJ] of possibleMoves) {
      if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (enemyPieces.includes(this.board[newI][newJ])) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Kx${numberMap.get(newJ)}${8 - newI}`,
          });
        } else if (this.board[newI][newJ] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `K${numberMap.get(newJ)}${8 - newI}`,
          });
        }
      }
    }
    // Castling
    if (this.turn === "w" || this.turn === "w2") {
      if (this.castling.includes("K")) {
        if (this.board[7][5] === null && this.board[7][6] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: "g1",
            notation: "0-0",
          });
        }
      }
      if (this.castling.includes("Q")) {
        if (
          this.board[7][1] === null &&
          this.board[7][2] === null &&
          this.board[7][3] === null
        ) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: "c1",
            notation: "0-0-0",
          });
        }
      }
    }
    if (this.turn === "b") {
      if (this.castling.includes("k")) {
        if (this.board[0][5] === null && this.board[0][6] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: "g8",
            notation: "0-0",
          });
        }
      }
      if (this.castling.includes("q")) {
        if (
          this.board[0][1] === null &&
          this.board[0][2] === null &&
          this.board[0][3] === null
        ) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: "c8",
            notation: "0-0-0",
          });
        }
      }
    }
    return result;
  }

  getKnightMoves(i, j, enemyPieces) {
    let result = [];
    let possibleMoves = [
      [i + 2, j + 1],
      [i + 2, j - 1],
      [i + 1, j + 2],
      [i + 1, j - 2],
      [i - 2, j + 1],
      [i - 2, j - 1],
      [i - 1, j + 2],
      [i - 1, j - 2],
    ];
    for (const [newI, newJ] of possibleMoves) {
      if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (enemyPieces.includes(this.board[newI][newJ])) {
          // TODO: Disambiguate notation
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Nx${numberMap.get(newJ)}${8 - newI}`,
          });
        } else if (this.board[newI][newJ] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `N${numberMap.get(newJ)}${8 - newI}`,
          });
        }
      }
    }
    return result;
  }

  getRookMoves(i, j, enemyPieces) {
    let result = [];
    let possibleMoves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [deltaI, deltaJ] of possibleMoves) {
      let newI = i + deltaI;
      let newJ = j + deltaJ;
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        // TODO: Disambiguate notation
        if (enemyPieces.includes(this.board[newI][newJ])) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Rx${numberMap.get(newJ)}${8 - newI}`,
          });
          break;
        } else if (this.board[newI][newJ] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `R${numberMap.get(newJ)}${8 - newI}`,
          });
          newI += deltaI;
          newJ += deltaJ;
        } else {
          break;
        }
      }
    }
    return result;
  }

  getBishopMoves(i, j, enemyPieces) {
    let result = [];
    let possibleMoves = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
    for (const [deltaI, deltaJ] of possibleMoves) {
      let newI = i + deltaI;
      let newJ = j + deltaJ;
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (enemyPieces.includes(this.board[newI][newJ])) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Bx${numberMap.get(newJ)}${8 - newI}`,
          });
          break;
        } else if (this.board[newI][newJ] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `B${numberMap.get(newJ)}${8 - newI}`,
          });
          newI += deltaI;
          newJ += deltaJ;
        } else {
          break;
        }
      }
    }
    return result;
  }

  getQueenMoves(i, j, enemyPieces) {
    let result = [];
    let possibleMoves = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [deltaI, deltaJ] of possibleMoves) {
      let newI = i + deltaI;
      let newJ = j + deltaJ;
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (enemyPieces.includes(this.board[newI][newJ])) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Qx${numberMap.get(newJ)}${8 - newI}`,
          });
          break;
        } else if (this.board[newI][newJ] === null) {
          result.push({
            from: `${numberMap.get(j)}${8 - i}`,
            to: `${numberMap.get(newJ)}${8 - newI}`,
            notation: `Q${numberMap.get(newJ)}${8 - newI}`,
          });
          newI += deltaI;
          newJ += deltaJ;
        } else {
          break;
        }
      }
    }
    return result;
  }

  generateWhiteMoves() {
    let moves = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        // Pawns
        if (this.board[i][j] === "P") {
          if (this.board[i - 1][j] === null) {
            if (i - 1 === 0) {
              for (const promotion of ["Q", "R", "N", "B"]) {
                moves.push({
                  from: this.indexToNotation([i, j]),
                  to: this.indexToNotation([i - 1, j]),
                  notation: `${this.indexToNotation([i - 1, j])}=${promotion}`,
                  promotion: promotion,
                });
              }
            } else {
              moves.push({
                from: this.indexToNotation([i, j]),
                to: this.indexToNotation([i - 1, j]),
                notation: this.indexToNotation([i - 1, j]),
              });
            }
            if (i === 6 && this.board[i - 2][j] === null) {
              // can move two spaces
              moves.push({
                from: this.indexToNotation([i, j]),
                to: this.indexToNotation([i - 2, j]),
                notation: this.indexToNotation([i - 2, j]),
              });
            }
          }
          let possibleAttacks = [
            [i - 1, j - 1],
            [i - 1, j + 1],
          ];
          for (const [newI, newJ] of possibleAttacks) {
            // should be unnecessary
            if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
              if (
                BlackPieces.includes(this.board[newI][newJ]) ||
                (this.blackEnPassant !== null &&
                  this.blackEnPassant[0] === newI &&
                  this.blackEnPassant[1] == newJ)
              ) {
                if (newI === 0) {
                  for (const promotion of ["Q", "R", "N", "B"]) {
                    moves.push({
                      from: this.indexToNotation([i, j]),
                      to: this.indexToNotation([newI, newJ]),
                      notation: `${numberMap.get(j)}x${this.indexToNotation([
                        newI,
                        newJ,
                      ])}=${promotion}`,
                      promotion: promotion,
                    });
                  }
                } else {
                  moves.push({
                    from: this.indexToNotation([i, j]),
                    to: this.indexToNotation([newI, newJ]),
                    notation: `${numberMap.get(j)}x${this.indexToNotation([
                      newI,
                      newJ,
                    ])}`,
                  });
                }
              }
            }
          }
        }

        // Kings
        if (this.board[i][j] === "K") {
          moves.push(...this.getKingMoves(i, j, BlackPieces));
        }

        // Rooks
        if (this.board[i][j] === "R") {
          moves.push(...this.getRookMoves(i, j, BlackPieces));
        }

        // Knights
        if (this.board[i][j] === "N") {
          moves.push(...this.getKnightMoves(i, j, BlackPieces));
        }

        // Bishops
        if (this.board[i][j] === "B") {
          moves.push(...this.getBishopMoves(i, j, BlackPieces));
        }

        // Queens
        if (this.board[i][j] === "Q") {
          moves.push(...this.getQueenMoves(i, j, BlackPieces));
        }
      }
    }
    return moves;
  }

  generateBlackMoves() {
    let moves = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        // Pawns
        if (this.board[i][j] === "p") {
          if (this.board[i + 1][j] === null) {
            if (i + 1 === 7) {
              for (const promotion of ["q", "r", "n", "b"]) {
                moves.push({
                  from: this.indexToNotation([i, j]),
                  to: this.indexToNotation([i + 1, j]),
                  notation: this.indexToNotation([i + 1, j]),
                  promotion: promotion,
                });
              }
            } else {
              moves.push({
                from: this.indexToNotation([i, j]),
                to: this.indexToNotation([i + 1, j]),
                notation: this.indexToNotation([i + 1, j]),
              });
            }
            if (i === 1 && this.board[i + 2][j] === null) {
              // can move two spaces
              moves.push({
                from: this.indexToNotation([i, j]),
                to: this.indexToNotation([i + 2, j]),
                notation: this.indexToNotation([i + 2, j]),
              });
            }
          }
          let possibleAttacks = [
            [i + 1, j - 1],
            [i + 1, j + 1],
          ];
          for (const [newI, newJ] of possibleAttacks) {
            // should be unnecessary
            if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
              if (
                WhitePieces.includes(this.board[newI][newJ]) ||
                (this.whiteEnPassant[0] !== null &&
                  this.whiteEnPassant[0][0] === newI &&
                  this.whiteEnPassant[0][1] == newJ) ||
                (this.whiteEnPassant[1] !== null &&
                  this.whiteEnPassant[1][0] === newI &&
                  this.whiteEnPassant[1][1] == newJ)
              ) {
                if (newI === 7) {
                  for (const promotion of ["q", "r", "n", "b"]) {
                    moves.push({
                      from: this.indexToNotation([i, j]),
                      to: this.indexToNotation([newI, newJ]),
                      notation: `${numberMap.get(j)}x${this.indexToNotation([
                        newI,
                        newJ,
                      ])}=${promotion}`,
                      promotion: promotion,
                    });
                  }
                } else {
                  moves.push({
                    from: this.indexToNotation([i, j]),
                    to: this.indexToNotation([newI, newJ]),
                    notation: `${numberMap.get(j)}x${this.indexToNotation([
                      newI,
                      newJ,
                    ])}`,
                  });
                }
              }
            }
          }
        }

        // Kings
        if (this.board[i][j] === "k") {
          moves.push(...this.getKingMoves(i, j, WhitePieces));
        }

        // Rooks
        if (this.board[i][j] === "r") {
          moves.push(...this.getRookMoves(i, j, WhitePieces));
        }

        // Knights
        if (this.board[i][j] === "n") {
          moves.push(...this.getKnightMoves(i, j, WhitePieces));
        }

        // Bishops
        if (this.board[i][j] === "b") {
          moves.push(...this.getBishopMoves(i, j, WhitePieces));
        }

        // Queens
        if (this.board[i][j] === "q") {
          moves.push(...this.getQueenMoves(i, j, WhitePieces));
        }
      }
    }
    return moves;
  }

  moves() {
    if (this.turn === "w" || this.turn === "w2") {
      return this.generateWhiteMoves(2);
    } else {
      return this.generateBlackMoves();
    }
  }
}

export { Chess };
