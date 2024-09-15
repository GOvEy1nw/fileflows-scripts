# ----------------------------------------------------------------------------------------------------
# Name: HandBrake-CLI
# Description: HandBrake is an open-source video transcoder that allows you to convert videos into different formats.
# Author: GOvEy1nw
# Revision: 1
# Icon:
# ----------------------------------------------------------------------------------------------------

#!/bin/bash

# Function to handle errors
function handle_error {
    echo "An error occurred. Exiting..."
    exit 1
}

# Check if the --uninstall option is provided
if [ "$1" == "--uninstall" ]; then
    echo "Uninstalling HandBrake..."
    if apt-get remove -y handbrake-cli; then
        echo "HandBrake successfully uninstalled."
        exit 0
    else
        handle_error
    fi
fi

# Check if HandBrake is installed
if command -v HandBrakeCLI &>/dev/null; then
    echo "HandBrake is already installed."
    exit 0
fi

echo "HandBrake is not installed. Installing..."

# Update package lists
if ! apt update; then
    handle_error
fi

# Install HandBrake CLI
if ! apt install -y handbrake-cli; then
    handle_error
fi

echo "Installation complete."

# Verify installation
if command -v HandBrakeCLI &>/dev/null; then
    echo "HandBrake successfully installed."
    exit 0
else
    echo "Failed to install HandBrake."
    exit 1
fi