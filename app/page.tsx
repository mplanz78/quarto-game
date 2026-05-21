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
        ? "w-10 h-16"
        : "w-14 h-24"
      : size === "small"
      ? "w-10 h-10"
      : "w-14 h-14";

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
            : "rounded-xl"
        }

        ${
          !piece.filled
            ? "opacity-70"
            : ""
        }
      `}
    >
      {/* brilho */}
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

      {/* furo */}
      {!piece.filled && (
        <div
          className="
            absolute
            top-2
            left-1/2
            -translate-x-1/2
            w-3
            h-3
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

  // IA escolhe peça
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

  // IA joga
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
    }, 1000);

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
      {/* TELA INICIAL */}
      {!gameStarted && (
        <div className="
          fixed inset-0
          bg-[#c9a06b]
          flex items-center justify-center
          z-50
        ">
          <div className="flex flex-col items-center">

            <h1 className="
              text-8xl
              text-[#4a2815]
              tracking-[12px]
              mb-10
              drop-shadow-2xl
              font-serif
            ">
              QUARTO
            </h1>

            <button
              onClick={() =>
                setGameStarted(true)
              }
              className="
                px-12
                py-5
                rounded-2xl
                text-2xl
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

      {/* JOGO */}
      <main className="
        min-h-screen
        bg-[#c9a06b]
        text-[#4a2815]
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-4
        relative
      ">

        {/* BOTÃO REGRAS */}
        <button
          onClick={() => setShowRules(true)}
          className="
            absolute
            top-4
            right-4
            px-5
            py-2
            rounded-xl
            bg-[#4a2815]
            text-[#f2d7a6]
            border
            border-[#7b5232]
            shadow-xl
            hover:scale-105
            transition-all
          "
        >
          Regras
        </button>

        {/* TÍTULO */}
        <h1 className="
          text-7xl
          font-serif
          tracking-[10px]
          mb-6
          text-[#4a2815]
          drop-shadow-2xl
        ">
          QUARTO
        </h1>

        {/* STATUS */}
        <div className="
          mb-6
          px-10
          py-3
          rounded-2xl
          border
          border-[#7b5232]
          bg-[#e0c39a]
          shadow-xl
          text-xl
        ">
          {phase === "PLAYER_PLACES" &&
            "Posicione sua peça"}

          {phase === "PLAYER_GIVES_AI" &&
            "Escolha uma peça para a IA"}

          {phase === "AI_PLACES" &&
            "IA pensando..."}
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="
          flex
          gap-10
          items-start
          mb-8
        ">

          {/* IA */}
          <div className="flex flex-col items-center">
            <div className="
              mb-3
              text-xl
              text-[#4a2815]
              font-serif
            ">
              Peça da IA
            </div>

            <div className="
              w-32
              h-32
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
            p-6
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
              gap-4
            ">
              {board.map((piece, index) => (
                <div
                  key={index}
                  onClick={() =>
                    placePlayerPiece(index)
                  }
                  className="
                    w-24
                    h-24
                    rounded-full
                    bg-[#6e4a2f]
                    border-4
                    border-[#7b5232]
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
          <div className="flex flex-col items-center">
            <div className="
              mb-3
              text-xl
              text-[#4a2815]
              font-serif
            ">
              Sua peça
            </div>

            <div className="
              w-32
              h-32
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
          p-5
          rounded-[30px]
          bg-gradient-to-b
          from-[#e0c39a]
          to-[#c9a06b]
          border
          border-[#7b5232]
          shadow-2xl
        ">

          <div className="
            text-center
            mb-4
            text-xl
            font-serif
            text-[#4a2815]
          ">
            ESTOQUE - ESCOLHA UMA PEÇA PARA A IA
          </div>

          <div className="
            flex
            gap-3
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
                  w-20
                  h-20
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

      {/* MODAL REGRAS */}
      {showRules && (
        <div className="
          fixed inset-0
          bg-black/60
          flex items-center justify-center
          z-50
        ">

          <div className="
            max-w-2xl
            bg-[#f2d7a6]
            text-[#4a2815]
            p-10
            rounded-[40px]
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
                top-4
                right-4
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
              text-5xl
              font-serif
              mb-8
              text-center
            ">
              Como Jogar
            </h2>

            <div className="
              text-lg
              leading-9
              space-y-5
            ">

              <p>
                • O objetivo é formar uma linha
                com 4 peças que compartilhem
                pelo menos UMA característica.
              </p>

              <p>
                • As peças podem ser:
                claras ou escuras,
                altas ou baixas,
                redondas ou quadradas,
                maciças ou vazadas.
              </p>

              <p>
                • Você NÃO escolhe a peça que vai jogar.
                Seu adversário escolhe para você.
              </p>

              <p>
                • Primeiro, posicione a peça recebida
                no tabuleiro.
              </p>

              <p>
                • Depois, escolha uma peça do estoque
                para a IA posicionar.
              </p>

              <p>
                • Vence quem completar uma linha
                horizontal, vertical ou diagonal
                com uma característica em comum.
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
        ">
          <div className="
            bg-[#e0c39a]
            border
            border-[#7b5232]
            rounded-[40px]
            p-12
            shadow-2xl
            flex
            flex-col
            items-center
          ">

            <h2 className="
              text-6xl
              mb-8
              text-[#4a2815]
              font-serif
            ">
              {winner} venceu!
            </h2>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                px-10
                py-4
                rounded-2xl
                text-2xl
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