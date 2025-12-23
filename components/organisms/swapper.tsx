"use client";

import { ReactNode, useEffect, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import { useActiveTab } from "@/lib/hooks/use-search-params";

interface SwapperProps {
  children: ReactNode[];
  className?: string;
}

const TABS_ORDER = ["habits", "statistics", "settings"] as const;

export function Swapper({ children, className }: SwapperProps) {
  const { activeTab, setActiveTab } = useActiveTab();
  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Calcula a posição base em pixels baseada no índice atual
  const baseX = useMotionValue(0);

  // Sincroniza a posição base quando a tab muda com animação
  useEffect(() => {
    const width = containerRef.current?.offsetWidth || 0;
    const targetX = -currentIndex * width;
    
    // Anima a posição base suavemente usando a função animate do framer-motion
    const controls = animate(baseX, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    
    // Reseta o offset do drag
    x.set(0);
    
    return () => controls.stop();
  }, [activeTab, currentIndex, baseX, x]);

  // Calcula o índice baseado na posição X
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const width = containerRef.current?.offsetWidth || 0;
    const threshold = width * 0.3; // 30% da largura para trocar
    const velocity = info.velocity.x;
    let newIndex = currentIndex;

    // Se a velocidade for alta, troca mesmo com pouco movimento
    if (Math.abs(velocity) > 500) {
      if (velocity < 0 && currentIndex < TABS_ORDER.length - 1) {
        // Swipe para esquerda - próxima página
        newIndex = currentIndex + 1;
      } else if (velocity > 0 && currentIndex > 0) {
        // Swipe para direita - página anterior
        newIndex = currentIndex - 1;
      }
    } else if (Math.abs(info.offset.x) > threshold) {
      // Movimento suficiente para trocar
      if (info.offset.x < 0 && currentIndex < TABS_ORDER.length - 1) {
        // Swipe para esquerda - próxima página
        newIndex = currentIndex + 1;
      } else if (info.offset.x > 0 && currentIndex > 0) {
        // Swipe para direita - página anterior
        newIndex = currentIndex - 1;
      }
    }

    if (newIndex !== currentIndex) {
      setActiveTab(TABS_ORDER[newIndex]);
    } else {
      // Se não trocou, anima de volta para a posição atual
      x.set(0);
    }
  };

  // Calcula a posição X final: posição base + offset do drag
  const translateX = useTransform([baseX, x], ([base, offset]) => {
    return base + offset;
  });

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className || ""}`}
      style={{ 
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Renderiza todas as telas lado a lado */}
      <motion.div
        drag="x"
        dragConstraints={() => {
          const width = containerRef.current?.offsetWidth || 0;
          if (currentIndex === 0) {
            return { left: -width, right: 0 };
          } else if (currentIndex === TABS_ORDER.length - 1) {
            return { left: 0, right: width };
          } else {
            return { left: -width, right: width };
          }
        }}
        dragElastic={0.1}
        dragMomentum={false}
        dragDirectionLock={true}
        onDragEnd={handleDragEnd}
        className="flex w-full h-full"
        style={{ 
          x: translateX,
          willChange: "transform"
        }}
      >
        {children.map((child, index) => (
          <div
            key={TABS_ORDER[index]}
            className="w-full h-full flex-shrink-0"
            style={{ minWidth: "100%", width: "100%" }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
