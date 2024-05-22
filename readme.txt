usage: cts-win.exe [--help] [--tls] [-p/--port <port>] [-cert <path>] [-key <key>]

Argument usage:
   --help, -h        Bring up help menu
   --tls             Enables TLS mode (if this parameter is passed, then cert and key must be provided, otherwise the server works in non-TLS mode)
   --port, -p        Port to listen to
   --cert, -c        Path to root certificate file
   --key, -k 		 Path to private key file

Linux release notes:
- Please make sure that FFMPEG is available

Conversion warning for 0.0.4:
Updated command for the server is: ffmpeg -r 25 -i input.h265 -ss 00:00:0.9 -c:a copy -c:v libx264 output.mp4
For simplicity sake, this test server will use 25 FPS value for video conversion. Therefore, if frame rate configured 
is above or below that, the video speed will not exactly match.


CHANGELOG
-------------------------------------
0.0.4 -            - Updated ffmpeg conversion command
0.0.3 -            - Added linux version of the app
0.0.2 - 2021.06.10 - TLS support + turn off verbose mode
0.0.1 - 2020.06.17 - Initial implementation