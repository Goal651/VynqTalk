
import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function useCamera() {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = useCallback(() => {
    setIsOpen(true);
    
    setTimeout(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          })
          .catch((error) => {
            console.error("Error accessing camera:", error);
          });
      }
    }, 100);
  }, [videoRef]);

  const closeCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsOpen(false);
  }, [videoRef]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const width = video.videoWidth;
      const height = video.videoHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        closeCamera();
      }
    }
  }, [videoRef, canvasRef, closeCamera]);

  const CameraDialog = (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCamera()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take a photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full overflow-hidden rounded-md bg-black aspect-video">
            <video ref={videoRef} className="w-full h-full object-cover" />
          </div>
          <div className="flex justify-center">
            <Button type="button" 
              variant="default" 
              onClick={takePhoto}
              className="rounded-full w-16 h-16 p-0 flex items-center justify-center"
            >
              <Camera size={24} />
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    openCamera,
    capturedImage,
    CameraDialog,
    setCapturedImage
  };
}
