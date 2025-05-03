"use client";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { swatchColors } from "../app/utils/swatches";
import { DrawData } from "@repo/common/types";
import { useAppContext } from "../app/context";
import { ClearBoard, ClientEvents, DrawingData, GameEvents } from "@repo/common";

const CanvasBoard = () => {
  const { socket, myTurn, game, me } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawData = useRef<DrawData[]>([]);
  const [color, setColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  let drawing = false;

  function getCoords(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    if (!point) return { x: 0, y: 0 };
    return {
      x: ((point.clientX - rect.left) * canvasRef.current.width) / rect.width,
      y: ((point.clientY - rect.top) * canvasRef.current.height) / rect.height,
    };
  }

  function startDrawing(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!myTurn) return;
    drawing = true;
    const { x, y } = getCoords(event);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    event.preventDefault();
  }

  function draw(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!drawing || !canvasRef.current || !game || !me) return;
    const { x, y } = getCoords(event);
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.lineWidth = brushWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    event.preventDefault();
    const data: DrawingData = {
      type: GameEvents.DRAW,
      drawData: {
        x,
        y,
        lineWidth: brushWidth,
        color,
        end: false,
      },
      gameId: game.gameId,
    };
    socket?.send(JSON.stringify(data));

    if (drawData.current) drawData.current.push(data.drawData);
  }

  function stopDrawing() {
    if (!drawing || !socket || !me || !game) return;
    drawing = false;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
    if (!drawData.current) return;
    if (drawData.current.length > 0) {
      const lastDrawData = drawData.current[drawData.current.length - 1];
      if (lastDrawData) {
        lastDrawData.end = true;
        const { x, y, lineWidth, color, end } = lastDrawData;
        const data: DrawingData = {
          type: GameEvents.DRAW,
          drawData: {
            x,
            y,
            lineWidth,
            color,
            end,
          },
          gameId: game.gameId,
        };
        socket.send(JSON.stringify(data));
      }
    }
  }

  function revieveDrawData(data: DrawData) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.lineWidth = data.lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = data.color;
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      if (data.end) ctx.beginPath();
    }
  }

  function handleScroll(event: React.WheelEvent<HTMLCanvasElement>) {
    const delta = event.deltaY > 0 ? 1 : -1;
    setBrushWidth((prev) => {
      const newWidth = Math.max(5, Math.min(30, prev + delta));
      return newWidth;
    });
  }

  function clearCanvas() {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawData.current = [];
    }
  }

  const handleClear = () => {
    if(!socket || !game) return;
    const data: ClearBoard = {type: GameEvents.CLEAR, gameId: game.gameId}
    socket.send(JSON.stringify(data));
    clearCanvas();
  }

  useEffect(() => {
    if (!socket) return;
  
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === ClientEvents.DRAW && myTurn === false) {
        const drawingData = data.drawData as DrawData;
        revieveDrawData(drawingData);
      }
      else if (data.type === ClientEvents.CLEAR) {
        clearCanvas()
      }
    };
  
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, myTurn]);
  

  return (
    <div className="flex flex-col gap-4 h-full">
      <canvas
        className={`h-full bg-white ${myTurn ? "cursor-crosshair" : "cursor-default"}`}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseMove={draw}
        onTouchMove={draw}
        onMouseUp={stopDrawing}
        onTouchEnd={stopDrawing}
        onWheel={handleScroll}
        width={900}
        height={900}
      />
      {myTurn ? (
        <div className="flex gap-4">
          <input
            type="color"
            className="h-10 cursor-pointer"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
          />
          <div className="grid grid-cols-10 gap-1 rounded-md p-1 bg-neutral-600">
            {swatchColors.map((swatch, idx) => (
              <button
                key={swatch}
                title={idx === 0 ? "Basic" : swatch}
                className={`w-7 h-7 cursor-pointer rounded-md border-2 ${
                  color === swatch ? "border-black" : "border-none"
                } shadow-sm`}
                style={{ backgroundColor: swatch }}
                onClick={() => setColor(swatch)}
              />
            ))}
          </div>
          <div className="flex w-10 h-10 border-2 border-black justify-center items-center">
            <div
              style={{
                width: brushWidth,
                height: brushWidth,
                backgroundColor: color,
                borderRadius: "100%",
              }}
            />
          </div>
          <IconTrash size={30} onClick={handleClear} className="cursor-pointer" />
        </div>
      ) : null}
    </div>
  );
};

export default CanvasBoard;
