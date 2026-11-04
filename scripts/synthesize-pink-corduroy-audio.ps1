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

$audioDir = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio-pink-corduroy"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
}

$tracks = @(
    @{
        File = "step-00-opening.wav"
        Rate = 1.35
        Text = "Millions of tonnes of textile surplus go to waste every year due to fragmented data and disconnected global corridors. Welcome to Su-zhar-chi: One Material, Multiple Possibilities."
    },
    @{
        File = "step-01-dashboard.wav"
        Rate = 1.32
        Text = "In Tiruppur, Tamil Nadu, a premier Indian manufacturing cluster, we catalog 300 kilograms of Pink Ribbed Corduroy Fabric, batch PCB-2026-IN-42. Origin and roll dimensions are confirmed, while reported cotton composition and unmeasured weight await formal verification."
    },
    @{
        File = "step-02-ai-intake.wav"
        Rate = 1.30
        Text = "Our material intake pairs multimodal vision with strict evidence governance. The system observes the light pink hue and raised vertical corduroy ribs. Under Su-zhar-chi's precautionary rules, photographs cannot certify composition, GSM, or chemical safety, flagging unverified fields for human review."
    },
    @{
        File = "step-03-passport.wav"
        Rate = 1.30
        Text = "The resulting Material Passport enforces four evidence tiers: Confirmed, Reported, Estimated, and Unknown. For this corduroy lot, color is estimated while GSM remains strictly null. This syntax aligns with European Union Digital Product Passport requirements, tracking batch custody from Tiruppur to global reuse."
    },
    @{
        File = "step-04-compatibility.wav"
        Rate = 1.30
        Text = "Next, Su-zhar-chi evaluates circular destinations across technical, evidence, safety, and commercial dimensions. This corduroy fabric qualifies for upcycled tote bags and craft textiles. Because chemical finishes remain unverified, our mandatory safety gate blocks intimate apparel pathways until laboratory clearance."
    },
    @{
        File = "step-05-lab-workflow.wav"
        Rate = 1.32
        Text = "To elevate reported attributes, Su-zhar-chi demonstrates a simulated ISO 17025 laboratory workflow. An accredited test desk records quantitative dissolution and GSM cutter results, attaching tamper-evident SHA-256 cryptographic digests directly to the passport audit trail."
    },
    @{
        File = "step-06-global-analytics.wav"
        Rate = 1.30
        Text = "Textile circularity is global. Our analytics map processing capacity across seventeen circular hubs, connecting Tiruppur to recycling clusters in Prato and Izmir. Trade corridors model cross-border flows in compliance with Basel Convention Annex IX non-hazardous scrap rules."
    },
    @{
        File = "step-07-rfq.wav"
        Rate = 1.32
        Text = "With specifications established, local commerce begins. Su-zhar-chi automatically generates structured request-for-quote packages, bundling lot specifications, chain of custody, and physical sample requirements for immediate buyer evaluation."
    },
    @{
        File = "step-08-scope3.wav"
        Rate = 1.32
        Text = "Every redirected kilogram delivers measurable impact. For this 300 kilogram lot, circular reuse avoids an estimated 1.8 tonnes of CO2 equivalent and saves 735,000 litres of water, calculated using models aligned with the GHG Protocol."
    },
    @{
        File = "step-09-closing.wav"
        Rate = 1.32
        Text = "From local surplus in Tiruppur to a connected circular world, Su-zhar-chi bridges material intelligence, evidence, and sustainable commerce. Su-zhar-chi: One Material, Multiple Possibilities."
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

Write-Host "`nAll 10 calibrated Pink Corduroy audio tracks synthesized successfully!"
