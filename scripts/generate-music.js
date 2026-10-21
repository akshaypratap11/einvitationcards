const fs = require('fs');
const path = require('path');

function generateWav(filename, notes, durationPerNote = 0.5, bpm = 100, isFlute = false) {
  const sampleRate = 22050;
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const noteDuration = (60 / bpm) * durationPerNote;
  const totalDuration = notes.length * noteDuration;
  const numSamples = Math.floor(sampleRate * totalDuration);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22); // NumChannels
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  let sampleIndex = 0;

  for (let n = 0; n < notes.length; n++) {
    const freq = notes[n];
    const samplesThisNote = Math.floor(sampleRate * noteDuration);

    for (let i = 0; i < samplesThisNote; i++) {
      const t = i / sampleRate;
      let sampleVal = 0;

      if (freq > 0) {
        // Attack-Decay-Sustain-Release envelope
        const env = Math.sin((Math.PI * i) / samplesThisNote);

        if (isFlute) {
          // Soft flute: pure sine with slight vibrato and gentle breath warmth
          const vibrato = Math.sin(2 * Math.PI * 5 * t) * 3;
          const s1 = Math.sin(2 * Math.PI * (freq + vibrato) * t);
          const s2 = 0.25 * Math.sin(2 * Math.PI * (freq * 2) * t);
          const drone = 0.15 * Math.sin(2 * Math.PI * 146.83 * t); // D drone
          sampleVal = (s1 + s2 + drone) * env * 0.45;
        } else {
          // Acoustic / Shehnai: rich harmonics
          const s1 = Math.sin(2 * Math.PI * freq * t);
          const s2 = 0.4 * Math.sin(2 * Math.PI * (freq * 2) * t);
          const s3 = 0.2 * Math.sin(2 * Math.PI * (freq * 3) * t);
          sampleVal = (s1 + s2 + s3) * env * 0.4;
        }
      }

      const clamped = Math.max(-1, Math.min(1, sampleVal));
      const int16 = Math.floor(clamped * 32767);
      buffer.writeInt16LE(int16, offset);
      offset += 2;
      sampleIndex++;
    }
  }

  const outPath = path.join(__dirname, '..', 'public', 'music', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${outPath} (${buffer.length} bytes)`);
}

// 1. Royal Sitar & Shehnai (Raag Bhupali / Yaman scale: C4, D4, E4, G4, A4, C5)
const shehnaiNotes = [
  261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00,
  329.63, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00,
  329.63, 293.66, 261.63, 293.66, 329.63, 261.63, 0, 261.63
];
generateWav('shehnai-festive.mp3', shehnaiNotes, 0.6, 92, false);

// 2. Celebration Beats (Joyful Bright Chords Arpeggios)
const celebrationNotes = [
  261.63, 329.63, 392.00, 523.25, 293.66, 369.99, 440.00, 587.33,
  329.63, 392.00, 493.88, 659.25, 349.23, 440.00, 523.25, 698.46,
  392.00, 493.88, 587.33, 783.99, 523.25, 392.00, 329.63, 261.63
];
generateWav('celebration-cheer.mp3', celebrationNotes, 0.45, 116, false);

// 3. Devotional Temple Flute (Raag Yaman serene flute with gentle drone)
const fluteNotes = [
  293.66, 329.63, 369.99, 440.00, 493.88, 554.37, 587.33, 554.37,
  493.88, 440.00, 369.99, 440.00, 493.88, 440.00, 369.99, 329.63,
  293.66, 0, 293.66, 329.63, 369.99, 293.66, 0, 293.66
];
generateWav('temple-flute.mp3', fluteNotes, 0.75, 78, true);
