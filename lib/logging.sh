#!/usr/bin/env bash
#
# Logging utilities for dotfiles installation
#

# Configuration
LOG_FILE="$HOME/.dotfiles/install.log"
LOG_LEVEL="${LOG_LEVEL:-INFO}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize logging
init_logging() {
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Create or clear log file
    echo "=== Dotfiles Installation Log - $(date) ===" > "$LOG_FILE"
    
    # Log system information
    log_info "System: $(uname -s) $(uname -r)"
    log_info "Shell: $SHELL"
    log_info "Dotfiles directory: $DOTFILES_ROOT"
}

# Log levels
log_debug() {
    if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
        echo -e "${BLUE}[DEBUG]${NC} $1" | tee -a "$LOG_FILE"
    fi
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Log command execution
log_command() {
    local cmd="$1"
    log_debug "Executing: $cmd"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] EXEC: $cmd" >> "$LOG_FILE"
}

# Log command result
log_result() {
    local cmd="$1"
    local exit_code="$2"
    local duration="$3"
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "Command completed successfully: $cmd (${duration}s)"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $cmd (duration: ${duration}s)" >> "$LOG_FILE"
    else
        log_error "Command failed: $cmd (exit code: $exit_code)"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $cmd (exit code: $exit_code)" >> "$LOG_FILE"
    fi
}

# Execute command with logging
execute_with_logging() {
    local cmd="$1"
    local description="${2:-$cmd}"
    
    log_info "Starting: $description"
    log_command "$cmd"
    
    local start_time=$(date +%s)
    
    # Execute command and capture output
    if output=$(eval "$cmd" 2>&1); then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log_result "$cmd" 0 "$duration"
        if [[ -n "$output" ]]; then
            log_debug "Output: $output"
        fi
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        local exit_code=$?
        
        log_result "$cmd" "$exit_code" "$duration"
        log_error "Error output: $output"
        return $exit_code
    fi
}

# Log file operation
log_file_operation() {
    local operation="$1"
    local source="$2"
    local destination="$3"
    
    log_info "File operation: $operation"
    log_debug "  Source: $source"
    log_debug "  Destination: $destination"
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] FILE_OP: $operation '$source' -> '$destination'" >> "$LOG_FILE"
}

# Show recent logs
show_logs() {
    local lines="${1:-20}"
    echo -e "${BLUE}Recent installation logs:${NC}"
    tail -n "$lines" "$LOG_FILE"
}

# Export functions for use in other scripts
export -f init_logging log_debug log_info log_success log_warning log_error
export -f log_command log_result log_file_operation execute_with_logging show_logs