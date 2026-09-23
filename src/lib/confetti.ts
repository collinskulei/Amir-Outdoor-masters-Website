import confetti from "canvas-confetti";

/** A celebratory burst in brand colors, used on lead/quote form success. */
export function fireConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#679c3f", "#c67f3c", "#2f6650", "#a4cb80"];
  const common = { colors, disableForReducedMotion: true };

  confetti({ ...common, particleCount: 70, spread: 70, origin: { x: 0.3, y: 0.6 }, angle: 60 });
  confetti({ ...common, particleCount: 70, spread: 70, origin: { x: 0.7, y: 0.6 }, angle: 120 });
  confetti({ ...common, particleCount: 50, spread: 100, origin: { x: 0.5, y: 0.5 }, startVelocity: 45 });
}
