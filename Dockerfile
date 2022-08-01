FROM ubuntu:22.04
EXPOSE 8888

RUN apt-get update 
RUN apt-get install -y locales && \
	localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8


RUN apt-get install -y \
    curl \
    gcc g++ make

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y \
    python3.7 python3-pip python3.7-dev python3-distutils-extra \
    nodejs

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /text_selector
COPY . /text_selector/

RUN python3 -m pip install jupyterlab
RUN python3 -m pip install -e .
RUN jupyter nbextension install --py --symlink --sys-prefix text_selector
RUN jupyter nbextension enable --py --sys-prefix text_selector

RUN chmod a+rwx /usr/etc/jupyter/nbconfig
RUN chmod a+rwx /usr/local/share/jupyter

CMD jupyter notebook --no-browser --ip=0.0.0.0 --port=8888 --allow-root --notebook-dir='/text_selector'
