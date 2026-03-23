#!/usr/bin/env bash
set -euo pipefail

MANAGED_BASHRC="/usr/local/share/devcontainer/bashrc"
USER_BASHRC="${HOME}/.bashrc"
USER_BASHRC_LEGACY="${HOME}/.bashrc_legacy"

archive_existing_bashrc() {
	local archive_path="${USER_BASHRC_LEGACY}"
	if [[ -e ${archive_path} ]] || [[ -L ${archive_path} ]]; then
		archive_path="${USER_BASHRC_LEGACY}.$(date +%Y%m%d%H%M%S)"
	fi

	mv "${USER_BASHRC}" "${archive_path}"
}

detect_managed_symlink() {
	local resolved_target

	IS_MANAGED_SYMLINK=0

	if [[ ! -L ${USER_BASHRC} ]]; then
		return
	fi

	resolved_target="$(readlink -f "${USER_BASHRC}" 2>/dev/null || true)"
	if [[ ${resolved_target} == "${MANAGED_BASHRC}" ]]; then
		IS_MANAGED_SYMLINK=1
	fi
}

if [[ ! -r ${MANAGED_BASHRC} ]]; then
	echo "Managed bashrc not found: ${MANAGED_BASHRC}" >&2
	exit 1
fi

# Archive any existing ~/.bashrc that is not the exact managed symlink.
if [[ -e ${USER_BASHRC} ]] || [[ -L ${USER_BASHRC} ]]; then
	detect_managed_symlink
	if [[ ${IS_MANAGED_SYMLINK} -ne 1 ]]; then
		archive_existing_bashrc
	fi
fi

ln -sfn "${MANAGED_BASHRC}" "${USER_BASHRC}"
