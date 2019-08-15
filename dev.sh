#!/usr/bin/env sh

git clean -fdx
pip install -e .
jupyter nbextension install --py --symlink --sys-prefix text_selector
jupyter nbextension enable --py --sys-prefix text_selector
