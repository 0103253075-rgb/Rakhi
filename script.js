/**
 * Bespoke Raksha Bandhan Digital Keepsake Experience
 * Interactive controller & gentle ambient soundscape synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const gatefoldScreen = document.getElementById('gatefoldScreen');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const mainExperience = document.getElementById('mainExperience');
  const audioControlBar = document.getElementById('audioControlBar');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  const heroSection = document.getElementById('heroSection');
  const rakhiTrigger = document.getElementById('rakhiTrigger');
  const rakhiHiddenMessage = document.getElementById('rakhiHiddenMessage');
  const replayBtn = document.getElementById('replayBtn');
  const revealItems = document.querySelectorAll('.reveal-item');

  let isAudioPlaying = false;
  let audioEngine = null;

  /* ==========================================================================
     1. OPENING GATEFOLD EXPERIENCE
     ========================================================================== */
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', () => {
      // 1. Fade out gatefold screen
      gatefoldScreen.classList.add('hidden');
      mainExperience.classList.add('unlocked');
      
      // 2. Reveal audio control
      setTimeout(() => {
        audioControlBar.classList.add('visible');
      }, 800);

      // 3. Trigger initial reveal for hero elements
      setTimeout(() => {
        triggerHeroReveal();
      }, 400);

      // 4. Initialize and start peaceful ambient soundscape gently
      initAudio();
      playAmbientSound();
      
      // 5. Play soft interaction chime
      playChime(528, 0.2);
    });
  }

  /* ==========================================================================
     2. SCROLL-DRIVEN INTERSECTION OBSERVER REVEALS
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const delay = item.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
          item.classList.add('is-revealed');
        }, parseInt(delay, 10));

        observer.unobserve(item);
      }
    });
  }, observerOptions);

  function triggerHeroReveal() {
    const heroReveals = heroSection.querySelectorAll('.reveal-item');
    heroReveals.forEach(item => {
      const delay = item.getAttribute('data-delay') || 0;
      setTimeout(() => {
        item.classList.add('is-revealed');
      }, parseInt(delay, 10));
    });
  }

  // Observe all below-the-fold reveal items
  revealItems.forEach(item => {
    if (!heroSection.contains(item)) {
      revealObserver.observe(item);
    }
  });

  /* ==========================================================================
     3. INTERACTIVE RAKHI DETAIL PROMISE
     ========================================================================== */
  if (rakhiTrigger && rakhiHiddenMessage) {
    const toggleRakhiPromise = () => {
      const isAlreadyActive = rakhiHiddenMessage.classList.contains('is-active');
      
      if (!isAlreadyActive) {
        rakhiHiddenMessage.classList.add('is-active');
        const tapHint = rakhiTrigger.querySelector('.tap-text');
        if (tapHint) tapHint.textContent = 'Our Sacred Bond ✨';
        playRakhiHarmonics();
      } else {
        rakhiHiddenMessage.classList.toggle('is-active');
      }
    };

    rakhiTrigger.addEventListener('click', toggleRakhiPromise);
    rakhiTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleRakhiPromise();
      }
    });
  }

  /* ==========================================================================
     4. REPLAY EXPERIENCE
     ========================================================================== */
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      playChime(660, 0.15);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     5. PROCEDURAL AMBIENT SOUNDSCAPE SYNTHESIZER (Web Audio API)
     Zero-latency, ultra-peaceful meditative Indian acoustic resonances
     ========================================================================== */
  function initAudio() {
    if (audioEngine) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      
      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Low pass filter for warm organic warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.connect(masterGain);

      audioEngine = {
        ctx,
        masterGain,
        filter,
        nodes: [],
        intervalId: null
      };
    } catch (e) {
      console.log('Audio Context initialization not supported or blocked');
    }
  }

  function playAmbientSound() {
    if (!audioEngine) initAudio();
    if (!audioEngine) return;

    if (audioEngine.ctx.state === 'suspended') {
      audioEngine.ctx.resume();
    }

    // Smoothly fade in master volume
    const now = audioEngine.ctx.currentTime;
    audioEngine.masterGain.gain.cancelScheduledValues(now);
    audioEngine.masterGain.gain.setTargetAtTime(0.28, now, 1.8);

    // Drone frequencies: Indian Raag / Warm Tanpura harmonic pad (D, A, D)
    const baseFreqs = [146.83, 220.00, 293.66, 440.00]; // D3, A3, D4, A4
    
    stopAmbientSoundNodes();

    baseFreqs.forEach((freq, idx) => {
      const osc = audioEngine.ctx.createOscillator();
      const gain = audioEngine.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioEngine.ctx.currentTime);
      
      // Subtle micro-detune for organic warmth
      osc.detune.setValueAtTime((idx - 1.5) * 4, audioEngine.ctx.currentTime);

      gain.gain.setValueAtTime(0.04 / (idx + 1), audioEngine.ctx.currentTime);

      osc.connect(gain);
      gain.connect(audioEngine.filter);
      
      osc.start();
      audioEngine.nodes.push({ osc, gain });
    });

    // Gentle periodic harmonic chime (notes of D Major / Kalyan scale)
    const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
    audioEngine.intervalId = setInterval(() => {
      if (isAudioPlaying && audioEngine && audioEngine.ctx.state === 'running') {
        const randomFreq = scale[Math.floor(Math.random() * scale.length)];
        playChime(randomFreq, 0.08);
      }
    }, 4500);

    isAudioPlaying = true;
    updateSoundButtonUI(true);
  }

  function stopAmbientSoundNodes() {
    if (!audioEngine) return;
    
    if (audioEngine.intervalId) {
      clearInterval(audioEngine.intervalId);
      audioEngine.intervalId = null;
    }

    if (audioEngine.nodes) {
      audioEngine.nodes.forEach(node => {
        try {
          node.osc.stop();
          node.osc.disconnect();
        } catch (e) {}
      });
      audioEngine.nodes = [];
    }
  }

  function pauseAmbientSound() {
    if (!audioEngine) return;
    const now = audioEngine.ctx.currentTime;
    audioEngine.masterGain.gain.cancelScheduledValues(now);
    audioEngine.masterGain.gain.setTargetAtTime(0, now, 0.5);

    setTimeout(() => {
      stopAmbientSoundNodes();
    }, 550);

    isAudioPlaying = false;
    updateSoundButtonUI(false);
  }

  function updateSoundButtonUI(playing) {
    if (soundToggle) {
      if (playing) {
        soundToggle.classList.add('playing');
        soundLabel.textContent = 'Music: On';
      } else {
        soundToggle.classList.remove('playing');
        soundLabel.textContent = 'Music: Off';
      }
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAmbientSound();
      } else {
        playAmbientSound();
      }
    });
  }

  // Soft Interactive Chimes for Rakhi click & interactions
  function playChime(frequency = 528, volume = 0.15) {
    if (!audioEngine) return;
    try {
      if (audioEngine.ctx.state === 'suspended') audioEngine.ctx.resume();
      
      const now = audioEngine.ctx.currentTime;
      const osc = audioEngine.ctx.createOscillator();
      const gain = audioEngine.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      gain.connect(audioEngine.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.7);
    } catch (e) {}
  }

  function playRakhiHarmonics() {
    // Beautiful ascending arpeggio
    const notes = [293.66, 369.99, 440.00, 587.33, 739.99];
    notes.forEach((note, i) => {
      setTimeout(() => {
        playChime(note, 0.12);
      }, i * 140);
    });
  }

});
