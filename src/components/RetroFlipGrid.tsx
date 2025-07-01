import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RetroFlipGrid: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Portfolio images - using better quality design/portfolio images
  const portfolioImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop", // Architecture
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop", // Web design
    "https://images.unsplash.com/photo-1544435253-6e84c5d08e90?w=1200&auto=format&fit=crop", // Branding
    "https://images.unsplash.com/photo-1558888414-94fdb6c44ddd?w=1200&auto=format&fit=crop", // UI/UX
    "https://images.unsplash.com/photo-1549989473-b2778d9e9d8c?w=1200&auto=format&fit=crop", // Graphics
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop", // Photography
    "https://images.unsplash.com/photo-1513384312021-f8e785e2e654?w=1200&auto=format&fit=crop", // Print design
    "https://images.unsplash.com/photo-1520975869015-93cb92fec2df?w=1200&auto=format&fit=crop", // Digital art
    "https://images.unsplash.com/photo-1541987001257-c8942e277608?w=1200&auto=format&fit=crop", // Illustration
    "https://images.unsplash.com/photo-1573667209922-74a5d6a0c139?w=1200&auto=format&fit=crop", // Mobile app
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop", // Logo design
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&auto=format&fit=crop", // Packaging
    "https://images.unsplash.com/photo-1576859294744-8273f5be51dc?w=1200&auto=format&fit=crop", // 3D design
  ];

  // Create 4 rows of 7 images each (cycling through our portfolio images)
  const createRows = () => {
    const rows = [];
    for (let row = 0; row < 4; row++) {
      const rowImages = [];
      for (let col = 0; col < 7; col++) {
        const imageIndex = (row * 7 + col) % portfolioImages.length;
        rowImages.push(portfolioImages[imageIndex]);
      }
      rows.push(rowImages);
    }
    return rows;
  };

  const gridRows = createRows();

  // GSAP scroll animations
  useEffect(() => {
    if (!containerRef.current || !headerRef.current || !gridSectionRef.current)
      return;

    const ctx = gsap.context(() => {
      // Initial state - hide everything
      gsap.set([headerRef.current, gridSectionRef.current], {
        opacity: 0,
        y: 100,
        scale: 0.8,
      });

      // Header animation
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Grid section animation with stagger
      gsap.to(gridSectionRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridSectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      });

      // Individual grid rows animation
      const rows = gridSectionRef.current?.querySelectorAll(".grid-row");
      if (rows) {
        rows.forEach((row, index) => {
          gsap.fromTo(
            row,
            {
              opacity: 0,
              y: 80,
              rotateX: -15,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }

      // Scroll-out animations
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => {
          gsap.to([headerRef.current, gridSectionRef.current], {
            opacity: 0,
            y: -50,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          gsap.to([headerRef.current, gridSectionRef.current], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Drag-to-tilt interaction
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;

    if (!wrapper || !inner) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 25;
      inner.style.transform = `rotateX(${y}deg) rotateY(${x}deg) rotateZ(-8deg)`;
    };

    wrapper.addEventListener("pointermove", handlePointerMove);

    return () => {
      wrapper.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Modal handlers
  const openModal = (src: string) => {
    setModalImage(src);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
    document.body.style.overflow = "auto";
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <style jsx>{`
        .noise {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill-opacity=".05"><rect width="3" height="3"/><rect x="30" width="3" height="3"/><rect y="30" width="3" height="3"/><rect x="30" y="30" width="3" height="3"/></svg>');
          background-size: 60px 60px;
        }
        .floating {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .floating:hover {
          transform: translateY(-6px) scale(1.03);
        }
        @keyframes slideL {
          0%,
          100% {
            transform: translateX(40px);
          }
          50% {
            transform: translateX(-40px);
          }
        }
        @keyframes slideR {
          0%,
          100% {
            transform: translateX(-40px);
          }
          50% {
            transform: translateX(40px);
          }
        }
        .row-odd {
          animation: slideL 9s ease-in-out infinite;
        }
        .row-even {
          animation: slideR 7s ease-in-out infinite;
        }
        .perspective {
          perspective: 1200px;
          perspective-origin: 50% 30%;
        }
      `}</style>

      <div ref={containerRef} className="relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <h3
            className="text-3xl md:text-4xl font-bold tracking-tight text-festival-black mb-4"
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            RETRO PORTFOLIO GRID
          </h3>
          <p className="text-festival-black/80 text-lg">
            Interactive 3D grid showcasing our creative work
          </p>
        </div>

        {/* Perspective Grid */}
        <div
          ref={gridSectionRef}
          className="relative h-[600px] overflow-hidden flex items-center justify-center noise"
        >
          <div
            ref={wrapperRef}
            className="perspective w-full h-full flex items-center justify-center"
          >
            <div
              ref={innerRef}
              className="transform relative w-[160vw] h-[160vh] grid grid-rows-4 grid-cols-1 gap-5"
              style={{
                transform:
                  "rotateX(-8.69129deg) rotateY(-14.844deg) rotateZ(-8deg)",
              }}
            >
              {gridRows.map((rowImages, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`grid grid-cols-7 gap-5 grid-row ${
                    rowIndex % 2 === 0 ? "row-odd" : "row-even"
                  }`}
                >
                  {rowImages.map((image, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className="floating cursor-pointer rounded-xl overflow-hidden"
                      style={{
                        border: "4px solid #000",
                        boxShadow: "2px 2px 0 #000",
                      }}
                      whileHover={{ scale: 1.03, y: -6 }}
                      onClick={() => openModal(image)}
                    >
                      <div
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url('${image}')` }}
                      />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div
              className="relative w-[90vw] md:w-[70vw] h-[80vh] md:h-[70vh] rounded-2xl overflow-hidden"
              style={{
                border: "4px solid #000",
                boxShadow: "2px 2px 0 #000",
              }}
            >
              <img
                src={modalImage}
                alt="Portfolio item"
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 hover:rotate-12 transition"
                style={{
                  border: "4px solid #000",
                  boxShadow: "2px 2px 0 #000",
                }}
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default RetroFlipGrid;
