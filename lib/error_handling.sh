#!/usr/bin/env bash
#
# Error handling and recovery utilities
#

# Error codes
readonly ERROR_SUCCESS=0
readonly ERROR_GENERAL=1
readonly ERROR_NETWORK=2
readonly ERROR_PERMISSIONS=3
readonly ERROR_DEPENDENCY=4
readonly ERROR_CONFIGURATION=5
readonly ERROR_BACKUP=6

# Recovery instructions database
declare -A RECOVERY_INSTRUCTIONS=(
    ["$ERROR_NETWORK"]="Network connectivity issues detected.
  Recovery steps:
  1. Check internet connection: ping google.com
  2. Verify DNS settings: nslookup google.com
  3. Try running: brew update
  4. If behind proxy, configure: export https_proxy=your.proxy.url
  5. Retry installation after fixing network issues"
    
    ["$ERROR_PERMISSIONS"]="Permission denied errors detected.
  Recovery steps:
  1. Check file permissions: ls -la /path/to/file
  2. Fix permissions: chmod 644 /path/to/file
  3. Fix directory permissions: chmod 755 /path/to/directory
  4. For system files, use: sudo chown \$USER:\$USER /path/to/file
  5. If Homebrew issues: brew doctor"
    
    ["$ERROR_DEPENDENCY"]="Missing dependencies detected.
  Recovery steps:
  1. Install Xcode Command Line Tools: xcode-select --install
  2. Update Homebrew: brew update && brew upgrade
  3. Install missing dependencies manually
  4. Clean and reinstall: brew cleanup && brew install <package>
  5. Check system requirements: system_profiler SPSoftwareDataType"
    
    ["$ERROR_CONFIGURATION"]="Configuration errors detected.
  Recovery steps:
  1. Review configuration syntax
  2. Restore from backup: ./bin/rollback
  3. Check for conflicting configurations
  4. Reset to defaults: ./bin/reset-config <component>
  5. Validate configuration: ./bin/validate-config"
    
    ["$ERROR_BACKUP"]="Backup creation failed.
  Recovery steps:
  1. Check disk space: df -h
  2. Verify backup directory permissions: ls -la ~/.dotfiles/backups
  3. Clean old backups: ./bin/cleanup-backups
  4. Create backup manually: cp -r ~/.dotfiles ~/.dotfiles.backup.manual
  5. Continue without backup (not recommended): export SKIP_BACKUP=true"
)

# Handle errors with context and recovery
handle_error() {
    local exit_code="$1"
    local operation="$2"
    local context="${3:-No additional context}"
    local component="${4:-unknown}"
    
    log_error "Error in $operation (exit code: $exit_code)"
    log_error "Component: $component"
    log_error "Context: $context"
    
    # Mark failure in state
    mark_install_failure "$component" "Failed in $operation: $context"
    
    # Show recovery instructions
    show_recovery_instructions "$exit_code" "$operation"
    
    # Offer interactive recovery
    offer_recovery_options "$exit_code" "$operation" "$component"
    
    return $exit_code
}

# Show recovery instructions for error code
show_recovery_instructions() {
    local exit_code="$1"
    local operation="$2"
    
    echo ""
    log_error "=== Recovery Instructions ==="
    
    if [[ -n "${RECOVERY_INSTRUCTIONS[$exit_code]}" ]]; then
        echo -e "${YELLOW}${RECOVERY_INSTRUCTIONS[$exit_code]}${NC}"
    else
        echo -e "${YELLOW}General recovery steps:
  1. Check the installation logs: cat ~/.dotfiles/install.log
  2. Review failed component state: cat ~/.dotfiles/state/installation_state.json
  3. Try component-specific installation: ./bin/install-component <name>
  4. Restore from backup: ./bin/rollback
  5. Get help: ./bin/help${NC}"
    fi
    
    echo ""
    log_info "Useful commands:"
    echo "  View logs:      cat $LOG_FILE"
    echo "  View state:     cat $STATE_FILE"
    echo "  List backups:   ./bin/list-backups"
    echo "  Get help:       ./bin/help"
}

# Offer interactive recovery options
offer_recovery_options() {
    local exit_code="$1"
    local operation="$2"
    local component="$3"
    
    echo ""
    log_info "=== Recovery Options ==="
    echo "1) Retry the failed operation"
    echo "2) Skip this component and continue"
    echo "3) Restore from backup"
    echo "4) View detailed logs"
    echo "5) Exit and investigate manually"
    echo ""
    
    read -p "Choose an option (1-5): " choice
    
    case $choice in
        1)
            log_info "Retrying $operation for $component..."
            # This would be handled by the calling script
            return 1  # Signal to retry
            ;;
        2)
            log_warning "Skipping $component and continuing..."
            mark_install_failure "$component" "Skipped by user"
            return 0  # Signal to continue
            ;;
        3)
            log_info "Starting interactive rollback..."
            if command -v interactive_rollback >/dev/null 2>&1; then
                interactive_rollback
            else
                log_error "Rollback function not available"
            fi
            return 2  # Signal to stop
            ;;
        4)
            log_info "Showing detailed logs..."
            if command -v less >/dev/null 2>&1; then
                less "$LOG_FILE"
            else
                cat "$LOG_FILE"
            fi
            return 1  # Signal to retry after viewing
            ;;
        5)
            log_info "Exiting for manual investigation..."
            return 2  # Signal to stop
            ;;
        *)
            log_error "Invalid option. Exiting..."
            return 2  # Signal to stop
            ;;
    esac
}

# Wrapper function for error-prone operations
safe_execute() {
    local operation="$1"
    local component="$2"
    local command="$3"
    local context="$4"
    local max_retries="${5:-3}"
    
    local attempt=1
    local exit_code
    
    while [[ $attempt -le $max_retries ]]; do
        log_debug "Executing $operation for $component (attempt $attempt/$max_retries)"
        
        if eval "$command"; then
            log_success "$operation completed successfully for $component"
            return 0
        else
            exit_code=$?
            log_warning "$operation failed for $component (attempt $attempt/$max_retries, exit code: $exit_code)"
            
            if [[ $attempt -eq $max_retries ]]; then
                handle_error "$exit_code" "$operation" "$context" "$component"
                return $exit_code
            fi
            
            ((attempt++))
            sleep 2  # Brief delay between retries
        fi
    done
    
    return $exit_code
}

# Network check before operations
check_network() {
    log_debug "Checking network connectivity..."
    
    if ! ping -c 1 google.com >/dev/null 2>&1; then
        log_error "Network connectivity check failed"
        return $ERROR_NETWORK
    fi
    
    return 0
}

# Permission check before operations
check_permissions() {
    local path="$1"
    local operation="${2:-write}"
    
    if [[ ! -e "$path" ]]; then
        # Check if parent directory is writable
        path="$(dirname "$path")"
    fi
    
    if [[ ! -w "$path" ]]; then
        log_error "Permission denied for $operation on: $path"
        return $ERROR_PERMISSIONS
    fi
    
    return 0
}

# Dependency check
check_dependencies() {
    local -a deps=("$@")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing+=("$dep")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        return $ERROR_DEPENDENCY
    fi
    
    return 0
}

# Configuration validation
validate_config() {
    local config_file="$1"
    local validator="$2"
    
    if [[ ! -f "$config_file" ]]; then
        log_error "Configuration file not found: $config_file"
        return $ERROR_CONFIGURATION
    fi
    
    if [[ -n "$validator" ]] && command -v "$validator" >/dev/null 2>&1; then
        if ! "$validator" "$config_file"; then
            log_error "Configuration validation failed for: $config_file"
            return $ERROR_CONFIGURATION
        fi
    fi
    
    return 0
}

# Export functions for use in other scripts
export -f handle_error show_recovery_instructions offer_recovery_options
export -f safe_execute check_network check_permissions check_dependencies
export -f validate_config

# Export error codes
export ERROR_SUCCESS ERROR_NETWORK ERROR_PERMISSIONS ERROR_DEPENDENCY
export ERROR_CONFIGURATION ERROR_BACKUP