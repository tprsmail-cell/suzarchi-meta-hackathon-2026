# Synthesize Demo Narration Audio using Windows Speech Synthesizer
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 0  # Normal conversational speed

$audioDir = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$narrations = @(
    @{
        Step = 1
        File = "step-01-discovery.wav"
        Text = "Welcome to SUZARCHI — One Material. Multiple Possibilities. We bridge industrial surplus materials with high-value circular pathways. In Tiruppur, India, a 300 kilogram lot of navy cotton-rich single jersey knit fabric has been cataloged. Its physical dimensions and origin are confirmed, while its self-reported fiber composition awaits chemical verification."
    },
    @{
        Step = 2
        File = "step-02-ai-intake.wav"
        Text = "Our intake interface conforms to the Meta Llama 3.2 Vision schema. In this preparation phase, live external inference is disabled by policy. Optical analysis runs entirely in local deterministic mode, protecting user privacy with zero credit spend. Crucially, our evidence governance bars optical models from declaring chemical blend as confirmed; it is strictly kept at reported until laboratory testing."
    },
    @{
        Step = 3
        File = "step-03-passport.wav"
        Text = "Every listing generates a structured Material Passport aligned with E U Digital Product Passport data syntax. Transparent four-tier evidence badging ensures industrial buyers know exactly what is measured versus what is self-reported, establishing integrity before any transaction begins."
    },
    @{
        Step = 4
        File = "step-04-compatibility.wav"
        Text = "Our deterministic compatibility engine evaluates materials across eleven destination families in four independent dimensions. These match scores are model outputs indicating reuse potential. The safety engine enforces a strict hard gate: clean cotton is directed to high-value reuse while hazardous pathways are completely barred."
    },
    @{
        Step = 5
        File = "step-05-lab-verification.wav"
        Text = "To elevate reported composition to confirmed status, SUZARCHI models an I S O 17025 accredited laboratory workflow. When a physical fiber blend test is ingested, the engine verifies report integrity and updates the passport with a tamper-evident audit log."
    },
    @{
        Step = 6
        File = "step-06-global-analytics.wav"
        Text = "Circularity is global. Our analytics map industrial capacity across six continents, from Prato's wool regeneration to Tiruppur's knitwear reclaim. Trade corridors model cross-border flows in compliance with non-hazardous criteria under Basel Convention Annex Nine."
    },
    @{
        Step = 7
        File = "step-07-rfq-commercial.wav"
        Text = "Matching buyer demand triggers a structured B2B R F Q draft. Here, demand from Apex Circular Textiles incorporates mandatory testing contingencies and physical swatch approvals directly into the contract draft, all stored safely in browser memory."
    },
    @{
        Step = 8
        File = "step-08-scope3-impact.wav"
        Text = "Finally, SUZARCHI quantifies environmental benefits using G H G Protocol Corporate Standard calculations. Diverting this 2,400 kilogram lot avoids an estimated 19.8 tonnes of C O 2 equivalent and conserves 108,000 liters of water. SUZARCHI: One Material. Multiple Possibilities."
    }
)

foreach ($item in $narrations) {
    $outPath = Join-Path $audioDir $item.File
    Write-Host "Synthesizing Step $($item.Step): $($item.File)..."
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($item.Text)
    $synth.SetOutputToNull()
    Write-Host "Created: $outPath"
}

Write-Host "All 8 audio narration tracks synthesized successfully!"
