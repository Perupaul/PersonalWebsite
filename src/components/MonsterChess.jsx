import React, { useEffect, useMemo, useState } from "react";
import "./shared.css";
import "./MonsterChess.css";
// import { Chess } from "chess.js";
import { Chess } from "./MonsterChessLogic";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SouthIcon from "@mui/icons-material/South";
import Box from "@mui/material/Box";
import WhiteWinnerKing from "../assets/WhiteWinnerKing.png";
import BlackWinnerKing from "../assets/BlackWinnerKing.png";

import { Chessboard } from "react-chessboard";

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/2PPPP2/4K3 w2 kq - 0 1";

const startClean = "rnbqkbnr/pppppppp/8/8/8/8/2PPPP2/4K3 w kq - 0 1";
const e4 = "rnbqkbnr/pppppppp/8/8/4P3/8/2PP1P2/4K3 b kq - 0 1";
const Ke2 = "rnbqkbnr/pppppppp/8/8/4P3/8/2PPKP2/8 b kq - 0 1";

const endstart = "r1b1q2r/pppk1K1p/2p1p3/2P5/8/5P2/8/8 w  - 0 1111111111";
const endmid = "r1b1K2r/pppk3p/2p1p3/2P5/8/5P2/8/8 w  - 0 1111111111";
const endend = "r1b4r/pppK3p/2p1p3/2P5/8/5P2/8/8 b  - 0 1111111111";

function MonsterChess() {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(width <= 768);

  const [winner, setWinner] = useState(null);

  const [winCustomPieces, setWinCustomPieces] = useState({});

  useEffect(() => {
    const pieceComponents = {};
    if (winner === "w") {
      pieceComponents["wK"] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(${WhiteWinnerKing})`,
            backgroundSize: "100%",
          }}
        />
      );
    } else if (winner === "b") {
      pieceComponents["bK"] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(${BlackWinnerKing})`,
            backgroundSize: "100%",
          }}
        />
      );
    }
    setWinCustomPieces(pieceComponents);
  }, [winner]);

  let [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => {
    setOpenHelp(!openHelp);
  };
  const resetBoard = () => {
    setChess(new Chess(startPosition));
  };

  const [chess, setChess] = useState(new Chess(startPosition));
  const [fen, setFen] = useState(chess.cleanFen());
  const [undoable, setUndoable] = useState(false);
  const [redoable, setRedoable] = useState(false);
  const [moveFrom, setMoveFrom] = useState(null);
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});

  useEffect(() => {
    setFen(chess.cleanFen());
  }, [chess]);

  useEffect(() => {
    setUndoable(chess.pastMoves.length > 0);
    setRedoable(chess.undoneMoves.length > 0);
    setWinner(chess.getWinner());
  }, [fen]);

  const onDrop = (source, target, piece) => {
    if (winner !== null) return; // the game is over, shouldn't matter cuz the board is not draggable
    const move = chess.move({
      from: source,
      to: target,
      promotion: piece[1],
    });
    if (move === false) {
      setMoveFrom(source);
      setOptionBackgrounds(source);
      return;
    }
    setOptionSquares({});
    setMoveFrom(null);
    setFen(chess.cleanFen());
  };

  const setOptionBackgrounds = (square) => {
    const moves = chess.movesFromSquare(square);
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          chess.get(move.to) &&
          chess.get(move.to).color !== chess.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  };

  const onSquareClick = (square, piece) => {
    if (winner !== null) return;
    if (moveFrom === null) {
      setOptionBackgrounds(square);
      setMoveFrom(square);
    } else {
      if (moveFrom === square) {
        setOptionSquares({});
        setMoveFrom(null);
        return;
      }
      let moves = chess.movesFromSquare(moveFrom);
      let move = moves.find((move) => move.to === square);
      if (!move) {
        setOptionBackgrounds(square);
        setMoveFrom(square);
        return;
      }
      if (
        chess.get(moveFrom).piece.toLowerCase() === "p" &&
        (move.to[1] === "1" || move.to[1] === "8")
      ) {
        setMoveTo(square);
        setShowPromotionDialog(true);
        return;
      }

      move = chess.move({
        from: moveFrom,
        to: square,
        promotion: chess.get(moveFrom).piece,
      });
      if (move !== false) {
        setFen(chess.cleanFen());
        setMoveFrom(null);
        setOptionSquares({});
      } else {
        setOptionBackgrounds(square);
        setMoveFrom(square);
      }
    }
  };

  const onPromotionPieceSelect = (piece) => {
    if (piece) {
      const move = chess.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1],
      });
      if (move !== false) {
        setFen(chess.cleanFen());
      }
    }
    setMoveFrom(null);
    setMoveTo(null);
    setOptionSquares({});
    setShowPromotionDialog(false);
  };

  const onUndo = () => {
    chess.undo();
    setFen(chess.cleanFen());
    setOptionSquares({});
    setMoveFrom(null);
  };

  const onRedo = () => {
    chess.redo();
    setFen(chess.cleanFen());
    setOptionSquares({});
    setMoveFrom(null);
  };

  const content = (
    <div>
      <div className="horizontal-flex">
        <IconButton
          onClick={resetBoard}
          aria-label="Reset Board"
          className="icon-button"
        >
          <RestartAltIcon fontSize="large" />
        </IconButton>
        <h1>Monster Chess</h1>
        <IconButton
          onClick={toggleHelp}
          aria-label="Help"
          className="icon-button"
        >
          <HelpOutlinedIcon fontSize="large" />
        </IconButton>
      </div>

      <div className="horizontal-flex">
        <div className="board-div">
          {winner === null ? (
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              id="chessBoard"
              onSquareClick={onSquareClick}
              customSquareStyles={{
                ...optionSquares,
              }}
              showPromotionDialog={showPromotionDialog}
              promotionToSquare={moveTo}
              onPromotionPieceSelect={onPromotionPieceSelect}
            />
          ) : (
            <Chessboard
              position={fen}
              customPieces={winCustomPieces}
              arePiecesDraggable={false}
              areArrowsAllowed={false}
              id="chessboard"
            />
          )}
        </div>
      </div>

      <div className="horizontal-flex">
        <IconButton
          onClick={onUndo}
          aria-label="Undo"
          disabled={!undoable}
          className="icon-button"
        >
          <UndoIcon fontSize="large" />
          {/* TODO: Disable when there's nothing to undo */}
        </IconButton>

        <IconButton
          onClick={onRedo}
          aria-label="Redo"
          disabled={!redoable}
          className="icon-button"
        >
          <RedoIcon fontSize="large" />
        </IconButton>
      </div>

      <p>Engine coming soon!</p>

      <Dialog open={openHelp} onClose={toggleHelp}>
        <div className="monster-help">
          <DialogTitle id="monster-title">Monster Chess?</DialogTitle>
          <DialogContent>
            <DialogContentText className="padding-top padding-bottom">
              Monster Chess is a variation of chess that one doesn't see very
              often, where white makes two moves in a row every time, while
              black only gets one. For example, a classic openning is e4, Ke2:
            </DialogContentText>
            {!isMobile ? (
              <div className="horizontal-flex">
                <Chessboard
                  position={startClean}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <ArrowRightAltIcon fontSize="large" />
                <Chessboard
                  position={e4}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <ArrowRightAltIcon fontSize="large" />
                <Chessboard
                  position={Ke2}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
              </div>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Chessboard
                  position={startClean}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <SouthIcon
                  fontSize="large"
                  sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
                <Chessboard
                  position={e4}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <SouthIcon
                  fontSize="large"
                  sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
                <Chessboard
                  position={Ke2}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
              </Box>
            )}

            <DialogContentText className="padding-top">
              To make it somewhat fair white only gets four pawns.
            </DialogContentText>
            <DialogContentText className="padding-bottom">
              The objective is to take the other player's king, for instance
              white can win like this:
            </DialogContentText>
            {!isMobile ? (
              <div className="horizontal-flex">
                <Chessboard
                  position={endstart}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <ArrowRightAltIcon fontSize="large" />
                <Chessboard
                  position={endmid}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <ArrowRightAltIcon fontSize="large" />
                <Chessboard
                  position={endend}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
              </div>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Chessboard
                  position={endstart}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <SouthIcon
                  fontSize="large"
                  sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
                <Chessboard
                  position={endmid}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
                <SouthIcon
                  fontSize="large"
                  sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
                <Chessboard
                  position={endend}
                  arePiecesDraggable={false}
                  areArrowsAllowed={false}
                />
              </Box>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          maxWidth: "55em",
          paddingLeft: "1em",
          paddingRight: "1em",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "rgb(15, 15, 15)",
          overflow: "scroll",
        }}
      >
        {content}
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          maxWidth: "55em",
          paddingLeft: "5em",
          paddingRight: "5em",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "rgb(15, 15, 15)",
          overflow: "scroll",
        }}
      >
        {content}
      </Box>
    );
  }
}

export default MonsterChess;
