#!/bin/bash

# Set the directory where HandBrakeCLI will be stored
cd /app/custom

HANDBRAKE_DIR="handbrake"
HANDBRAKE_DIR_FULL="/app/custom/handbrake"
mkdir -p "$HANDBRAKE_DIR"
mkdir -p "$HANDBRAKE_DIR/tmp"
mkdir -p "$HANDBRAKE_DIR/bin"

# Move to the temporary directory
cd "$HANDBRAKE_DIR/tmp"

# Download the Debian/Ubuntu package
echo "Downloading HandBrakeCLI Debian package..."
apt-get download handbrake-cli

# Extract the package
echo "Extracting HandBrakeCLI from package..."
dpkg-deb -x handbrake-cli*.deb ./extracted

cd "$HANDBRAKE_DIR_FULL"
# Copy the HandBrakeCLI binary and its dependencies
cp $HANDBRAKE_DIR_FULL/tmp/extracted/usr/bin/HandBrakeCLI "$HANDBRAKE_DIR_FULL/bin/HandBrakeCLI"

# Make sure it's executable
chmod +x "$HANDBRAKE_DIR_FULL/bin/HandBrakeCLI"

# Create a wrapper script that sets up any necessary environment variables and paths
cat > "$HANDBRAKE_DIR_FULL/handbrake-wrapper.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
export LD_LIBRARY_PATH="$SCRIPT_DIR/lib:$LD_LIBRARY_PATH"
"$SCRIPT_DIR/bin/HandBrakeCLI" "$@"
EOF

chmod +x "$HANDBRAKE_DIR_FULL/handbrake-wrapper.sh"

# Check if any shared libraries are needed
echo "Checking for needed libraries..."
NEEDED_LIBS=$(ldd "$HANDBRAKE_DIR_FULL/bin/HandBrakeCLI" | grep "not found")

if [ -n "$NEEDED_LIBS" ]; then
    echo "Found missing libraries. Installing them locally..."
    mkdir -p "$HANDBRAKE_DIR_FULL/lib"
    
    # Extract required libraries from package dependencies
    apt-get download $(apt-cache depends --recurse --no-recommends --no-suggests \
              --no-conflicts --no-breaks --no-replaces --no-enhances \
              handbrake-cli | grep "^\w" | sort -u)
    
    for pkg in *.deb; do
        dpkg-deb -x "$pkg" ./extracted
    done
    
    # Find and copy all shared libraries to our lib directory
    find ./extracted -name "*.so*" -exec cp -L {} "$HANDBRAKE_DIR_FULL/lib/" \;
fi

# Clean up
rm -rf "$HANDBRAKE_DIR_FULL/tmp"

echo "HandBrakeCLI has been installed to $HANDBRAKE_DIR_FULL"
echo "Use $HANDBRAKE_DIR_FULL/handbrake-wrapper.sh as your HandBrakeCLI executable in FileFlows"
echo "To test, run: $HANDBRAKE_DIR_FULL/handbrake-wrapper.sh --version"
