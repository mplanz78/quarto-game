const renderPiece = (piece: Piece) => {
  const isLight = piece.color === "light";

  const pieceStyle = isLight
    ? {
        background: "linear-gradient(145deg, #f5e2c4, #c9ae86)",
        boxShadow: `
          inset -4px -4px 8px rgba(255,255,255,0.45),
          inset 4px 4px 8px rgba(120,90,40,0.25),
          0 0 12px rgba(255,235,190,0.9),
          0 8px 18px rgba(0,0,0,0.45)
        `,
        border: "2px solid #e8d2a8",
      }
    : {
        background: "linear-gradient(145deg, #4b1f12, #1f0b06)",
        boxShadow: `
          inset -4px -4px 8px rgba(255,255,255,0.08),
          inset 4px 4px 8px rgba(0,0,0,0.45),
          0 8px 18px rgba(0,0,0,0.55)
        `,
        border: "2px solid #5f2b1d",
      };

  const commonStyle = {
    width: "70%",
    height: "70%",
    position: "relative" as const,
    transition: "all 0.2s ease",
  };

  if (piece.shape === "round") {
    return (
      <div
        style={{
          ...commonStyle,
          borderRadius: "9999px",
          ...pieceStyle,
        }}
      >
        {piece.hole && (
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "18%",
              height: "18%",
              borderRadius: "9999px",
              background: "rgba(0,0,0,0.35)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        ...commonStyle,
        borderRadius: "12px",
        ...pieceStyle,
      }}
    >
      {piece.hole && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "18%",
            height: "18%",
            borderRadius: "9999px",
            background: "rgba(0,0,0,0.35)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          }}
        />
      )}
    </div>
  );
};