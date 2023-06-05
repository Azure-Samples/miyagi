# Using the azure CLI container so we dont have to install that to start
FROM mcr.microsoft.com/azure-cli:2.49.0

RUN apk update

# Install tools
RUN apk add \
    nano \
    vim \
    tcpdump \
    tmux \
    wget \
    curl \
    jq \
    unzip \
    zsh

# Change Shell and use OhMyZSH
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install kubectl 1.27.2
RUN curl -LO https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl

RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \
    && chmod 700 get_helm.sh \
    && ./get_helm.sh \
    && rm get_helm.sh

RUN curl -LO https://releases.hashicorp.com/terraform/1.4.6/terraform_1.4.6_linux_amd64.zip \
    && unzip terraform_1.4.6_linux_amd64.zip \
    && mv terraform /usr/local/bin/terraform \
    && rm terraform_1.4.6_linux_amd64.zip