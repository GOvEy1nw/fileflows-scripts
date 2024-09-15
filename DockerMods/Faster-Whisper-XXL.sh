#!/bin/bash

# ----------------------------------------------------------------------------------------------------
# Name: Faster-Whisper-XXL
# Description: Installs Faster-Whisper-XXL in the FileFlows Docker environment.
# Dependencies: 7zip (7z) must be installed before running this script.
# Location: Installs to /usr/local/bin/whisper.
# Uninstall: Removes the whisper directory from /usr/local/bin.
# Author: [GOvEy1nw]
# ----------------------------------------------------------------------------------------------------

# Function to handle errors
function handle_error {
    echo "An error occurred. Exiting..."
    exit 1
}

# Define variables
VERSION="Faster-Whisper-XXL_r192.3.1_linux.7z"

# Check if the --uninstall option is provided
if [ "$1" == "--uninstall" ]; then
    echo "Uninstalling Faster-Whisper-XXL..."
    rm -rf /usr/local/bin/whisper && echo "Uninstallation complete." || handle_error
    exit 0
fi

# Check if Faster-Whisper-XXL is already installed
if command -v /usr/local/bin/whisper/whisper-faster-xxl &>/dev/null; then
    echo "Faster-Whisper-XXL is already installed."
    exit 0
fi

# Check if 7zip (7z) is installed
if ! command -v 7z &>/dev/null; then
    echo "7zip is not installed. Please install 7zip (7z) before running this script."
    exit 1
fi

# Download Faster-Whisper-XXL archive
echo "Downloading Faster-Whisper-XXL..."
cd /usr/local/bin
wget -q https://github.com/Purfview/whisper-standalone-win/releases/download/Faster-Whisper-XXL/$VERSION || handle_error

# Extract only the 'Faster-Whisper-XXL' folder from the archive
if [ -f $VERSION ]; then
    chmod +rwx $VERSION
    7z x -aoa $VERSION "Whisper-Faster-XXL/*"
    echo "Extracting folder..."
else
    echo "Failed to download Faster-Whisper-XXL."
    exit 1
fi

# Move the extracted folder to the whisper directory
if [ -d Whisper-Faster-XXL ]; then
    mv Whisper-Faster-XXL whisper || handle_error
else
    echo "Extraction failed."
    exit 1
fi

# Set execute permissions for the main executable
if [ -f whisper/whisper-faster-xxl ]; then
    echo "Setting execute permissions..."
    chmod +x whisper/whisper-faster-xxl || handle_error
else
    echo "Extraction failed."
    exit 1
fi

# Clean up - Remove the downloaded archive file
if [ -f whisper/whisper-faster-xxl ]; then
    echo "Cleaning up..."
    rm -f $VERSION || handle_error
fi

echo "Faster-Whisper-XXL installation complete."

exit 0