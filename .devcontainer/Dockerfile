FROM quay.io/fedora/fedora-toolbox:43

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bash -lc 'true'

# Установить необходимые пакеты

# trunk-ignore(hadolint/DL3041)
RUN dnf -y install \
      python3-pip \
      nodejs \
      python3-identify \
      jq \
 && dnf -y clean all \
 && rm -rf /var/cache/dnf

COPY .devcontainer/bashrc_additions.sh /tmp/bashrc_additions.sh
RUN install -d -m 0755 /usr/local/share/devcontainer \
 && cat /etc/skel/.bashrc /tmp/bashrc_additions.sh > /usr/local/share/devcontainer/bashrc \
 && chown root:root /usr/local/share/devcontainer/bashrc \
 && chmod 0644 /usr/local/share/devcontainer/bashrc \
 && rm -f /tmp/bashrc_additions.sh

WORKDIR /workspace
RUN useradd -m vscode
USER vscode
