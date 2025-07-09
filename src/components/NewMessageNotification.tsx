import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NewMessageNotificationProps {
  show: boolean;
  count: number;
  onClose: () => void;
  onClick: () => void;
}

export const NewMessageNotification: React.FC<NewMessageNotificationProps> = ({
  show,
  count,
  onClose,
  onClick,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notificationRef.current) return;

    if (show) {
      // Entrance animation
      gsap.fromTo(
        notificationRef.current,
        {
          opacity: 0,
          y: -100,
          scale: 0.8,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.6,
          ease: "back.out(1.4)",
        },
      );

      // Pulsing animation
      gsap.to(notificationRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Exit animation
      gsap.to(notificationRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card
        ref={notificationRef}
        className="bg-gradient-to-r from-festival-pink to-festival-magenta border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 min-w-[300px] cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {count} New Message{count > 1 ? "s" : ""}!
              </h3>
              <p className="text-white/80 text-sm">
                Click to view your conversations
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:bg-white/20 border-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewMessageNotification;
