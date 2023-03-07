# Usage of whisper-1 and gpt-3.5-turbo
This is a sample to showcase how audio can be transcribed using `whisper-1` model followed by invoking `gpt-3.5-turbo`
to respond for the query. It demonstrates prompt engineering and basic usage of latest OpenAI models

### Pre-reqs
* To capture audio, ensure you have `ffmpeg` installed.
  1. Mac 
    ```bash
    brew install ffmpeg
    ```
  2. [Windows](https://ffmpeg.org/download.html)

* [python3 with pip](https://www.python.org/downloads/)

### Local run
```bash
pip install -r requirements.txt
```
```bash
python main.py
```
