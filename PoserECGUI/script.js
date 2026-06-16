let isPaused = false;
let _fpsFrames = 0, _fpsLast = performance.now(), _fpsVal = 60;
let _fpsEl = document.getElementById('fpsDisplay');
function _fpsTick() {
  _fpsFrames++;
  let now = performance.now();
  if (now - _fpsLast >= 1000) {
    _fpsVal = Math.round(_fpsFrames * 1000 / (now - _fpsLast));
    if (_fpsEl) _fpsEl.textContent = _fpsVal + ' FPS';
    _fpsFrames = 0;
    _fpsLast = now;
  }
}
let lead1 = document.getElementById('lead1');
let lead2 = document.getElementById('lead2');
let lead3 = document.getElementById('lead3');
let lead4 = document.getElementById('lead4');
let lead5 = document.getElementById('lead5');
let lead6 = document.getElementById('lead6');
let lead7 = document.getElementById('lead7');
let lead8 = document.getElementById('lead8');
let lead9 = document.getElementById('lead9');
let lead10 = document.getElementById('lead10');
let lead11 = document.getElementById('lead11');
let lead12 = document.getElementById('lead12');
let currentHR = 75;
let currentHRk = 75;
let globalTime = 0;
let lastFrameTime = 0;
let linePosition = 0;
const LINE_SPEED = 1.25;
let canvasWidth = 0;
let allVerticalLines = null;
let currentWaveFunc = null;
let audioCtx = null;
let isAudioEnabled = false;
let lastPeakValue = 0;

let LastByH = 0;
let NextByH = 0;
let hlCanvases = [];

function toOneDecimalPlaceAndKeePositiveORnegativeFuckTheseCodesHaHaAndItIsAshitMountainIfYouDontWanttoItAndYouGetOut(num) {
  let fixed = num.toFixed(1);
  let hello = (-1 * fixed).toFixed(1);
  return num >= 0 ? `+${fixed}` : `-${hello}`;
}

document.getElementById("ByHeightFirst").addEventListener("input", function () {
  LastByH = parseFloat(this.value);
  document.getElementById('scaling1').innerHTML = toOneDecimalPlaceAndKeePositiveORnegativeFuckTheseCodesHaHaAndItIsAshitMountainIfYouDontWanttoItAndYouGetOut(LastByH) + "px";
});

document.getElementById("ByHeightSecond").addEventListener("input", function () {
  NextByH = parseFloat(this.value);
  document.getElementById('scaling2').innerHTML = toOneDecimalPlaceAndKeePositiveORnegativeFuckTheseCodesHaHaAndItIsAshitMountainIfYouDontWanttoItAndYouGetOut(NextByH) + "px";
});

function getECGNoise(t) {
  if (typeof getECGNoise.z === 'undefined') getECGNoise.z = 0;
  const A = -3;
  const B = 3;
  const F = 0.8;
  let min = getECGNoise.z - F;
  let max = getECGNoise.z + F;
  if (min < A) min = A;
  if (max > B) max = B;
  getECGNoise.z = min + Math.random() * (max - min);
  return getECGNoise.z * 0.15;
}

function FKtheLastNoiseAndItIsAbetterNoise(t) {
  if (typeof FKtheLastNoiseAndItIsAbetterNoise.theActualValueThatSmoothlyCrawlsLikeASlugOnAWetFloor === 'undefined')
    FKtheLastNoiseAndItIsAbetterNoise.theActualValueThatSmoothlyCrawlsLikeASlugOnAWetFloor = 0;
  if (typeof FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush === 'undefined')
    FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush = 0;

  let dcck = 12;
  const dontGoBelowThisOrThePatientIsDead = -2.5;
  const dontGoAboveThisOrThePatientIsAlsoDead = 2.5;
  const howMuchTheKidJumps = 10 * dcck;
  const slugSpeed = dcck * 0.01;

  let leftWall = FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush - howMuchTheKidJumps;
  let rightWall = FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush + howMuchTheKidJumps;
  if (leftWall < dontGoBelowThisOrThePatientIsDead) leftWall = dontGoBelowThisOrThePatientIsDead;
  if (rightWall > dontGoAboveThisOrThePatientIsAlsoDead) rightWall = dontGoAboveThisOrThePatientIsAlsoDead;
  FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush = leftWall + Math.random() * (rightWall - leftWall);

  FKtheLastNoiseAndItIsAbetterNoise.theActualValueThatSmoothlyCrawlsLikeASlugOnAWetFloor +=
    (FKtheLastNoiseAndItIsAbetterNoise.theTargetThatJumpsAroundLikeAKidOnSugarRush -
      FKtheLastNoiseAndItIsAbetterNoise.theActualValueThatSmoothlyCrawlsLikeASlugOnAWetFloor) * slugSpeed;

  return FKtheLastNoiseAndItIsAbetterNoise.theActualValueThatSmoothlyCrawlsLikeASlugOnAWetFloor;
}

function toggleAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  isAudioEnabled = !isAudioEnabled;
  document.getElementById('audioBtn').textContent = isAudioEnabled ? "音效: 开" : "音效: 关";
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function openset() {
  document.getElementById('setm').style.display = "flex";
}

function closeset() {
  document.getElementById('setm').style.display = "none";
}

function noall() {
  document.getElementById('setm').style.display = "none";
  lead1.style.display = 'none';
  lead2.style.display = 'none';
  lead3.style.display = 'none';
  lead4.style.display = 'none';
  lead5.style.display = 'none';
  lead6.style.display = 'none';
  lead7.style.display = 'none';
  lead8.style.display = 'none';
  lead9.style.display = 'none';
  lead10.style.display = 'none';
  lead11.style.display = 'none';
  lead12.style.display = 'none';
}

function playBeep() {
  if (!isAudioEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

document.getElementById('hrSlider').addEventListener('input', function (e) {
  currentHRk = parseInt(e.target.value);
  currentHR = currentHRk;
  document.getElementById('hrDisplayFK').innerHTML = currentHRk;
});

const leadIds = ['leadt1', 'leadt2', 'leadt3', 'leadt4', 'leadt5', 'leadt6', 'leadt7', 'leadt8', 'leadt9', 'leadt10', 'leadt11', 'leadt12'];
const leadRefs = [lead1, lead2, lead3, lead4, lead5, lead6, lead7, lead8, lead9, lead10, lead11, lead12];

leadIds.forEach((id, i) => {
  document.getElementById(id).addEventListener('click', function () {
    noall();
    leadRefs[i].style.display = 'block';
  });
});

function smoothStep(x, x0, x1, y0, y1) {
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  const t = (x - x0) / (x1 - x0);
  return y0 + t * t * (3 - 2 * t) * (y1 - y0);
}

function gaussian(x, center, width, amplitude) {
  return amplitude * Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)));
}

const leadAmps = {
  0: { P: 2, Q: -2, R: 12, S: -3, T: 4 },
  1: { P: 2.5, Q: -2, R: 15, S: -2, T: 5 },
  2: { P: 2, Q: -3, R: 10, S: -4, T: 3 },
  3: { P: -1.5, Q: -1, R: -8, S: -8, T: -3 },
  4: { P: 1.5, Q: -2, R: 8, S: -3, T: 3 },
  5: { P: 2.5, Q: -2, R: 14, S: -2, T: 5 },
  6: { P: 1, Q: 0, R: 3, S: -12, T: 2 },
  7: { P: 1.5, Q: 0, R: 8, S: -15, T: 4 },
  8: { P: 2, Q: -1, R: 15, S: -10, T: 5 },
  9: { P: 2.5, Q: -1, R: 20, S: -5, T: 6 },
  10: { P: 2.5, Q: -2, R: 22, S: -3, T: 6 },
  11: { P: 2, Q: -2, R: 18, S: -2, T: 5 }
};

function normalSinus(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (t >= 360 && t <= 560) {
    y += gaussian(t, 460, 60, amp.T);
  }

  return y;
}

function atrialFibrillation(t, leadIndex) {
  const avgVentricularRate = Math.min(currentHR, 100) * 2;
  const avgPeriod = 60000 / avgVentricularRate;
  const amp = leadAmps[leadIndex];

  let y = (Math.sin(t * 0.08) + Math.sin(t * 0.12)) * 1.5;
  y += (Math.random() - 0.5) * 2;

  if (typeof atrialFibrillation.theHeartDecidesWhenToBeatNotYou === 'undefined') {
    atrialFibrillation.theHeartDecidesWhenToBeatNotYou = [];
    atrialFibrillation.whenDidThisChaosStart = 0;
  }

  const endOfThisMadness = atrialFibrillation.whenDidThisChaosStart +
    atrialFibrillation.theHeartDecidesWhenToBeatNotYou.reduce((a, b) => a + b, 0);

  if (t > endOfThisMadness || atrialFibrillation.theHeartDecidesWhenToBeatNotYou.length === 0) {
    atrialFibrillation.theHeartDecidesWhenToBeatNotYou = [];
    atrialFibrillation.whenDidThisChaosStart = t;
    for (let i = 0; i < 50; i++) {
      const howLongThePatientWaits = 0.5 + Math.random() * 1.0;
      atrialFibrillation.theHeartDecidesWhenToBeatNotYou.push(avgPeriod * howLongThePatientWaits);
    }
  }

  let beatStartedAt = atrialFibrillation.whenDidThisChaosStart;
  let qrsPhase = -1;
  for (let interval of atrialFibrillation.theHeartDecidesWhenToBeatNotYou) {
    if (t >= beatStartedAt && t < beatStartedAt + 400) {
      qrsPhase = t - beatStartedAt;
      break;
    }
    beatStartedAt += interval;
  }

  if (qrsPhase >= 0 && qrsPhase <= 80) {
    const qrsT = qrsPhase;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (qrsPhase >= 120 && qrsPhase <= 320) {
    y += gaussian(qrsPhase, 220, 60, amp.T);
  }

  return y;
}

function atrialFlutter(t, leadIndex) {
  const atrialRate = 300;
  const ventricularRate = currentHR;
  const amp = leadAmps[leadIndex];

  let y = 0;

  const flutterPeriod = 60000 / atrialRate;
  const flutterPhase = t % flutterPeriod;
  if (flutterPhase < flutterPeriod * 0.3) {
    y += smoothStep(flutterPhase, 0, flutterPeriod * 0.3, 0, 6);
  } else {
    y += smoothStep(flutterPhase, flutterPeriod * 0.3, flutterPeriod, 6, 0);
  }

  const ventricularPeriod = 60000 / ventricularRate;
  const qrsPhase = t % ventricularPeriod;

  if (qrsPhase >= 0 && qrsPhase <= 80) {
    const qrsT = qrsPhase;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (qrsPhase >= 120 && qrsPhase <= 320) {
    y += gaussian(qrsPhase, 220, 60, amp.T);
  }

  return y;
}

function ventricularTachycardia(t, leadIndex) {
  let rate = currentHR;
  const period = 60000 / rate;
  const phase = t % period;
  const amp = leadAmps[leadIndex];

  let y = 0;
  if (phase >= 0 && phase <= 140) {
    const qrsAmp = amp.R * 1.8;
    if (phase <= 70) {
      y += smoothStep(phase, 0, 70, 0, qrsAmp);
    } else {
      y += smoothStep(phase, 70, 140, qrsAmp, 0);
    }
  }

  if (phase >= 150 && phase <= 310) {
    y += gaussian(phase, 260, 70, -amp.T * 1.5);
  }

  return y;
}

function ventricularFibrillation(t, leadIndex) {
  let y = 0;
  y += 8 * Math.sin(t * 0.05);
  y += 6 * Math.sin(t * 0.08);
  y += 4 * Math.sin(t * 0.12);
  y += (Math.random() - 0.5) * 6;
  return y;
}

function ventricularFlutter(t, leadIndex) {
  const rate = 300;
  const period = 60000 / rate;
  const phase = t % period;
  const omega = 2 * Math.PI / period;
  let y = 15 * Math.sin(omega * phase);
  y += 3 * Math.sin(2 * omega * phase);
  return y;
}

function prematureVentricularContraction(t, leadIndex) {
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (typeof prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule === 'undefined') {
    prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule = [];
    prematureVentricularContraction.whenDidThisBullshitStart = 0;
  }

  const scheduleEnd = prematureVentricularContraction.whenDidThisBullshitStart +
    prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.reduce((a, b) => a + b, 0);

  if (t > scheduleEnd || prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.length === 0) {
    prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule = [];
    prematureVentricularContraction.whenDidThisBullshitStart = t;

    let totalTime = 0;
    while (totalTime < 30000) {
      const normalBeats = 4 + Math.floor(Math.random() * 3);
      const basePeriod = 60000 / currentHR;

      for (let i = 0; i < normalBeats; i++) {
        prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.push(basePeriod);
        totalTime += basePeriod;
      }
      const pvcWidth = 200;
      prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.push(pvcWidth);
      totalTime += pvcWidth;

      const compensatoryPause = basePeriod * (1.2 + Math.random() * 0.8);
      prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.push(compensatoryPause);
      totalTime += compensatoryPause;
    }
  }
  let beatStart = prematureVentricularContraction.whenDidThisBullshitStart;
  let beatType = 'normal';
  let beatPhase = 0;

  for (let i = 0; i < prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule.length; i++) {
    const duration = prematureVentricularContraction.theHeartIsADickAndHidesItsSchedule[i];
    if (t >= beatStart && t < beatStart + duration) {
      beatPhase = t - beatStart;
      const basePeriod = 60000 / currentHR;
      if (Math.abs(duration - basePeriod) < 10) beatType = 'normal';
      else if (duration === 200) beatType = 'pvc';
      else beatType = 'pause';
      break;
    }
    beatStart += duration;
  }

  if (beatType === 'normal') {
    y = normalSinus(beatPhase, leadIndex);
  } else if (beatType === 'pvc') {
    if (beatPhase >= 0 && beatPhase <= 140) {
      const qrsAmp = amp.R * 1.8;
      if (beatPhase <= 70) {
        y += smoothStep(beatPhase, 0, 70, 0, qrsAmp);
      } else {
        y += smoothStep(beatPhase, 70, 140, qrsAmp, 0);
      }
    }
    if (beatPhase >= 150 && beatPhase <= 310) {
      y += gaussian(beatPhase, 260, 70, -20);
    }
  } else if (beatType === 'pause') {
    y = 0;
  }

  return y;
}

function avBlock1st(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 280;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (t >= 480 && t <= 680) {
    y += gaussian(t, 580, 60, amp.T);
  }

  return y;
}

function avBlock2ndType1(t, leadIndex) {
  const cycleLength = 60000 / currentHR * 5;
  const cyclePos = t % cycleLength;
  const beatPeriod = cycleLength / 5;
  const beatIndex = Math.floor(cyclePos / beatPeriod);
  const beatPhase = cyclePos % beatPeriod;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (beatIndex < 4) {
    const prProlongation = beatIndex * 40;
    const prInterval = 160 + prProlongation;

    if (beatPhase >= 0 && beatPhase <= 100) {
      y += gaussian(beatPhase, 50, 25, amp.P);
    }

    const qrsStart = prInterval;
    if (beatPhase >= qrsStart && beatPhase <= qrsStart + 80) {
      const qrsT = beatPhase - qrsStart;
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
      }
      if (qrsT >= 10 && qrsT <= 50) {
        y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
      }
      if (qrsT >= 40 && qrsT <= 80) {
        y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
      }
    }

    if (beatPhase >= qrsStart + 120 && beatPhase <= qrsStart + 320) {
      y += gaussian(beatPhase, qrsStart + 220, 60, amp.T);
    }
  } else {
    if (beatPhase >= 0 && beatPhase <= 100) {
      y += gaussian(beatPhase, 50, 25, amp.P);
    }
  }

  return y;
}

function avBlock2ndType2(t, leadIndex) {
  const cycleLength = 60000 / currentHR * 4;
  const cyclePos = t % cycleLength;
  const beatPeriod = cycleLength / 4;
  const beatIndex = Math.floor(cyclePos / beatPeriod);
  const beatPhase = cyclePos % beatPeriod;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (beatIndex < 3) {
    if (beatPhase >= 0 && beatPhase <= 100) {
      y += gaussian(beatPhase, 50, 25, amp.P);
    }

    const qrsStart = 160;
    if (beatPhase >= qrsStart && beatPhase <= qrsStart + 80) {
      const qrsT = beatPhase - qrsStart;
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
      }
      if (qrsT >= 10 && qrsT <= 50) {
        y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
      }
      if (qrsT >= 40 && qrsT <= 80) {
        y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
      }
    }

    if (beatPhase >= 360 && beatPhase <= 560) {
      y += gaussian(beatPhase, 460, 60, amp.T);
    }
  } else {
    if (beatPhase >= 0 && beatPhase <= 100) {
      y += gaussian(beatPhase, 50, 25, amp.P);
    }
  }

  return y;
}

function avBlock3rd(t, leadIndex) {
  const atrialRate = 100;
  const ventricularRate = Math.max(currentHR, 40);
  const amp = leadAmps[leadIndex];
  let y = 0;

  const pPeriod = 60000 / atrialRate;
  const pPhase = t % pPeriod;
  if (pPhase >= 0 && pPhase <= 100) {
    y += gaussian(pPhase, 50, 25, amp.P);
  }

  const qrsPeriod = 60000 / ventricularRate;
  const qrsPhase = t % qrsPeriod;
  if (qrsPhase >= 0 && qrsPhase <= 100) {
    const qrsT = qrsPhase;
    if (qrsT >= 0 && qrsT <= 20) {
      y += smoothStep(qrsT, 0, 10, 0, amp.Q) + smoothStep(qrsT, 10, 20, amp.Q, 0);
    }
    if (qrsT >= 15 && qrsT <= 60) {
      y += smoothStep(qrsT, 15, 37, 0, amp.R * 0.8) + smoothStep(qrsT, 37, 60, amp.R * 0.8, 0);
    }
    if (qrsT >= 50 && qrsT <= 100) {
      y += smoothStep(qrsT, 50, 75, 0, amp.S) + smoothStep(qrsT, 75, 100, amp.S, 0);
    }
  }

  const tPhase = t % qrsPeriod;
  if (tPhase >= 140 && tPhase <= 340) {
    y += gaussian(tPhase, 240, 70, amp.T);
  }

  return y;
}

function supraventricularTachycardia(t, leadIndex) {
  const rate = Math.max(currentHR, 150);
  const period = 60000 / rate;
  const phase = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (phase >= 0 && phase <= 60) {
    if (phase <= 10) {
      y += smoothStep(phase, 0, 5, 0, amp.Q) + smoothStep(phase, 5, 10, amp.Q, 0);
    }
    if (phase >= 8 && phase <= 35) {
      y += smoothStep(phase, 8, 22, 0, amp.R) + smoothStep(phase, 22, 35, amp.R, 0);
    }
    if (phase >= 30 && phase <= 60) {
      y += smoothStep(phase, 30, 45, 0, amp.S) + smoothStep(phase, 45, 60, amp.S, 0);
    }
  }

  if (phase >= 100 && phase <= 250) {
    y += gaussian(phase, 175, 50, amp.T);
  }

  return y;
}

function rbbbIncomplete(t, leadIndex) {
  const period = 60000 / currentHR;
  const phase = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (phase >= 0 && phase <= 100) {
    y += gaussian(phase, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (phase >= qrsStart && phase <= qrsStart + 100) {
    const qrsT = phase - qrsStart;

    if (leadIndex === 6) {
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, 2) + smoothStep(qrsT, 7, 15, 2, 0);
      }
      if (qrsT >= 12 && qrsT <= 40) {
        y += smoothStep(qrsT, 12, 26, 0, -8) + smoothStep(qrsT, 26, 40, -8, 0);
      }
      if (qrsT >= 45 && qrsT <= 85) {
        y += smoothStep(qrsT, 45, 65, 0, 8) + smoothStep(qrsT, 65, 85, 8, 0);
      }
    } else {
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
      }
      if (qrsT >= 10 && qrsT <= 55) {
        y += smoothStep(qrsT, 10, 32, 0, amp.R) + smoothStep(qrsT, 32, 55, amp.R, 0);
      }
      if (qrsT >= 50 && qrsT <= 100) {
        y += smoothStep(qrsT, 50, 75, 0, amp.S) + smoothStep(qrsT, 75, 100, amp.S, 0);
      }
    }
  }

  if (phase >= 380 && phase <= 580) {
    const tAmp = leadIndex === 6 ? -amp.T : amp.T;
    y += gaussian(phase, 480, 60, tAmp);
  }

  return y;
}

function rbbbComplete(t, leadIndex) {
  const period = 60000 / currentHR;
  const phase = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (phase >= 0 && phase <= 100) {
    y += gaussian(phase, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (phase >= qrsStart && phase <= qrsStart + 120) {
    const qrsT = phase - qrsStart;

    if (leadIndex === 6) {
      if (qrsT >= 0 && qrsT <= 20) {
        y += smoothStep(qrsT, 0, 10, 0, 2) + smoothStep(qrsT, 10, 20, 2, 0);
      }
      if (qrsT >= 15 && qrsT <= 50) {
        y += smoothStep(qrsT, 15, 32, 0, -10) + smoothStep(qrsT, 32, 50, -10, 0);
      }
      if (qrsT >= 55 && qrsT <= 110) {
        y += smoothStep(qrsT, 55, 82, 0, 10) + smoothStep(qrsT, 82, 110, 10, 0);
      }
    } else {
      if (qrsT >= 0 && qrsT <= 20) {
        y += smoothStep(qrsT, 0, 10, 0, amp.Q) + smoothStep(qrsT, 10, 20, amp.Q, 0);
      }
      if (qrsT >= 15 && qrsT <= 65) {
        y += smoothStep(qrsT, 15, 40, 0, amp.R) + smoothStep(qrsT, 40, 65, amp.R, 0);
      }
      if (qrsT >= 60 && qrsT <= 120) {
        y += smoothStep(qrsT, 60, 90, 0, amp.S * 1.3) + smoothStep(qrsT, 90, 120, amp.S * 1.3, 0);
      }
    }
  }

  if (phase >= 400 && phase <= 600) {
    const tAmp = leadIndex === 6 ? -amp.T * 1.2 : amp.T;
    y += gaussian(phase, 500, 70, tAmp);
  }

  return y;
}

function lbbbIncomplete(t, leadIndex) {
  const period = 60000 / currentHR;
  const phase = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (phase >= 0 && phase <= 100) {
    y += gaussian(phase, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (phase >= qrsStart && phase <= qrsStart + 100) {
    const qrsT = phase - qrsStart;

    if (leadIndex === 6) {
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, 2) + smoothStep(qrsT, 7, 15, 2, 0);
      }
      if (qrsT >= 12 && qrsT <= 60) {
        y += smoothStep(qrsT, 12, 36, 0, -12) + smoothStep(qrsT, 36, 60, -12, 0);
      }
    } else if (leadIndex >= 9 && leadIndex <= 11) {
      if (qrsT >= 0 && qrsT <= 20) {
        y += smoothStep(qrsT, 0, 10, 0, amp.Q) + smoothStep(qrsT, 10, 20, amp.Q, 0);
      }
      if (qrsT >= 15 && qrsT <= 75) {
        y += smoothStep(qrsT, 15, 45, 0, amp.R * 1.1) + smoothStep(qrsT, 45, 75, amp.R * 1.1, 0);
      }
      if (qrsT >= 70 && qrsT <= 100) {
        y += smoothStep(qrsT, 70, 85, 0, amp.S * 0.5) + smoothStep(qrsT, 85, 100, amp.S * 0.5, 0);
      }
    } else {
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
      }
      if (qrsT >= 10 && qrsT <= 55) {
        y += smoothStep(qrsT, 10, 32, 0, amp.R) + smoothStep(qrsT, 32, 55, amp.R, 0);
      }
      if (qrsT >= 50 && qrsT <= 100) {
        y += smoothStep(qrsT, 50, 75, 0, amp.S) + smoothStep(qrsT, 75, 100, amp.S, 0);
      }
    }
  }

  if (phase >= 380 && phase <= 580) {
    const tAmp = (leadIndex >= 9 && leadIndex <= 11) ? -amp.T : amp.T;
    y += gaussian(phase, 480, 60, tAmp);
  }

  return y;
}

function lbbbComplete(t, leadIndex) {
  const period = 60000 / currentHR;
  const phase = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (phase >= 0 && phase <= 100) {
    y += gaussian(phase, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (phase >= qrsStart && phase <= qrsStart + 120) {
    const qrsT = phase - qrsStart;

    if (leadIndex === 6) {
      if (qrsT >= 0 && qrsT <= 70) {
        y += smoothStep(qrsT, 0, 35, 0, -15) + smoothStep(qrsT, 35, 70, -15, 0);
      }
    } else if (leadIndex >= 9 && leadIndex <= 11) {
      if (qrsT >= 0 && qrsT <= 25) {
        y += smoothStep(qrsT, 0, 12, 0, amp.Q) + smoothStep(qrsT, 12, 25, amp.Q, 0);
      }
      if (qrsT >= 20 && qrsT <= 90) {
        y += smoothStep(qrsT, 20, 55, 0, amp.R * 1.2) + smoothStep(qrsT, 55, 90, amp.R * 1.2, 0);
      }
      if (qrsT >= 85 && qrsT <= 120) {
        y += smoothStep(qrsT, 85, 102, 0, amp.S * 0.3) + smoothStep(qrsT, 102, 120, amp.S * 0.3, 0);
      }
    } else {
      if (qrsT >= 0 && qrsT <= 20) {
        y += smoothStep(qrsT, 0, 10, 0, amp.Q) + smoothStep(qrsT, 10, 20, amp.Q, 0);
      }
      if (qrsT >= 15 && qrsT <= 70) {
        y += smoothStep(qrsT, 15, 42, 0, amp.R) + smoothStep(qrsT, 42, 70, amp.R, 0);
      }
      if (qrsT >= 65 && qrsT <= 120) {
        y += smoothStep(qrsT, 65, 92, 0, amp.S) + smoothStep(qrsT, 92, 120, amp.S, 0);
      }
    }
  }

  if (phase >= 400 && phase <= 600) {
    const tAmp = (leadIndex >= 9 && leadIndex <= 11) ? -amp.T * 1.2 : amp.T;
    y += gaussian(phase, 500, 70, tAmp);
  }

  return y;
}

function miInferiorSTEMI(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;
  const isInferior = [2, 3, 5].includes(leadIndex);

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    let qAmp = amp.Q;
    if (leadIndex === 2 || leadIndex === 5) {
      qAmp = amp.Q * 3;
    } else if (leadIndex === 3) {
      qAmp = amp.Q * 0.15;
    }
    const qWidth = isInferior ? 20 : 15;
    if (qrsT >= 0 && qrsT <= qWidth) {
      y += smoothStep(qrsT, 0, qWidth / 2, 0, qAmp) + smoothStep(qrsT, qWidth / 2, qWidth, qAmp, 0);
    }
    const rAmp = isInferior ? amp.R * 0.5 : amp.R;
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, rAmp) + smoothStep(qrsT, 30, 50, rAmp, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  const stStart = qrsStart + 80;
  const stEnd = 360;
  if (t >= stStart && t <= stEnd) {
    const stT = t - stStart;
    if (isInferior) {
      const stElev = 4 + Math.sin(stT * 0.015) * 4;
      y += stElev;
    }
  }

  if (t >= 360 && t <= 560) {
    const tAmp = isInferior ? -amp.T * 1.2 : amp.T;
    y += gaussian(t, 460, 60, tAmp);
  }

  return y;
}

function miAnteriorSTEMI(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;
  const isAnterior = [6, 7, 8, 9].includes(leadIndex);

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    const qAmp = isAnterior ? amp.Q * 2.5 : amp.Q;
    const qWidth = isAnterior ? 20 : 15;
    if (qrsT >= 0 && qrsT <= qWidth) {
      y += smoothStep(qrsT, 0, qWidth / 2, 0, qAmp) + smoothStep(qrsT, qWidth / 2, qWidth, qAmp, 0);
    }
    const rAmp = amp.R;
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, rAmp) + smoothStep(qrsT, 30, 50, rAmp, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  const stStart = qrsStart + 80;
  const stEnd = 360;
  if (t >= stStart && t <= stEnd) {
    const stT = t - stStart;
    if (isAnterior) {
      const stElevBase = amp.R * 0.8;
      const stElev = stElevBase + Math.sin(stT * 0.012) * 2;
      y += stElev;
    }
  }

  if (t >= 360 && t <= 560) {
    const tAmp = isAnterior ? -amp.T * 1.5 : amp.T;
    y += gaussian(t, 460, 60, tAmp);
  }

  return y;
}

function wpwTypeA(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 80) {
    y += gaussian(t, 40, 20, amp.P);
  }

  const qrsStart = 80;
  if (t >= qrsStart && t <= qrsStart + 100) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 20) {
      y += smoothStep(qrsT, 0, 20, 0, amp.R * 0.25);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, amp.R * 0.25, amp.R) + smoothStep(qrsT, 30, 50, amp.R, amp.R * 0.25);
    }
    if (qrsT >= 40 && qrsT <= 100) {
      y += smoothStep(qrsT, 40, 60, amp.R * 0.25, amp.S) + smoothStep(qrsT, 60, 100, amp.S, 0);
    }
  }

  if (t >= 200 && t <= 400) {
    y += gaussian(t, 300, 60, amp.T * 0.8);
  }

  return y + getECGNoise(t) * 0.5;
}

function wpwTypeB(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 80) {
    y += gaussian(t, 40, 20, amp.P);
  }

  const qrsStart = 80;
  if (t >= qrsStart && t <= qrsStart + 100) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 20) {
      y += smoothStep(qrsT, 0, 20, 0, amp.R * 0.25);
    }

    if (leadIndex === 6) {
      if (qrsT >= 10 && qrsT <= 50) {
        y += smoothStep(qrsT, 10, 30, amp.R * 0.25, amp.R * 0.3) + smoothStep(qrsT, 30, 50, amp.R * 0.3, -amp.S * 1.5);
      }
      if (qrsT >= 40 && qrsT <= 100) {
        y += smoothStep(qrsT, 40, 60, -amp.S * 1.5, -amp.S * 0.5) + smoothStep(qrsT, 60, 100, -amp.S * 0.5, 0);
      }
    } else {
      if (qrsT >= 10 && qrsT <= 50) {
        y += smoothStep(qrsT, 10, 30, amp.R * 0.25, amp.R) + smoothStep(qrsT, 30, 50, amp.R, amp.R * 0.25);
      }
      if (qrsT >= 40 && qrsT <= 100) {
        y += smoothStep(qrsT, 40, 60, amp.R * 0.25, amp.S) + smoothStep(qrsT, 60, 100, amp.S, 0);
      }
    }
  }

  if (t >= 200 && t <= 400) {
    const tAmp = leadIndex === 6 ? amp.T * 1.2 : amp.T * 0.8;
    y += gaussian(t, 300, 60, tAmp);
  }

  return y + getECGNoise(t) * 0.5;
}

function hyperkalemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P * 0.5);
  }

  const qrsStart = 200;
  if (t >= qrsStart && t <= qrsStart + 110) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q * 0.8) + smoothStep(qrsT, 7, 15, amp.Q * 0.8, 0);
    }
    if (qrsT >= 10 && qrsT <= 55) {
      y += smoothStep(qrsT, 10, 32, 0, amp.R * 0.7) + smoothStep(qrsT, 32, 55, amp.R * 0.7, 0);
    }
    if (qrsT >= 50 && qrsT <= 110) {
      y += smoothStep(qrsT, 50, 80, 0, amp.S * 0.7) + smoothStep(qrsT, 80, 110, amp.S * 0.7, 0);
    }
  }

  if (t >= 380 && t <= 500) {
    y += gaussian(t, 440, 30, amp.T * 2.0);
  }

  return y + getECGNoise(t) * 0.4;
}

function hypokalemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P * 1.1);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 90) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 90) {
      y += smoothStep(qrsT, 40, 65, 0, amp.S) + smoothStep(qrsT, 65, 90, amp.S, 0);
    }
  }

  if (t >= 360 && t <= 500) {
    y += gaussian(t, 430, 60, amp.T * 0.5);
  }

  if (t >= 480 && t <= 620) {
    y += gaussian(t, 550, 40, amp.T * 0.8);
  }

  return y + getECGNoise(t) * 0.4;
}

function hypercalcemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (t >= 240 && t <= 380) {
    y += gaussian(t, 310, 40, amp.T * 1.3);
  }

  return y + getECGNoise(t) * 0.4;
}

function hypocalcemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  const stStart = qrsStart + 80;
  const stEnd = 480;
  if (t >= stStart && t <= stEnd) {
    y += 1.2;
  }

  if (t >= 480 && t <= 680) {
    y += gaussian(t, 580, 60, amp.T * 0.8);
  }

  return y + getECGNoise(t) * 0.4;
}

function hypermagnesemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P * 0.4);
  }

  const qrsStart = 320;
  if (t >= qrsStart && t <= qrsStart + 120) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 20) {
      y += smoothStep(qrsT, 0, 10, 0, amp.Q * 0.9) + smoothStep(qrsT, 10, 20, amp.Q * 0.9, 0);
    }
    if (qrsT >= 15 && qrsT <= 65) {
      y += smoothStep(qrsT, 15, 40, 0, amp.R * 0.6) + smoothStep(qrsT, 40, 65, amp.R * 0.6, 0);
    }
    if (qrsT >= 60 && qrsT <= 120) {
      y += smoothStep(qrsT, 60, 90, 0, amp.S * 0.6) + smoothStep(qrsT, 90, 120, amp.S * 0.6, 0);
    }
  }

  if (t >= 500 && t <= 620) {
    y += gaussian(t, 560, 35, amp.T * 1.8);
  }

  return y + getECGNoise(t) * 0.4;
}

function hypomagnesemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P * 1.1);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    if (qrsT >= 0 && qrsT <= 15) {
      y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
    }
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  if (t >= 360 && t <= 520) {
    y += gaussian(t, 440, 60, -amp.T * 0.4);
  }

  if (t >= 500 && t <= 640) {
    y += gaussian(t, 570, 45, amp.T * 0.6);
  }

  return y + getECGNoise(t) * 0.4;
}

function torsadesDePointes1(t, leadIndex) {
  const amp = leadAmps[leadIndex];
  let y = 0;
  const basePeriod = 240;
  const phase = t % basePeriod;
  const twistCycle = 1200;
  const twistPhase = (t % twistCycle) / twistCycle;
  const ampMod = Math.sin(twistPhase * Math.PI * 2);
  const ampAdjust = 1.8 * ampMod;

  if (phase >= 0 && phase <= 140) {
    y += smoothStep(phase, 0, 30, 0, amp.Q * ampAdjust);
    y += smoothStep(phase, 25, 70, 0, amp.R * 2.2 * ampAdjust);
    y += smoothStep(phase, 65, 140, 0, amp.S * ampAdjust);
  }

  if (phase >= 160 && phase <= 220) {
    y += gaussian(phase, 190, 25, -amp.T * 1.2 * ampMod);
  }

  return y + getECGNoise(t) * 0.5;
}

function torsadesDePointes2(t, leadIndex) {
  const amp = leadAmps[leadIndex];
  let y = 0;
  const basePeriod = 280;
  const phase = t % basePeriod;
  const twistCycle = 2800;
  const twistPhase = (t % twistCycle) / twistCycle;
  const ampMod = Math.sin(twistPhase * Math.PI * 2);
  const ampAdjust = 1.5 * ampMod;

  if (phase >= 0 && phase <= 130) {
    y += smoothStep(phase, 0, 25, 0, amp.Q * ampAdjust);
    y += smoothStep(phase, 20, 65, 0, amp.R * 1.9 * ampAdjust);
    y += smoothStep(phase, 60, 130, 0, amp.S * ampAdjust);
  }

  if (phase >= 150 && phase <= 250) {
    y += gaussian(phase, 200, 35, -amp.T * 1.1 * ampMod);
  }

  return y + getECGNoise(t) * 0.5;
}

function torsadesDePointes3(t, leadIndex) {
  const amp = leadAmps[leadIndex];
  let y = 0;
  const basePeriod = 330;
  const phase = t % basePeriod;
  const twistCycle = 4950;
  const twistPhase = (t % twistCycle) / twistCycle;
  const ampMod = Math.sin(twistPhase * Math.PI * 2);
  const ampAdjust = 1.2 * ampMod;

  if (phase >= 0 && phase <= 120) {
    y += smoothStep(phase, 0, 20, 0, amp.Q * ampAdjust);
    y += smoothStep(phase, 15, 60, 0, amp.R * 1.6 * ampAdjust);
    y += smoothStep(phase, 55, 120, 0, amp.S * ampAdjust);
  }

  if (phase >= 140 && phase <= 290) {
    y += gaussian(phase, 215, 45, -amp.T * 1.0 * ampMod);
  }

  return y + getECGNoise(t) * 0.5;
}

function weakVentricularFibrillation(t, leadIndex) {
  let y = 0;
  y += 4 * Math.sin(t * 0.05);
  y += 3 * Math.sin(t * 0.08);
  y += 2 * Math.sin(t * 0.12);
  y += (Math.random() - 0.5) * 3;
  return y;
}

function VeryweakVentricularFibrillation(t, leadIndex) {
  let y = 0;
  y += 2 * Math.sin(t * 0.05);
  y += 1.5 * Math.sin(t * 0.08);
  y += 1 * Math.sin(t * 0.12);
  y += (Math.random() - 1) * 1.8;
  return y;
}

function ischemia(t, leadIndex) {
  const period = 60000 / currentHR;
  t = t % period;
  const amp = leadAmps[leadIndex];
  let y = 0;
  const isInferior = [2, 3, 5].includes(leadIndex);

  if (t >= 0 && t <= 100) {
    y += gaussian(t, 50, 25, amp.P);
  }

  const qrsStart = 160;
  if (t >= qrsStart && t <= qrsStart + 80) {
    const qrsT = t - qrsStart;
    let qAmp = amp.Q;
    if (leadIndex === 2 || leadIndex === 5) {
      qAmp = amp.Q * 3;
    } else if (leadIndex === 3) {
      qAmp = amp.Q * 0.15;
    }
    const qWidth = isInferior ? 20 : 15;
    if (qrsT >= 0 && qrsT <= qWidth) {
      y += smoothStep(qrsT, 0, qWidth / 2, 0, qAmp) + smoothStep(qrsT, qWidth / 2, qWidth, qAmp, 0);
    }
    const rAmp = isInferior ? amp.R * 0.5 : amp.R;
    if (qrsT >= 10 && qrsT <= 50) {
      y += smoothStep(qrsT, 10, 30, 0, rAmp) + smoothStep(qrsT, 30, 50, rAmp, 0);
    }
    if (qrsT >= 40 && qrsT <= 80) {
      y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
    }
  }

  const stStart = qrsStart + 80;
  const stEnd = 360;
  if (t >= stStart && t <= stEnd) {
    const stT = t - stStart;
    if (isInferior) {
      const stElev = 4 + Math.sin(stT * 0.015) * 4;
      y -= stElev;
    }
  }
  return y;
}

function prematureAtrialContraction(t, leadIndex) {
  const basePeriod = 60000 / currentHR;
  const pacCycleLength = basePeriod * 2.5;
  const cyclePos = t % pacCycleLength;
  const amp = leadAmps[leadIndex];
  let y = 0;

  if (cyclePos >= 0 && cyclePos < basePeriod * 0.7) {
    y = normalSinus(cyclePos, leadIndex);
  } else if (cyclePos >= basePeriod * 0.7 && cyclePos < basePeriod * 1.7) {
    const pacPhase = cyclePos - basePeriod * 0.7;
    if (pacPhase >= 0 && pacPhase <= 100) {
      y += gaussian(pacPhase, 50, 25, amp.P * 2.0);
    }
    const qrsStart = 180;
    if (pacPhase >= qrsStart && pacPhase <= qrsStart + 80) {
      const qrsT = pacPhase - qrsStart;
      if (qrsT >= 0 && qrsT <= 15) {
        y += smoothStep(qrsT, 0, 7, 0, amp.Q) + smoothStep(qrsT, 7, 15, amp.Q, 0);
      }
      if (qrsT >= 10 && qrsT <= 50) {
        y += smoothStep(qrsT, 10, 30, 0, amp.R) + smoothStep(qrsT, 30, 50, amp.R, 0);
      }
      if (qrsT >= 40 && qrsT <= 80) {
        y += smoothStep(qrsT, 40, 60, 0, amp.S) + smoothStep(qrsT, 60, 80, amp.S, 0);
      }
    }
    if (pacPhase >= 360 && pacPhase <= 560) {
      y += gaussian(pacPhase, 460, 60, amp.T);
    }
  } else {
    const normalPhase = cyclePos - basePeriod * 1.7;
    y = normalSinus(normalPhase, leadIndex);
  }
  return y + getECGNoise(t) * 0.5;
}

const waveLibrary = {
  normal: (t, i) => normalSinus(t, i),
  sinus: (t, i) => normalSinus(t, i),
  afib: (t, i) => atrialFibrillation(t, i),
  flutter21: (t, i) => atrialFlutter(t, i),
  vt: (t, i) => ventricularTachycardia(t, i),
  vf: (t, i) => ventricularFibrillation(t, i),
  vfl: (t, i) => ventricularFlutter(t, i),
  pvc: (t, i) => prematureVentricularContraction(t, i),
  av1: (t, i) => avBlock1st(t, i),
  av2_1: (t, i) => avBlock2ndType1(t, i),
  av2_2: (t, i) => avBlock2ndType2(t, i),
  av3: (t, i) => avBlock3rd(t, i),
  svt: (t, i) => supraventricularTachycardia(t, i),
  rbbb_i: (t, i) => rbbbIncomplete(t, i),
  rbbb_c: (t, i) => rbbbComplete(t, i),
  lbbb_i: (t, i) => lbbbIncomplete(t, i),
  lbbb_c: (t, i) => lbbbComplete(t, i),
  mi_inferior: (t, i) => miInferiorSTEMI(t, i),
  mi_anterior: (t, i) => miAnteriorSTEMI(t, i),
  wpw_a: (t, i) => wpwTypeA(t, i),
  wpw_b: (t, i) => wpwTypeB(t, i),
  hyperkalemia: (t, i) => hyperkalemia(t, i),
  hypokalemia: (t, i) => hypokalemia(t, i),
  hypercalcemia: (t, i) => hypercalcemia(t, i),
  hypocalcemia: (t, i) => hypocalcemia(t, i),
  hypermagnesemia: (t, i) => hypermagnesemia(t, i),
  hypomagnesemia: (t, i) => hypomagnesemia(t, i),
  torsadesDePointes1: (t, i) => torsadesDePointes1(t, i),
  torsadesDePointes2: (t, i) => torsadesDePointes2(t, i),
  torsadesDePointes3: (t, i) => torsadesDePointes3(t, i),
  weakvf: (t, i) => weakVentricularFibrillation(t, i),
  Vweakvf: (t, i) => VeryweakVentricularFibrillation(t, i),
  ischemiaDO: (t, i) => ischemia(t, i),
  pac: (t, i) => prematureAtrialContraction(t, i),
};

currentWaveFunc = waveLibrary.normal;

function showVentricular() {
  document.getElementById('resultBox').innerHTML = `
    <button class="sub-btn" onclick="setMode(event, 'vt');currentHR = 200;">室速</button>
    <button class="sub-btn" onclick="setMode(event, 'vf')">室颤</button>
    <button class="sub-btn" onclick="setMode(event, 'weakvf')">弱室颤</button>
    <button class="sub-btn" onclick="setMode(event, 'Vweakvf')">极弱室颤</button>
    <button class="sub-btn" onclick="setMode(event, 'vfl')">室扑</button>
    <button class="sub-btn" onclick="setMode(event, 'pvc')">室早</button>
    <button class="sub-btn" onclick="setMode(event, 'mi_inferior')">下壁ST+</button>
    <button class="sub-btn" onclick="setMode(event, 'mi_anterior')">前壁ST+</button>
    <button class="sub-btn" onclick="setMode(event, 'ischemiaDO')">心肌缺血</button>
    <button class="sub-btn" onclick="setMode(event, 'wpw_a')">预激A</button>
    <button class="sub-btn" onclick="setMode(event, 'wpw_b')">预激B</button>
    <button class="sub-btn" onclick="setMode(event, 'torsadesDePointes1')">TdP快</button>
    <button class="sub-btn" onclick="setMode(event, 'torsadesDePointes2')">TdP中</button>
    <button class="sub-btn" onclick="setMode(event, 'torsadesDePointes3')">TdP慢</button>
  `;
  setActiveBtn('showVentricular()');
}

function showAtrial() {
  document.getElementById('resultBox').innerHTML = `
    <button class="sub-btn" onclick="setMode(event, 'sinus');currentHR = 80;">窦性心律</button>
    <button class="sub-btn" onclick="setMode(event, 'flutter21')">房扑N:1</button>
    <button class="sub-btn" onclick="setMode(event, 'afib')">房颤</button>
    <button class="sub-btn" onclick="setMode(event, 'pac')">房早</button>
  `;
  setActiveBtn('showAtrial()');
}

function showJunctional() {
  document.getElementById('resultBox').innerHTML = `
    <button class="sub-btn" onclick="setMode(event, 'av1')">一阻</button>
    <button class="sub-btn" onclick="setMode(event, 'av2_1')">二阻一</button>
    <button class="sub-btn" onclick="setMode(event, 'av2_2')">二阻二</button>
    <button class="sub-btn" onclick="setMode(event, 'av3')">三阻</button>
    <button class="sub-btn" onclick="setMode(event, 'svt')">室上速</button>
  `;
  setActiveBtn('showJunctional()');
}

function showOther() {
  document.getElementById('resultBox').innerHTML = `
    <button class="sub-btn" onclick="setMode(event, 'rbbb_i')">右不完</button>
    <button class="sub-btn" onclick="setMode(event, 'rbbb_c')">右完</button>
    <button class="sub-btn" onclick="setMode(event, 'lbbb_i')">左不完</button>
    <button class="sub-btn" onclick="setMode(event, 'lbbb_c')">左完</button>
    <button class="sub-btn" onclick="setMode(event, 'hyperkalemia')">高钾血症</button>
    <button class="sub-btn" onclick="setMode(event, 'hypokalemia')">低钾血症</button>
    <button class="sub-btn" onclick="setMode(event, 'hypercalcemia')">高钙血症</button>
    <button class="sub-btn" onclick="setMode(event, 'hypocalcemia')">低钙血症</button>
    <button class="sub-btn" onclick="setMode(event, 'hypermagnesemia')">高镁血症</button>
    <button class="sub-btn" onclick="setMode(event, 'hypomagnesemia')">低镁血症</button>
  `;
  setActiveBtn('showOther()');
}

function showInterventional() {
  document.getElementById('resultBox').innerHTML = `
    <div style="width:100%;text-align:center;color:var(--c-text3);font-size:12px;padding:10px 0;">
      子按钮功能封存,请自行更改文件删除
    </div>
  `;
  setActiveBtn('showInterventional()');
}

function setMode(e, mode) {
  currentWaveFunc = waveLibrary[mode] || waveLibrary.normal;
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
}

function setActiveBtn(clickFunc) {
  document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
  const target = document.querySelector(`.cat[onclick="${clickFunc}"]`);
  if (target) target.classList.add('active');
}

function drawGridForAllLeads() {
  const grids = document.querySelectorAll('.ecg-grid');
  grids.forEach(c => {
    const x = c.getContext('2d');
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w;
    c.height = h;

    x.strokeStyle = 'rgba(52,199,89,.06)';
    x.lineWidth = 1;
    x.setLineDash([2, 3]);

    for (let i = 0; i <= w; i += 30) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i, h);
      x.stroke();
    }

    for (let i = 0; i <= h; i += 30) {
      x.beginPath();
      x.moveTo(0, i);
      x.lineTo(w, i);
      x.stroke();
    }
  });
}

let canvases = [];

function drawECG(timestamp) {
  _fpsTick();
  if (isPaused) {
    requestAnimationFrame(drawECG);
    return;
  }
  requestAnimationFrame(drawECG);

  if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;
  const clampedDelta = Math.min(deltaTime, 50);
  globalTime += clampedDelta;
  linePosition += LINE_SPEED;

  if (allVerticalLines) {
    allVerticalLines.forEach(line => line.style.left = linePosition + 'px');
  }

  if (linePosition >= canvasWidth) {
    linePosition = 0;
    canvases.forEach(c => {
      const ctx = c.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
    });
  }

  canvases.forEach((canvas, leadIndex) => {
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const h = canvas.clientHeight;
    const waveVal = currentWaveFunc(globalTime, leadIndex);
    const noiseVal = getECGNoise(globalTime) + FKtheLastNoiseAndItIsAbetterNoise(globalTime);

    const ONY = 2;
    const SOF = 1.5;
    const currY = h / 2 - (waveVal + noiseVal) * 0.5 * SOF + 8 - ONY - LastByH;
    const prevTime = Math.max(0, globalTime - clampedDelta);
    const prevWaveVal = currentWaveFunc(prevTime, leadIndex);
    const prevNoiseVal = getECGNoise(prevTime) + FKtheLastNoiseAndItIsAbetterNoise(prevTime);
    const prevY = h / 2 - (prevWaveVal + prevNoiseVal) * 0.5 * SOF + 8 - ONY - NextByH;

    // 只对可见导联做峰值检测
    const leadEl = leadRefs[leadIndex];
    if (leadEl && leadEl.style.display !== 'none') {
      if (waveVal > 8 && lastPeakValue <= 8) {
        playBeep();
      }
      lastPeakValue = waveVal;
    }

    ctx.strokeStyle = '#34c759';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(52,199,89,.5)';
    ctx.shadowBlur = 6;
    ctx.beginPath();

    if (linePosition < LINE_SPEED) {
      ctx.moveTo(0, currY);
    } else {
      ctx.moveTo(linePosition - LINE_SPEED, prevY);
    }
    ctx.lineTo(linePosition, currY);
    ctx.stroke();

    const hlCanvas = hlCanvases[leadIndex];
    if (hlCanvas) {
      const hlCtx = hlCanvas.getContext('2d');
      const hlDpr = window.devicePixelRatio || 1;
      const hlCW = hlCanvas.clientWidth;
      const hlCH = hlCanvas.clientHeight;
      if (hlCanvas.width !== hlCW * hlDpr || hlCanvas.height !== hlCH * hlDpr) {
        hlCanvas.width = hlCW * hlDpr;
        hlCanvas.height = hlCH * hlDpr;
      }
      hlCtx.setTransform(hlDpr, 0, 0, hlDpr, 0, 0);
      hlCtx.clearRect(0, 0, hlCW, hlCH);

      hlCtx.fillStyle = '#34c759';
      hlCtx.shadowColor = 'rgba(52,199,89,.7)';
      hlCtx.shadowBlur = 10;
      hlCtx.beginPath();
      hlCtx.arc(linePosition, currY - 1, 2, 0, Math.PI * 2);
      hlCtx.fill();
    }

    document.getElementById('hrDisplayFK').textContent = currentHRk;
  });
}

function openLogPage() {
  document.getElementById('logPage').style.display = 'flex';
}

function closeLogPage() {
  document.getElementById('logPage').style.display = 'none';
}

window.onload = function () {
  setTimeout(() => {
    allVerticalLines = document.querySelectorAll('.line');
    canvases = document.querySelectorAll('.ecg-wave');

    hlCanvases = document.querySelectorAll('.ecg-dot');
    const firstCanvas = canvases[0];
    canvasWidth = firstCanvas.offsetWidth;

    canvases.forEach(c => {
      c.width = canvasWidth;
      c.height = 30;
    });
    drawGridForAllLeads();
    lastFrameTime = performance.now();
    requestAnimationFrame(drawECG);
  }, 100);
};

document.getElementById('stopECG').addEventListener('click', function () {
  isPaused = !isPaused;
  this.textContent = isPaused ? '继续' : '暂停';
  if (!isPaused) {
    lastFrameTime = performance.now();
  }
});

window.addEventListener('resize', function () {
  drawGridForAllLeads();
  if (canvases && canvases[0]) {
    canvasWidth = canvases[0].offsetWidth;
  }
});
