ARG VARIANT="20-bullseye-slim"

# For develop-stage.
# > docker build --target develop-stage .
FROM node:${VARIANT} as develop-stage

## Configure apt and install packages
RUN set -x \
    && apt update \
    && apt install -y --no-install-recommends apt-utils dialog 2>&1 \
    && apt install -y git procps iproute2 nano \
    ;

## Create a non-root user to use if preferred
ARG USERNAME=vscode
ARG USER_UID=2001
ARG USER_GID=$USER_UID
RUN set -x \
    && apt install -y sudo \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
    \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    ;

# Clean up
RUN set -x \
    && apt autoremove -y \
    && apt clean -y \
    && rm -rf /var/lib/apt/lists/* \
    ;
