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
import Box from "@mui/material/Box";

import { Chessboard } from "react-chessboard";

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/2PPPP2/4K3 w2 kq - 0 1";

const startClean = "rnbqkbnr/pppppppp/8/8/8/8/2PPPP2/4K3 w kq - 0 1";
const e4 = "rnbqkbnr/pppppppp/8/8/4P3/8/2PP1P2/4K3 b kq - 0 1";
const Ke2 = "rnbqkbnr/pppppppp/8/8/4P3/8/2PPKP2/8 b kq - 0 1";

const endstart = "r1b1q2r/pppk1K1p/2p1p3/2P5/8/5P2/8/8 w  - 0 1111111111";
const endmid = "r1b1K2r/pppk3p/2p1p3/2P5/8/5P2/8/8 w  - 0 1111111111";
const endend = "r1b4r/pppK3p/2p1p3/2P5/8/5P2/8/8 b  - 0 1111111111";

function MonsterChess() {
  let [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => {
    setOpenHelp(!openHelp);
  };
  const resetBoard = () => {
    setChess(new Chess(startPosition));
  };
  // const chess = useMemo(() => new Chess(), []);
  const [chess, setChess] = useState(new Chess(startPosition));
  const [fen, setFen] = useState(chess.cleanFen());
  const [undoable, setUndoable] = useState(false);
  const [redoable, setRedoable] = useState(false);

  useEffect(() => {
    setFen(chess.cleanFen());
  }, [chess]);

  useEffect(() => {
    setUndoable(chess.pastMoves.length > 0);
    setRedoable(chess.undoneMoves.length > 0);
  }, [fen]);

  const onDrop = (source, target, piece) => {
    const move = chess.move({
      from: source,
      to: target,
      promotion: piece[1],
    });
    if (move === false) return;
    setFen(chess.cleanFen());
  };

  const onUndo = () => {
    chess.undo();
    setFen(chess.cleanFen());
  };

  const onRedo = () => {
    chess.redo();
    setFen(chess.cleanFen());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
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
          <Chessboard position={fen} onPieceDrop={onDrop} id="chessBoard" />
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
            <DialogContentText>
              Monster Chess is a variation of chess that one doesn't see very
              often, where white makes two moves in a row every time, while
              black only gets one. For example, a classic openning is e4, Ke2:
            </DialogContentText>
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

            <DialogContentText>
              To make it somewhat fair white only gets four pawns.
            </DialogContentText>
            <DialogContentText>
              The objective is to take the other player's king, for instance
              white can win like this:
            </DialogContentText>
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
          </DialogContent>
        </div>
      </Dialog>
    </Box>
  );
}

export default MonsterChess;
