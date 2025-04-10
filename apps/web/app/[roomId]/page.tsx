"use client";
import { IconTrash } from "@tabler/icons-react";
import { useParams } from "next/navigation"
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import { swatchColors } from "../utils.ts/swatches";  
import { WS_URL } from "../utils.ts";

const Game = () => {
  const params = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}`)

    ws.onopen = () => {
        ws.send(JSON.stringify({
            type: "JOIN_ROOM",
            roomId: params.roomId
        }))
        setSocket(ws);
    }

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (
          message.type === "CANVAS_UPDATE"
        ) {
            console.log("Receving update");
          const canvasData = message.canvas;
          if (fabricCanvasRef.current) {
            fabricCanvasRef.current.loadFromJSON(canvasData, () => {
              fabricCanvasRef.current?.requestRenderAll();
            });
          }
        }
      };
    
}, [params])

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
        const delta = options.e.deltaY > 0 ? 1 : -1;
        setBrushWidth((prev) => {
            const newWidth = Math.max(5, Math.min(30, prev + delta));
            return newWidth;
        });
      })

      fabricCanvas.on("path:created", () => {
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "CANVAS_UPDATE",
              canvas: fabricCanvas.toJSON(),
            })
          );
        }
      });
      
      fabricCanvasRef.current = fabricCanvas;
    }


    return () => {
      fabricCanvas.dispose();
    };
  }, [socket]);

  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      fabricCanvasRef.current.freeDrawingBrush.width = brushWidth;
    }
  }, [color, brushWidth]);


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
          <IconTrash size={40} onClick={() => fabricCanvasRef.current?.clear()} className="cursor-pointer" />
        </div>
        
      </div>
    </div>
  );
};

export default Game;
