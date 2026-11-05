$docxPath = 'F:\PPG\Semester 2\UKIN\Materi CT Stack & Queue\RENCANAAN PEMBELAJARAN MENDALAM.docx'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

# Strip xml tags
$plain = [System.Text.RegularExpressions.Regex]::Replace($xmlText, '<[^>]+>', ' ')
$plain = [System.Text.RegularExpressions.Regex]::Replace($plain, '\s+', ' ')
[System.IO.File]::WriteAllText('scratch/rpm_text.txt', $plain)
Write-Output ("Wrote {0} chars" -f $plain.Length)

