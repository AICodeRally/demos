/**
 * DraftSounds — Web Audio API synthesized sound effects for the NFL Draft simulator.
 * Singleton pattern. All sounds are generated programmatically (no external files).
 * Safe to import on the server (all methods no-op when `window` is undefined).
 */

class DraftSounds {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.5;
  private muted = false;

  // ── Lazy-init AudioContext on first user interaction ──────────────────
  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private getMaster(): GainNode | null {
    this.ensureContext();
    return this.masterGain;
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  private playTone(
    frequency: number,
    startOffset: number,
    duration: number,
    gainValue: number,
    type: OscillatorType = "sine",
    fadeOut = true,
  ) {
    const ctx = this.ensureContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    const start = ctx.currentTime + startOffset;
    const end = start + duration;

    gain.gain.setValueAtTime(gainValue, start);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.001, end);
    }

    osc.connect(gain);
    gain.connect(master);

    osc.start(start);
    osc.stop(end);
  }

  private playNoise(
    startOffset: number,
    duration: number,
    gainValue: number,
    highpass = 0,
  ) {
    const ctx = this.ensureContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    const start = ctx.currentTime + startOffset;
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    if (highpass > 0) {
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = highpass;
      source.connect(filter);
      filter.connect(gain);
    } else {
      source.connect(gain);
    }

    gain.connect(master);
    source.start(start);
    source.stop(start + duration);
  }

  // ── Public API ────────────────────────────────────────────────────────

  /**
   * Dramatic "pick is in" chime — two quick ascending notes (broadcast style).
   */
  pickIsIn() {
    // First note: E5
    this.playTone(659.25, 0, 0.25, 0.3, "sine");
    this.playTone(659.25, 0, 0.25, 0.1, "triangle");
    // Second note: A5 (a fourth up, bright and resolved)
    this.playTone(880.0, 0.15, 0.35, 0.35, "sine");
    this.playTone(880.0, 0.15, 0.35, 0.12, "triangle");
    // Subtle shimmer on second note
    this.playTone(1760.0, 0.15, 0.3, 0.04, "sine");
  }

  /**
   * Subtle clock tick — very short, quiet click.
   */
  clockTick() {
    // Short high-frequency click via noise burst
    this.playNoise(0, 0.015, 0.08, 3000);
    // Tiny tonal ping for body
    this.playTone(1200, 0, 0.02, 0.04, "sine");
  }

  /**
   * Attention-grabbing triple-beep — "it's your turn!"
   */
  userTurn() {
    const gap = 0.12;
    // Three ascending quick beeps
    this.playTone(880, 0, 0.09, 0.25, "sine");
    this.playTone(880, 0, 0.09, 0.08, "triangle");

    this.playTone(1046.5, gap, 0.09, 0.28, "sine");
    this.playTone(1046.5, gap, 0.09, 0.09, "triangle");

    this.playTone(1318.5, gap * 2, 0.12, 0.3, "sine");
    this.playTone(1318.5, gap * 2, 0.12, 0.1, "triangle");
  }

  /**
   * Celebration fanfare — ascending chord progression, ~1.5 seconds.
   */
  draftComplete() {
    // Chord 1: C major (C4, E4, G4)
    this.playTone(261.63, 0, 0.6, 0.18, "sine");
    this.playTone(329.63, 0, 0.6, 0.14, "sine");
    this.playTone(392.0, 0, 0.6, 0.14, "sine");
    // Soft brass feel
    this.playTone(261.63, 0, 0.5, 0.06, "sawtooth");

    // Chord 2: F major (F4, A4, C5)
    this.playTone(349.23, 0.4, 0.6, 0.2, "sine");
    this.playTone(440.0, 0.4, 0.6, 0.16, "sine");
    this.playTone(523.25, 0.4, 0.6, 0.16, "sine");
    this.playTone(349.23, 0.4, 0.5, 0.07, "sawtooth");

    // Chord 3: G major (G4, B4, D5) — triumphant resolve
    this.playTone(392.0, 0.8, 0.7, 0.22, "sine");
    this.playTone(493.88, 0.8, 0.7, 0.18, "sine");
    this.playTone(587.33, 0.8, 0.7, 0.18, "sine");
    this.playTone(392.0, 0.8, 0.6, 0.08, "sawtooth");

    // Top sparkle on final chord
    this.playTone(1174.66, 0.85, 0.5, 0.05, "sine");
  }

  /**
   * Soft processing hum — barely audible, indicates CPU is thinking.
   */
  cpuPicking() {
    // Very low, very quiet hum
    this.playTone(120, 0, 0.4, 0.04, "sine", true);
    this.playTone(180, 0, 0.35, 0.02, "sine", true);
  }

  /**
   * Set master volume (0 to 1).
   */
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.setValueAtTime(
        this.volume,
        this.ctx?.currentTime ?? 0,
      );
    }
  }

  /**
   * Toggle global mute.
   */
  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : this.volume,
        this.ctx?.currentTime ?? 0,
      );
    }
  }

  /**
   * Resume AudioContext — call on first user gesture for mobile browser support.
   */
  async resume() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
  }
}

export const draftSounds = new DraftSounds();
export { DraftSounds };
