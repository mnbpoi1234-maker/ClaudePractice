/** AudioContext 싱글톤 - 사용자 제스처 이후 생성 (브라우저 autoplay 정책) */
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * 합성음 비프를 재생한다.
 * @param frequency 주파수 (Hz)
 * @param duration 재생 시간 (초)
 * @param type 파형 종류
 */
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // 클릭음 방지를 위해 부드럽게 시작/종료
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // AudioContext 미지원 환경에서는 무음 처리
  }
}

/** 박수 입력 시 재생하는 효과음 (밝은 단음) */
export function playClapSound(): void {
  playTone(880, 0.12, 'triangle')
}

/** 게임 종료 시 재생하는 효과음 (낮은 하강음) */
export function playGameOverSound(): void {
  playTone(220, 0.4, 'sawtooth')
}
