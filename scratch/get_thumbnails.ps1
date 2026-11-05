Add-Type -AssemblyName System.Drawing
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.FileIO, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

function Get-Thumbnail($videoPath, $outPath) {
    $asyncOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($videoPath)
    $file = $asyncOp.GetAwaiter().GetResult()
    $thumbOp = $file.GetThumbnailAsync([Windows.Storage.FileProperties.ThumbnailMode]::VideosView, 640)
    $thumb = $thumbOp.GetAwaiter().GetResult()
    $stream = $thumb.AsStreamForRead()
    $img = [System.Drawing.Image]::FromStream($stream)
    $img.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $stream.Close()
    Write-Output "Saved thumbnail to $outPath"
}

Get-Thumbnail 'C:\Users\RESA\.gemini\antigravity\brain\1bb5a204-33f6-454b-b1c0-b10f32c509c4\.user_uploaded\media_1793886307220_06cdacfa.mp4' 'f:\PPG\Semester 2\Buat Game\scratch\thumb_v1.jpg'
Get-Thumbnail 'C:\Users\RESA\.gemini\antigravity\brain\1bb5a204-33f6-454b-b1c0-b10f32c509c4\.user_uploaded\media_1793886307377_d81c7cc2.mp4' 'f:\PPG\Semester 2\Buat Game\scratch\thumb_v2.jpg'

