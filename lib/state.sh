#!/usr/bin/env bash
#
# State tracking utilities for idempotent installations
#

STATE_DIR="$HOME/.dotfiles/state"
STATE_FILE="$STATE_DIR/installation_state.json"

# Initialize state directory
init_state() {
    mkdir -p "$STATE_DIR"
    
    if [[ ! -f "$STATE_FILE" ]]; then
        echo "{}" > "$STATE_FILE"
    fi
}

# Get current state for a component
get_state() {
    local component="$1"
    local key="${2:-status}"
    
    if command -v jq >/dev/null 2>&1; then
        jq -r ".$component.$key // \"not_installed\"" "$STATE_FILE" 2>/dev/null || echo "not_installed"
    else
        echo "not_installed"
    fi
}

# Set state for a component
set_state() {
    local component="$1"
    local status="$2"
    local details="$3"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    if command -v jq >/dev/null 2>&1; then
        local temp_file=$(mktemp)
        jq ". + {\"$component\": {
            \"status\": \"$status\",
            \"timestamp\": \"$timestamp\",
            \"details\": \"$details\"
        }}" "$STATE_FILE" > "$temp_file" && mv "$temp_file" "$STATE_FILE"
    else
        log_warning "jq not available, using basic state tracking"
        echo "$component:$status:$timestamp:$details" >> "$STATE_DIR/state.log"
    fi
}

# Check if component is installed
is_installed() {
    local component="$1"
    local status=$(get_state "$component" "status")
    [[ "$status" == "completed" || "$status" == "success" ]]
}

# Check if component needs update
needs_update() {
    local component="$1"
    local current_version="$2"
    local installed_version=$(get_state "$component" "details")
    
    [[ "$installed_version" != "$current_version" ]]
}

# Mark installation start
mark_install_start() {
    local component="$1"
    log_info "Starting installation of: $component"
    set_state "$component" "installing" "Installation started"
}

# Mark installation success
mark_install_success() {
    local component="$1"
    local version="$2"
    log_success "Successfully installed: $component"
    set_state "$component" "completed" "$version"
}

# Mark installation failure
mark_install_failure() {
    local component="$1"
    local error_message="$2"
    log_error "Failed to install: $component - $error_message"
    set_state "$component" "failed" "$error_message"
}

# Get all installed components
get_installed_components() {
    if command -v jq >/dev/null 2>&1; then
        jq -r 'to_entries[] | select(.value.status == "completed") | .key' "$STATE_FILE" 2>/dev/null || echo ""
    else
        grep "completed:" "$STATE_DIR/state.log" 2>/dev/null | cut -d: -f1 || echo ""
    fi
}

# Show installation summary
show_installation_summary() {
    log_info "Installation Summary:"
    echo ""
    
    if command -v jq >/dev/null 2>&1 && [[ -f "$STATE_FILE" ]]; then
        echo "Component Status:"
        jq -r 'to_entries[] | "  \(.key): \(.value.status) (\(.value.timestamp))"' "$STATE_FILE" 2>/dev/null || echo "  No state information available"
    else
        echo "  Detailed state requires jq. Basic log available at: $STATE_DIR/state.log"
    fi
    
    echo ""
    echo "State file: $STATE_FILE"
}

# Clean up old state entries
cleanup_old_state() {
    local days="${1:-30}"
    local cutoff_date=$(date -v-${days}d -u +"%Y-%m-%dT%H:%M:%SZ")
    
    if command -v jq >/dev/null 2>&1; then
        local temp_file=$(mktemp)
        jq 'to_entries | map(select(.value.timestamp >= "'$cutoff_date'")) | from_entries' "$STATE_FILE" > "$temp_file" && mv "$temp_file" "$STATE_FILE"
        log_info "Cleaned state entries older than $days days"
    fi
}

# Export functions for use in other scripts
export -f init_state get_state set_state is_installed needs_update
export -f mark_install_start mark_install_success mark_install_failure
export -f get_installed_components show_installation_summary cleanup_old_state

# Export variables
export STATE_DIR STATE_FILE