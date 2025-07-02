import { useNavigate, useLocation } from "react-router-dom";
import NeubrutalistDock from "@/components/ui/dock";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HomeIcon,
  Briefcase,
  FolderOpen,
  Users,
  Phone,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClickSound } from "@/hooks/use-click-sound";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;
const MOBILE_DOCK_HEIGHT = 80;
const MOBILE_MAGNIFICATION = 60;
const MOBILE_DISTANCE = 100;
const MOBILE_PANEL_HEIGHT = 48;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within an DockProvider");
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const isMobile = useIsMobile();

  const maxHeight = useMemo(() => {
    const dockHeight = isMobile ? MOBILE_DOCK_HEIGHT : DOCK_HEIGHT;
    const mag = isMobile ? MOBILE_MAGNIFICATION : magnification;
    return Math.max(dockHeight, mag + mag / 2 + 4);
  }, [magnification, isMobile]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: "none",
      }}
      className="mx-2 flex max-w-full items-end overflow-x-auto"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          "mx-auto flex w-fit gap-4 border-4 border-black bg-gradient-to-r from-lime-200 via-green-200 to-emerald-200 px-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          className,
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, onClick }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { playClickSound } = useClickSound();

  const { distance, magnification, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const minSize = isMobile ? 32 : 40;
  const maxSize = isMobile ? MOBILE_MAGNIFICATION : magnification;
  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [minSize, maxSize, minSize],
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={() => {
        playClickSound();
        onClick?.();
      }}
      className={cn(
        "relative inline-flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-100 cursor-pointer",
        className,
      )}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, {
          style: { width },
          isHovered,
        }),
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps["isHovered"] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-8 left-1/2 w-fit whitespace-pre border-3 border-black bg-yellow-300 px-3 py-1 text-sm font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
            className,
          )}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const style = restProps["style"] as React.CSSProperties | undefined;
  const width = style?.width as MotionValue<number>;

  const widthTransform = useTransform(width, (val) => val / 2);

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const scrollToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const data = [
    {
      title: "Home",
      icon: <HomeIcon className="h-full w-full text-black" />,
      action: () => scrollToHome(),
      color: "bg-yellow-400",
    },
    {
      title: "Our Services",
      icon: <Briefcase className="h-full w-full text-black" />,
      action: () => scrollToSection("services"),
      color: "bg-pink-400",
    },
    {
      title: "Portfolio",
      icon: <FolderOpen className="h-full w-full text-black" />,
      action: () => scrollToSection("portfolio"),
      color: "bg-cyan-400",
    },
    {
      title: "About Us",
      icon: <Users className="h-full w-full text-black" />,
      action: () => scrollToSection("about"),
      color: "bg-green-400",
    },
    {
      title: "Contact us",
      icon: <Phone className="h-full w-full text-black" />,
      action: () => scrollToSection("contact"),
      color: "bg-purple-400",
    },
  ];

  const submitButton = {
    title: "Submit Request",
    icon: <Send className="h-full w-full text-black" />,
    action: () => navigate("/start-project"),
    color: "bg-orange-200",
  };

  return (
    <div
      className={cn(
        "fixed left-1/2 max-w-full -translate-x-1/2 z-50",
        isMobile ? "bottom-2" : "bottom-4",
      )}
    >
      <Dock
        className={cn("items-end", isMobile ? "pb-2" : "pb-3")}
        magnification={isMobile ? MOBILE_MAGNIFICATION : DEFAULT_MAGNIFICATION}
        distance={isMobile ? MOBILE_DISTANCE : DEFAULT_DISTANCE}
        panelHeight={isMobile ? MOBILE_PANEL_HEIGHT : DEFAULT_PANEL_HEIGHT}
      >
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className={`aspect-square ${item.color} hover:rotate-3 transition-transform duration-100`}
            onClick={item.action}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
        <DockItem
          className={`aspect-square ${submitButton.color} hover:rotate-1 transition-transform duration-100`}
          onClick={submitButton.action}
        >
          <DockLabel>{submitButton.title}</DockLabel>
          <DockIcon>{submitButton.icon}</DockIcon>
        </DockItem>
      </Dock>
    </div>
  );
};

export default Navigation;
