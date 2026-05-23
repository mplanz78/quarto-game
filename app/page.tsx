"use client";

import { useEffect, useState } from "react";

const initialPieces = [
  { id: 1, color: "dark", shape: "circle", height: "tall", filled: true },
  { id: 2, color: "dark", shape: "circle", height: "tall", filled: false },
  { id: 3, color: "dark", shape: "circle", height: "short", filled: true },
  { id: 4, color: "dark", shape: "circle", height: "short", filled: false },

  { id: 5, color: "dark", shape: "square", height: "tall", filled: true },
  { id: 6, color: "dark", shape: "square", height: "tall", filled: false },
  { id: 7, color: "dark", shape: "square", height: "short", filled: true },
  { id: 8, color: "dark", shape: "square", height: "short", filled: false },

  { id: 9, color: "light", shape: "circle", height: "tall", filled: true },
  { id: 10, color: "light", shape: "circle", height: "tall", filled: false },
  { id: 11, color: "light", shape: "circle", height: "short", filled: true },
  { id: 12, color: "light", shape: "circle", height: "short", filled: false },

  { id: 13, color: "light", shape: "square", height: "tall", filled: true },
  { id: 14, color: "light", shape: "square", height: "tall", filled: false },
  { id: 15, color: "light", shape: "square", height: "short", filled: true },
  { id: 16, color: "light", shape: "square", height: "short", filled: false },
];

function renderPiece(piece: any, size = "normal") {
  if (!piece) return null;

  const dimensions =
    piece.height === "tall"
      ? size === "small"
        ? "w-7 h-12 sm:w-10 sm:h-16"
        : "w-10 h-16 sm:w-14 sm:h-24"
      : size === "small"
      ? "w-7 h-7 sm:w-10 sm:h-10"
      : "w-10 h-10 sm:w-14 sm:h-14";

  const woodTexture =
    piece.color === "dark"
      ? `
        bg-gradient-to-br
        from-[#2a140c]
        via-[#4b2415]
        to-[#1a0b05]
        border-[#6b3e26]
      `
      : `
        bg-gradient-to-br
        from-[#f2d7a6]
        via-[#d8b98a]
        to-[#b98a5f]
        border-[#e7c99f]
      `;

  return (
    <div
      className={`
        relative
        ${dimensions}
        ${woodTexture}
        border-2
        shadow-[0_8px_20px_rgba(0,0,0,0.5)]
        transition-all
        duration-300

        ${
          piece.shape === "circle"
            ? "rounded-full"
            : "rounded-lg"
        }

        ${
          !piece.filled
            ? "opacity-70"
            : ""
        }
      `}
    >
      <div
        className="
          absolute
          top-1
          left-1
          w-1/3
          h-1/3
          bg-[#c08a5a]/20
          rounded-full
          blur-sm
        "
      />

      {!piece.filled && (
        <div
          className="
            absolute
            top-1
            left-1/2
            -translate-x-1/2
            w-2
            h-2
            sm:w-3
            sm:h-3
            bg-black/50
            rounded-full
            shadow-inner
          "
        />
      )}
    </div>
  );
}

function checkVictory(board: any[]) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],

    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],

    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  for (const line of lines) {
    const selected = line.map(i => board[i]);

    if (selected.some(p => p === null)) continue;

    const attrs = ["color", "shape", "height", "filled"];

    for (const attr of attrs) {
      const value = selected[0][attr];

      if (selected.every(p => p[attr] === value)) {
        return true;
      }
    }
  }

  return false;
}

export default function Home() {
  const [board, setBoard] = useState(Array(16).fill(null));

  const [availablePieces, setAvailablePieces] =
    useState(initialPieces);

  const [playerPiece, setPlayerPiece] =
    useState<any>(null);

  const [aiPiece, setAiPiece] =
    useState<any>(null);

  const [phase, setPhase] =
    useState("AI_GIVES_PLAYER");

  const [winner, setWinner] =
    useState("");

  const [gameStarted, setGameStarted] =
    useState(false);

  const [showRules, setShowRules] =
    useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    if (phase !== "AI_GIVES_PLAYER") return;

    if (availablePieces.length === 0) return;

    const randomPiece =
      availablePieces[
        Math.floor(
          Math.random() * availablePieces.length
        )
      ];

    setPlayerPiece(randomPiece);

    setAvailablePieces(prev =>
      prev.filter(
        p => p.id !== randomPiece.id
      )
    );

    setPhase("PLAYER_PLACES");
  }, [phase, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    if (phase !== "AI_PLACES") return;

    if (!aiPiece) return;

    const timer = setTimeout(() => {
      const emptyIndexes = board
        .map((cell, index) =>
          cell === null ? index : null
        )
        .filter(v => v !== null);

      const randomIndex =
        emptyIndexes[
          Math.floor(
            Math.random() * emptyIndexes.length
          )
        ] as number;

      const newBoard = [...board];

      newBoard[randomIndex] = aiPiece;

      setBoard(newBoard);

      if (checkVictory(newBoard)) {
        setWinner("IA");
        return;
      }

      setAiPiece(null);

      setPhase("AI_GIVES_PLAYER");
    }, 900);

    return () => clearTimeout(timer);
  }, [phase, aiPiece, board, gameStarted]);

  function placePlayerPiece(index: number) {
    if (phase !== "PLAYER_PLACES") return;

    if (board[index]) return;

    const newBoard = [...board];

    newBoard[index] = playerPiece;

    setBoard(newBoard);

    if (checkVictory(newBoard)) {
      setWinner("Jogador");
      return;
    }

    setPlayerPiece(null);

    setPhase("PLAYER_GIVES_AI");
  }

  function givePieceToAI(piece: any) {
    if (phase !== "PLAYER_GIVES_AI") return;

    setAiPiece(piece);

    setAvailablePieces(prev =>
      prev.filter(p => p.id !== piece.id)
    );

    setPhase("AI_PLACES");
  }

  return (
    <>
      {!gameStarted && (
        <div className="
          fixed inset-0
          bg-[#c9a06b]
          flex items-center justify-center
          z-50
          p-6
        ">
          <div className="flex flex-col items-center text-center">

            <h1 className="
              text-5xl
              sm:text-8xl
              text-[#4a2815]
              tracking-[8px]
              sm:tracking-[12px]
              mb-8
              font-serif
            ">
              QUARTO
            </h1>

            <button
              onClick={() =>
                setGameStarted(true)
              }
              className="
                px-8
                py-4
                rounded-2xl
                text-lg
                sm:text-2xl
                bg-gradient-to-b
                from-[#8a5a2f]
                to-[#4a2815]
                border
                border-[#c9a06b]
                shadow-2xl
                hover:scale-105
                transition-all
                text-white
              "
            >
              Iniciar Partida
            </button>

          </div>
        </div>
      )}

      <main className="
        min-h-screen
        bg-[#c9a06b]
        text-[#4a2815]
        flex
        flex-col
        items-center
        px-2
        sm:px-6
        py-4
        relative
      ">

        <button
          onClick={() => setShowRules(true)}
          className="
            absolute
            top-3
            right-3
            px-4
            py-2
            rounded-xl
            bg-[#4a2815]
            text-[#f2d7a6]
            border
            border-[#7b5232]
            shadow-xl
            text-sm
            sm:text-base
          "
        >
          Regras
        </button>

        <h1 className="
          text-4xl
          sm:text-7xl
          font-serif
          tracking-[6px]
          sm:tracking-[10px]
          mb-4
          sm:mb-6
          text-[#4a2815]
        ">
          QUARTO
        </h1>

        <div className="
          mb-4
          px-5
          py-3
          rounded-2xl
          border
          border-[#7b5232]
          bg-[#e0c39a]
          shadow-xl
          text-sm
          sm:text-xl
          text-center
        ">
          {phase === "PLAYER_PLACES" &&
            "Posicione sua peça"}

          {phase === "PLAYER_GIVES_AI" &&
            "Escolha uma peça para a IA"}

          {phase === "AI_PLACES" &&
            "IA pensando..."}
        </div>

        <div className="
          flex
          flex-col
          lg:flex-row
          gap-5
          items-center
          mb-6
          w-full
          max-w-7xl
        ">

          {/* IA */}
          <div className="
            flex
            flex-col
            items-center
          ">
            <div className="
              mb-2
              text-lg
              sm:text-xl
              font-serif
            ">
              Peça da IA
            </div>

            <div className="
              w-24
              h-24
              sm:w-32
              sm:h-32
              rounded-3xl
              bg-[#e0c39a]
              border
              border-[#7b5232]
              flex
              items-center
              justify-center
              shadow-2xl
            ">
              {renderPiece(aiPiece)}
            </div>
          </div>

          {/* TABULEIRO */}
          <div className="
            p-3
            sm:p-6
            rounded-[30px]
            bg-gradient-to-b
            from-[#c89b6d]
            to-[#9f6f47]
            border
            border-[#7b5232]
            shadow-2xl
          ">
            <div className="
              grid
              grid-cols-4
              gap-2
              sm:gap-4
            ">
              {board.map((piece, index) => (
                <div
                  key={index}
                  onClick={() =>
                    placePlayerPiece(index)
                  }
                  className="
  w-16
  h-16
  sm:w-24
  sm:h-24
  rounded-full
  bg-gradient-to-br
  from-[#d8b98a]
  to-[#b98a5f]
  border-4
  border-[#8a5a2f]
  shadow-inner
  flex
  items-center
  justify-center
  cursor-pointer
  hover:scale-105
  transition-all
                  "
                >
                  {renderPiece(piece)}
                </div>
              ))}
            </div>
          </div>

          {/* JOGADOR */}
          <div className="
            flex
            flex-col
            items-center
          ">
            <div className="
              mb-2
              text-lg
              sm:text-xl
              font-serif
            ">
              Sua peça
            </div>

            <div className="
              w-24
              h-24
              sm:w-32
              sm:h-32
              rounded-3xl
              bg-[#e0c39a]
              border-2
              border-[#c9a06b]
              flex
              items-center
              justify-center
              shadow-2xl
              animate-pulse
            ">
              {renderPiece(playerPiece)}
            </div>
          </div>

        </div>

        {/* ESTOQUE */}
        <div className="
          p-4
          rounded-[30px]
          bg-gradient-to-b
          from-[#e0c39a]
          to-[#c9a06b]
          border
          border-[#7b5232]
          shadow-2xl
          w-full
          max-w-6xl
        ">

          <div className="
            text-center
            mb-4
            text-base
            sm:text-xl
            font-serif
          ">
            ESTOQUE
          </div>

          <div className="
            flex
            gap-2
            sm:gap-3
            flex-wrap
            justify-center
          ">
            {availablePieces.map(piece => (
              <div
                key={piece.id}
                onClick={() =>
                  givePieceToAI(piece)
                }
                className={`
                  w-14
                  h-14
                  sm:w-20
                  sm:h-20
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  border
                  transition-all
                  duration-300
                  shadow-xl

                  ${
                    phase === "PLAYER_GIVES_AI"
                      ? `
                        bg-[#d4b084]
                        border-[#7b5232]
                        hover:scale-110
                        cursor-pointer
                      `
                      : `
                        bg-[#c39b6b]
                        border-[#9c744c]
                        opacity-40
                      `
                  }
                `}
              >
                {renderPiece(piece, "small")}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* REGRAS */}
      {showRules && (
        <div className="
          fixed inset-0
          bg-black/60
          flex items-center justify-center
          z-50
          p-4
        ">

          <div className="
            w-full
            max-w-2xl
            bg-[#f2d7a6]
            text-[#4a2815]
            p-6
            sm:p-10
            rounded-[30px]
            border-4
            border-[#7b5232]
            shadow-2xl
            relative
          ">

            <button
              onClick={() =>
                setShowRules(false)
              }
              className="
                absolute
                top-3
                right-3
                w-10
                h-10
                rounded-full
                bg-[#4a2815]
                text-white
                text-xl
              "
            >
              ×
            </button>

            <h2 className="
              text-3xl
              sm:text-5xl
              font-serif
              mb-6
              text-center
            ">
              Como Jogar
            </h2>

            <div className="
              text-sm
              sm:text-lg
              leading-7
              sm:leading-9
              space-y-4
            ">
              <p>
                • Forme uma linha com 4 peças
                que compartilhem uma característica.
              </p>

              <p>
                • As peças podem ser:
                claras/escuras,
                altas/baixas,
                redondas/quadradas,
                maciças/vazadas.
              </p>

              <p>
                • O adversário escolhe a peça
                que você deve jogar.
              </p>

              <p>
                • Após posicionar sua peça,
                escolha uma para a IA.
              </p>

              <p>
                • Vence quem formar uma linha
                horizontal, vertical ou diagonal.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* VITÓRIA */}
      {winner && (
        <div className="
          fixed inset-0
          bg-black/70
          flex items-center justify-center
          z-50
          p-4
        ">
          <div className="
            bg-[#e0c39a]
            border
            border-[#7b5232]
            rounded-[40px]
            p-8
            sm:p-12
            shadow-2xl
            flex
            flex-col
            items-center
          ">

            <h2 className="
              text-4xl
              sm:text-6xl
              mb-8
              text-[#4a2815]
              font-serif
              text-center
            ">
              {winner} venceu!
            </h2>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                px-8
                py-4
                rounded-2xl
                text-lg
                sm:text-2xl
                bg-gradient-to-b
                from-[#8a5a2f]
                to-[#4a2815]
                border
                border-[#c9a06b]
                hover:scale-105
                transition-all
                text-white
              "
            >
              Nova Partida
            </button>

          </div>
        </div>
      )}
    </>
  );
}