// Shader Core — Satin
// https://movin.design/shaders · free with attribution
import { createShader } from '@shader-core/js';
import silk from '@shader-core/layers/silk';
import grain from '@shader-core/layers/grain';

const canvas = document.querySelector('.satin-background');

if (canvas instanceof HTMLCanvasElement) {
  try {
    createShader(canvas, [
      {
        layer: silk,
        speed: 0.24,
        folds: 3,
        spacing: 0.035,
        gap: 0.42,
        sway: 0.18,
        curl: 3.1,
        phase: 0.62,
        twist: -1.7,
        angle: 0,
        width: 0.035,
        relief: 0.13,
        glowX: 0.1,
        glowSize: 0.55,
        colorEdge: '#d4d9e7',
        colorBody: '#f5f6fa',
        colorLight: '#ffffff',
      },
      { layer: grain, intensity: 0.035, scale: 1, speed: 0.25 },
    ], {
      quality: 'auto',
      reducedMotion: 'static',
      onError: error => {
        console.warn('Satin background is unavailable; using the plain white fallback.', error);
      },
    });
  } catch (error) {
    console.warn('Satin background is unavailable; using the plain white fallback.', error);
  }
}