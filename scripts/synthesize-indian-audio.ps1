Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
}[0]

Function Await-WinRtTask($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
$voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
$heera = $voices | Where-Object { $_.DisplayName -like '*Heera*' -or $_.Id -like '*Heera*' -or $_.Language -eq 'en-IN' } | Select-Object -First 1

if (-not $heera) {
    Write-Error "No Indian English (en-IN) voice found!"
    exit 1
}

Write-Host "Using Authentic Indian English Voice: $($heera.DisplayName) ($($heera.Language))"
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = $heera
$synth.Options.SpeakingRate = 1.25

$audioDir = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
}

$tracks = @(
    @{
        File = "step-00-opening.wav"
        Rate = 1.38
        Text = "Every day, valuable textiles go to waste. Welcome to Su-zhar-chi, named after the Tamil word Su-zhar-chi, meaning cyclical rotation. One Material, Multiple Possibilities."
    },
    @{
        File = "step-01-discovery.wav"
        Rate = 1.38
        Text = "In Tiruppur, Tamil Nadu, an active 300 kilogram warehouse lot of Pink Ribbed Corduroy Fabric, batch PCB-2026-IN-42, has been cataloged. Its physical dimensions and origin are confirmed, while its reported cotton composition and unmeasured weight await formal verification."
    },
    @{
        File = "step-02-ai-intake.wav"
        Rate = 1.38
        Text = "Our material intake combines AI-assisted analysis with Su-zhar-chi's deterministic validation engine. The system identifies visible material characteristics and generates structured extraction candidates. Evidence governance ensures that photographs alone cannot confirm fibre composition, GSM or chemical safety. All unverified properties remain clearly identified for human review."
    },
    @{
        File = "step-03-passport.wav"
        Rate = 1.38
        Text = "Every listing generates a structured Material Passport aligned with EU Digital Product Passport data syntax. Transparent four-tier evidence badging ensures industrial buyers know exactly what is measured versus what is self-reported, establishing integrity before any transaction begins."
    },
    @{
        File = "step-04-compatibility.wav"
        Rate = 1.38
        Text = "Our deterministic circular engine evaluates materials across eleven destination families in four independent dimensions. These compatibility percentages are prototype model outputs. The safety engine enforces a strict hard gate: clean cotton is directed to high-value reuse while hazardous pathways are unconditionally blocked."
    },
    @{
        File = "step-05-lab-verification.wav"
        Rate = 1.38
        Text = "To elevate reported composition to confirmed status, Su-zhar-chi demonstrates a simulated laboratory verification workflow based on ISO/IEC 17025 principles. When an appropriate physical fibre test report is reviewed, its integrity information can be recorded in the passport audit trail using SHA-256 hashing."
    },
    @{
        File = "step-06-global-analytics.wav"
        Rate = 1.38
        Text = "Circularity is global. Our global analytics and regional circular intelligence map industrial capacity across six continents and seventeen hubs, from Prato wool regeneration to Tiruppur knitwear reclaim. Trade corridors model potential cross-border flows while considering applicable Basel Convention requirements."
    },
    @{
        File = "step-07-rfq-commercial.wav"
        Rate = 1.38
        Text = "Matching buyer demand triggers a structured B2B RFQ draft. Here, demand from Apex Circular Textiles incorporates laboratory testing contingencies and physical swatch approvals directly into the contract draft, stored locally in browser memory without external dispatch."
    },
    @{
        File = "step-08-scope3-impact.wav"
        Rate = 1.42
        Text = "Finally, Su-zhar-chi estimates potential environmental benefits using GHG Protocol-informed calculation methods. For this broader 2,400 kilogram facility allocation, the current model estimates 19.8 tonnes of avoided CO2 equivalent and 108,000 litres of potential water savings. These are modelled estimates, not independently verified environmental savings."
    },
    @{
        File = "step-09-tiruppur-thankyou.wav"
        Rate = 1.38
        Text = "Grounded in Tiruppur, Tamil Nadu - the world's first textile cluster to achieve Zero Liquid Discharge and complete pre-consumer waste recovery - thank you for exploring Su-zhar-chi: One Material, Multiple Possibilities."
    }
)

foreach ($t in $tracks) {
    Write-Host "Synthesizing $($t.File) at rate $($t.Rate)..."
    $synth.Options.SpeakingRate = $t.Rate
    $streamOp = $synth.SynthesizeTextToStreamAsync($t.Text)
    $stream = Await-WinRtTask $streamOp ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
    
    $targetPath = Join-Path $audioDir $t.File
    $bytes = New-Object byte[] ($stream.Size)
    $reader = New-Object Windows.Storage.Streams.DataReader ($stream.GetInputStreamAt(0))
    $loadOp = $reader.LoadAsync($stream.Size)
    $loadTask = Await-WinRtTask $loadOp ([uint32])
    $reader.ReadBytes($bytes)
    [System.IO.File]::WriteAllBytes($targetPath, $bytes)
    Write-Host "[OK] Created $($t.File) ($($bytes.Length) bytes)"
}

Write-Host "All 9 Indian English audio tracks synthesized successfully!"
