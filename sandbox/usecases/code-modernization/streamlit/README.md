# Code modernization sample
```
Built using Langchain and Streamlit
```

## Overview

<img src="langchain-text-summarization.jpg" width="75%">

- Accepts a paragraph of text as the input text (to be summarized) using Streamlit's `st.text_input()`
- Text is split into chunks via `CharacterTextSplitter()` along with its `split_text()` method
- Document is generated via `Document()
- Text summarization is achieved using `load_summarize_chain()` by applying the `run()` method on the input `docs`.

## Getting started

You can get your own OpenAI API key by following the following instructions:
1. Go to https://platform.openai.com/account/api-keys.
2. Click on the `+ Create new secret key` button.
3. Next, enter an identifier name (optional) and click on the `Create secret key` button.
