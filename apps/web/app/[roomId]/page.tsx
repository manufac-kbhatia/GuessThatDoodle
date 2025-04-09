"use client";
import { IconTrash } from "@tabler/icons-react";
// import { useParams } from "next/navigation"
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";

const swatchColors = [
    "#000000", // Basic Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Lime
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FFA500", // Orange
    "#800080", // Purple
    "#00FFFF", // Aqua / Cyan
    "#A52A2A", // Brown
    "#808080", // Gray
    "#FFC0CB", // Pink
    "#ADD8E6", // Light Blue
    "#90EE90", // Light Green
    "#FF69B4", // Hot Pink
    "#F5DEB3", // Wheat
    "#8B4513", // Saddle Brown
    "#2F4F4F", // Dark Slate Gray
    "#4682B4", // Steel Blue
    "#FFD700", // Gold
  ];
  

const Game = () => {
  // const params = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);


  useEffect(() => {
    let fabricCanvas: fabric.Canvas;
    const canvas = canvasRef.current
    if (canvas !== null) {
      fabricCanvas = new fabric.Canvas(canvas, {
        width: 800,
        height: 600,
        isDrawingMode: true,
      });
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.freeDrawingBrush.width = 5;

      fabricCanvas.on("mouse:wheel", (options) => {
        console.log('options', options);
        const delta = options.e.deltaY > 0 ? 1 : -1;
        setBrushWidth((prev) => {
            const newWidth = Math.max(5, Math.min(30, prev + delta));
            return newWidth;
        });
      })
      fabricCanvasRef.current = fabricCanvas;
    }


    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      fabricCanvasRef.current.freeDrawingBrush.width = brushWidth;
    }
  }, [color, brushWidth]);

  console.log("color", color);
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <canvas
          ref={canvasRef}
          className="inset-shadow-sm shadow-md rounded-md"
        />
        <div className="flex gap-4">
          <input
            type="color"
            className="h-10"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
          />
          <div className="grid grid-cols-10">
            {swatchColors.map((swatch, idx) => (
              <button
                key={swatch}
                title={idx === 0 ? "Basic" : swatch}
                className={`w-8 h-8 border-2 ${
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
          <IconTrash size={40} onClick={() => fabricCanvasRef.current?.clear()} />
        </div>
        
      </div>
    </div>
  );
};

export default Game;
