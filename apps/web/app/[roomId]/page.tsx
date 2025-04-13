"use client";
import { IconTrash } from "@tabler/icons-react";
// import { useParams } from "next/navigation"
import { useRef, useState } from "react";
import { swatchColors } from "../utils.ts/swatches";  
// import { WS_URL } from "../../utils.ts";

export interface DrawData {
  x: number;
  y: number;
  color: string;
  lineWidth: number;
  end: boolean;
}

const Game = () => {
  // const params = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawData = useRef<DrawData[]>([]);
  const [color, setColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const myTurn = true;
  let drawing = false;


  function getCoords(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    if (!point) return { x: 0, y: 0 };
    return {
      x: ((point.clientX - rect.left) * canvasRef.current.width) / rect.width,
      y: ((point.clientY - rect.top) * canvasRef.current.height) / rect.height,
    };
  }

  function startDrawing(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) {
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

  function draw(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) {
    if (!drawing || !canvasRef.current) return;
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
    if (drawData.current)
    drawData.current.push({ x, y, color: color, lineWidth: brushWidth, end: false });
  }

  function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
    if(!drawData.current)return;
    if (drawData.current.length > 0) {
      const lastDrawData = drawData.current[drawData.current.length - 1];
      if (lastDrawData)
      lastDrawData.end = true;
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
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
      <canvas
          className="bg-white border-2 border-black cursor-crosshair"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onTouchStart={startDrawing}
          onMouseMove={draw}
          onTouchMove={draw}
          onMouseUp={stopDrawing}
          onTouchEnd={stopDrawing}
          onWheel={handleScroll}
          width={800}
          height={600}
        />
        <div className="flex gap-4">
          <input
            type="color"
            className="h-10 cursor-pointer"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
          />
          <div className="grid grid-cols-10">
            {swatchColors.map((swatch, idx) => (
              <button
                key={swatch}
                title={idx === 0 ? "Basic" : swatch}
                className={`w-8 h-8 cursor-pointer border-2 ${
                  color === swatch ? "black" : "border-white"
                } shadow-sm`}
                style={{ backgroundColor: swatch }}
                onClick={() => setColor(swatch)}
              />
            ))}
          </div>
          <div className="flex w-10 h-10 border-2 border-black justify-center items-center">
            <div style={{width: brushWidth, height: brushWidth, backgroundColor: color, borderRadius: "100%"}} />
          </div>
          <IconTrash size={40} onClick={clearCanvas} className="cursor-pointer" />
        </div>
        
      </div>
    </div>
  );
};

export default Game;
