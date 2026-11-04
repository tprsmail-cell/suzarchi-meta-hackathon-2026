import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const AUDIO_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence\\audio';
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const narrations = [
  {
    step: 1,
    file: 'step-01-discovery.wav',
    text: 'Welcome to SUZARCHI: One Material, Multiple Possibilities. We bridge industrial surplus materials with high-value circular pathways. In Tiruppur, India, a 300 kilogram lot of navy cotton-rich single jersey knit fabric has been cataloged. Its physical dimensions and origin are confirmed, while its self-reported fiber composition awaits chemical verification.',
  },
  {
    step: 2,
    file: 'step-02-ai-intake.wav',
    text: 'Our intake interface conforms to the Meta Llama 3.2 Vision schema. In this preparation phase, live external inference is disabled by policy. Optical analysis runs entirely in local deterministic mode, protecting user privacy with zero credit spend. Crucially, our evidence governance bars optical models from declaring chemical blend as confirmed; it is strictly kept at reported until laboratory testing.',
  },
  {
    step: 3,
    file: 'step-03-passport.wav',
    text: 'Every listing generates a structured Material Passport aligned with EU Digital Product Passport data syntax. Transparent four-tier evidence badging ensures industrial buyers know exactly what is measured versus what is self-reported, establishing integrity before any transaction begins.',
  },
  {
    step: 4,
    file: 'step-04-compatibility.wav',
    text: 'Our deterministic compatibility engine evaluates materials across eleven destination families in four independent dimensions. These match scores are model outputs indicating reuse potential. The safety engine enforces a strict hard gate: clean cotton is directed to high-value reuse while hazardous pathways are completely barred.',
  },
  {
    step: 5,
    file: 'step-05-lab-verification.wav',
    text: 'To elevate reported composition to confirmed status, SUZARCHI models an ISO 17025 accredited laboratory workflow. When a physical fiber blend test is ingested, the engine verifies report integrity and updates the passport with a tamper-evident audit log.',
  },
  {
    step: 6,
    file: 'step-06-global-analytics.wav',
    text: 'Circularity is global. Our analytics map industrial capacity across six continents, from Prato wool regeneration to Tiruppur knitwear reclaim. Trade corridors model cross-border flows in compliance with non-hazardous criteria under Basel Convention Annex Nine.',
  },
  {
    step: 7,
    file: 'step-07-rfq-commercial.wav',
    text: 'Matching buyer demand triggers a structured B2B RFQ draft. Here, demand from Apex Circular Textiles incorporates mandatory testing contingencies and physical swatch approvals directly into the contract draft, all stored safely in browser memory.',
  },
  {
    step: 8,
    file: 'step-08-scope3-impact.wav',
    text: 'Finally, SUZARCHI quantifies environmental benefits using GHG Protocol Corporate Standard calculations. Diverting this 2,400 kilogram lot avoids an estimated 19.8 tonnes of CO2 equivalent and conserves 108,000 liters of water. SUZARCHI: One Material, Multiple Possibilities.',
  },
];

for (const item of narrations) {
  const outPath = path.join(AUDIO_DIR, item.file).replace(/\\/g, '\\\\');
  const cleanText = item.text.replace(/'/g, "''");
  console.log(`Synthesizing Step ${item.step}: ${item.file}...`);

  const psCmd = `
Add-Type -AssemblyName System.Speech;
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;
$s.SelectVoice('Microsoft Zira Desktop');
$s.Rate = 0;
$s.SetOutputToWaveFile('${outPath}');
$s.Speak('${cleanText}');
$s.Dispose();
  `.trim().replace(/\n/g, ' ');

  execSync(`powershell -NoProfile -Command "${psCmd}"`);
  const size = fs.statSync(path.join(AUDIO_DIR, item.file)).size;
  console.log(`✓ Generated ${item.file} (${size} bytes)`);
}

console.log('All 8 voice narration tracks generated successfully!');
