#!/bin/bash

# ----------------------------------------------------------------------------------------------------
# Name: SubtitleEdit CLI
# Description: Installs Subtitle Edit CLI by cloning from GitHub repository into /usr/local/bin/.
# Author: [GOvEy1nw]
# Revision: 1
# ----------------------------------------------------------------------------------------------------

# Function to handle errors
handle_error() {
    echo "An error occurred. Exiting..."
    exit 1
}

# Check if Git is installed
if ! command -v git &>/dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if the --uninstall option is provided
if [ "$1" == "--uninstall" ]; then
    echo "Uninstalling Subtitle Edit CLI..."
    rm -rf /usr/local/bin/secli/secli;
    echo "Subtitle Edit CLI uninstalled successfully."
    exit 0
fi

# Check if the directory already exists
if [ -d /usr/local/bin/secli ]; then
    echo "Subtitle Edit CLI is already installed."
    exit 0
fi

# Clone the repository from GitHub
if [ ! -d /usr/local/bin/secli ]; then
    echo "Cloning Subtitle Edit CLI repository from GitHub..."
    git clone https://github.com/GOvEy1nw/secli.git /usr/local/bin/secli/
fi

# Provide execute permissions to the necessary scripts (assuming `secli` is the executable)
echo "Setting execute permissions for Subtitle Edit CLI..."
chmod +x "/usr/local/bin/secli/seconv" || handle_error

# Confirm installation
if [ -f "/usr/local/bin/secli/seconv" ]; then
    echo "Subtitle Edit CLI installed successfully."
else
    echo "Failed to install Subtitle Edit CLI."
    exit 1
fi