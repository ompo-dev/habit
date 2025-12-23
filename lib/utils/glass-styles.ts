/**
 * Glass Morphism Styles - Apple Style
 * Sistema de design com efeito de vidro fluido
 */

export const glassStyles = {
  // Vidro Primário - Para containers principais
  primary: "bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
  
  // Vidro Secundário - Para cards e elementos menores
  secondary: "bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]",
  
  // Vidro Terciário - Para elementos sutis
  tertiary: "bg-white/[0.03] backdrop-blur-lg border border-white/[0.05] shadow-sm",
  
  // Vidro Hover - Para estados de hover
  hover: "hover:bg-white/[0.12] hover:border-white/[0.16] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]",
  
  // Vidro Active - Para estados de clique
  active: "active:bg-white/[0.15] active:scale-[0.98]",
  
  // Vidro com cor Primary
  primaryColored: "bg-primary/20 backdrop-blur-2xl border border-primary/30 shadow-[0_8px_32px_0_rgba(139,92,246,0.3)]",
  
  // Vidro para Modals
  modal: "bg-background/95 backdrop-blur-3xl border border-white/[0.15] shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
  
  // Vidro para Headers/Navigation
  navigation: "bg-background/90 backdrop-blur-2xl border-b border-white/[0.1] shadow-[0_4px_24px_0_rgba(0,0,0,0.3)]",
  
  // Vidro para Buttons
  button: "bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-lg hover:bg-white/[0.12] hover:border-white/[0.18] active:scale-95",
  
  // Vidro Success (verde)
  success: "bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_24px_0_rgba(16,185,129,0.25)]",
  
  // Vidro Warning (laranja)
  warning: "bg-orange-500/20 backdrop-blur-xl border border-orange-500/30 shadow-[0_8px_24px_0_rgba(249,115,22,0.25)]",
  
  // Vidro Error (vermelho)
  error: "bg-red-500/20 backdrop-blur-xl border border-red-500/30 shadow-[0_8px_24px_0_rgba(239,68,68,0.25)]",
} as const;

// Classes combinadas para elementos específicos
export const glassElements = {
  card: `${glassStyles.secondary} rounded-2xl transition-all duration-300`,
  container: `${glassStyles.primary} rounded-3xl transition-all duration-300`,
  button: `${glassStyles.button} rounded-xl transition-all duration-200`,
  modal: `${glassStyles.modal} rounded-3xl transition-all duration-300`,
  navigation: `${glassStyles.navigation} transition-all duration-200`,
} as const;

