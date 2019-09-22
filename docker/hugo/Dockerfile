FROM ubuntu:disco

RUN  apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:longsleep/golang-backports && \
    apt-get update && \
    apt-get -y install golang-go git && \
    rm -rf /var/lib/apt/lists/*

RUN git clone --single-branch --branch release-0.56.3 https://github.com/gohugoio/hugo.git
RUN cd hugo && \
    go install --tags extended
RUN ln -s /root/go/bin/hugo /bin/hugo
