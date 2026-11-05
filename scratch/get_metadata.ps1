$shell = New-Object -COMObject Shell.Application
$folder = $shell.NameSpace('C:\Users\RESA\.gemini\antigravity\brain\1bb5a204-33f6-454b-b1c0-b10f32c509c4\.user_uploaded')
$file1 = $folder.ParseName('media_1793886307220_06cdacfa.mp4')
$file2 = $folder.ParseName('media_1793886307377_d81c7cc2.mp4')
for ($i=0; $i -le 60; $i++) {
    $name = $folder.GetDetailsOf($null, $i)
    $val1 = $folder.GetDetailsOf($file1, $i)
    $val2 = $folder.GetDetailsOf($file2, $i)
    if ($val1 -or $val2) {
        Write-Output ("{0}: v1=[{1}] v2=[{2}]" -f $name, $val1, $val2)
    }
}

