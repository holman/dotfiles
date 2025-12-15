#!/usr/bin/env bash
#
# Backup and rollback utilities for dotfiles installation
#

BACKUP_DIR="$HOME/.dotfiles/backups"
BACKUP_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CURRENT_BACKUP="$BACKUP_DIR/backup_$BACKUP_TIMESTAMP"

# Initialize backup directory
init_backup() {
    mkdir -p "$BACKUP_DIR"
    log_info "Backup directory: $BACKUP_DIR"
}

# Create backup of a file or directory
backup_file() {
    local source="$1"
    local backup_path="$CURRENT_BACKUP/$(dirname "${source#$HOME/}")"
    
    if [[ -e "$source" ]]; then
        mkdir -p "$(dirname "$backup_path")"
        
        # Copy with timestamp to preserve original
        if cp -R "$source" "$backup_path" 2>/dev/null; then
            log_file_operation "backup" "$source" "$backup_path"
            log_debug "Backed up: $source"
            return 0
        else
            log_error "Failed to backup: $source"
            return 1
        fi
    else
        log_debug "No backup needed (file doesn't exist): $source"
        return 0
    fi
}

# Backup dotfiles before making changes
backup_dotfiles() {
    local operation="$1"
    local backup_name="${operation}_$BACKUP_TIMESTAMP"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Creating backup before: $operation"
    mkdir -p "$backup_path"
    
    # Backup common dotfiles
    local dotfiles=(
        ".gitconfig"
        ".gitconfig.local"
        ".zshrc"
        ".tmux.conf"
        ".vimrc"
        ".muttrc"
        ".irbrc"
        ".gemrc"
        ".gitignore"
    )
    
    for dotfile in "${dotfiles[@]}"; do
        backup_file "$HOME/$dotfile"
    done
    
    # Backup config directories
    local config_dirs=(
        ".config/ghostty"
        ".config/zed"
        ".config/nvim"
        ".config/newsboat"
        ".config/thefuck"
        ".config/sketchybar"
        ".config/yazi"
        ".config/fzf"
        ".config/bat"
        ".config/eza"
        ".config/ripgrep"
        ".config/zoxide"
    )
    
    for config_dir in "${config_dirs[@]}"; do
        backup_file "$HOME/$config_dir"
    done
    
    # Create metadata file
    cat > "$backup_path/metadata.json" << EOF
{
  "timestamp": "$BACKUP_TIMESTAMP",
  "operation": "$operation",
  "user": "$(whoami)",
  "hostname": "$(hostname)",
  "dotfiles_commit": "$(git -C "$DOTFILES_ROOT" rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "system": "$(uname -s) $(uname -r)"
}
EOF
    
    log_success "Backup created: $backup_path"
    echo "$backup_path" > "$BACKUP_DIR/latest_backup.txt"
    
    return 0
}

# Restore from backup
restore_backup() {
    local backup_path="$1"
    
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup directory not found: $backup_path"
        return 1
    fi
    
    log_info "Restoring from backup: $backup_path"
    log_warning "This will overwrite current dotfiles. Continue? (y/N)"
    read -r response
    
    if [[ "$response" != "y" && "$response" != "Y" ]]; then
        log_info "Restore cancelled"
        return 0
    fi
    
    # Find files to restore
    find "$backup_path" -type f ! -name "metadata.json" | while read -r backup_file; do
        local relative_path="${backup_file#$backup_path/}"
        local target_path="$HOME/$relative_path"
        
        # Create parent directory if needed
        mkdir -p "$(dirname "$target_path")"
        
        # Remove existing target to avoid conflicts
        if [[ -e "$target_path" ]]; then
            log_debug "Removing existing: $target_path"
            rm -rf "$target_path"
        fi
        
        # Copy file back
        if cp -R "$backup_file" "$target_path"; then
            log_file_operation "restore" "$backup_file" "$target_path"
            log_debug "Restored: $relative_path"
        else
            log_error "Failed to restore: $relative_path"
        fi
    done
    
    log_success "Restore completed from: $backup_path"
}

# List available backups
list_backups() {
    log_info "Available backups:"
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_info "No backups found"
        return 0
    fi
    
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort -r | while read -r backup_path; do
        local backup_name=$(basename "$backup_path")
        local timestamp=$(echo "$backup_name" | sed 's/backup_//' | sed 's/\(....\)\(..\)\(..\)_\(..\)\(..\)\(..\)/\1-\2-\3 \4:\5:\6/')
        
        if [[ -f "$backup_path/metadata.json" ]]; then
            local operation=$(jq -r '.operation' "$backup_path/metadata.json" 2>/dev/null || echo "unknown")
            echo "  $backup_name - $timestamp (operation: $operation)"
        else
            echo "  $backup_name - $timestamp"
        fi
    done
}

# Cleanup old backups
cleanup_backups() {
    local keep_count="${1:-5}"
    
    log_info "Cleaning up old backups (keeping latest $keep_count)"
    
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort -r | tail -n +$((keep_count + 1)) | while read -r old_backup; do
        log_info "Removing old backup: $(basename "$old_backup")"
        rm -rf "$old_backup"
    done
}

# Get latest backup path
get_latest_backup() {
    if [[ -f "$BACKUP_DIR/latest_backup.txt" ]]; then
        cat "$BACKUP_DIR/latest_backup.txt"
    else
        # Fallback to find latest
        find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort -r | head -n1
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_path="$1"
    
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup not found: $backup_path"
        return 1
    fi
    
    if [[ ! -f "$backup_path/metadata.json" ]]; then
        log_warning "Backup metadata not found, but directory exists"
        return 0
    fi
    
    # Check if backup has content
    local file_count=$(find "$backup_path" -type f ! -name "metadata.json" | wc -l)
    log_info "Backup verification: $file_count files backed up"
    
    if [[ $file_count -eq 0 ]]; then
        log_warning "Backup appears to be empty"
        return 1
    fi
    
    log_success "Backup verification passed"
    return 0
}

# Interactive rollback
interactive_rollback() {
    log_info "Interactive rollback mode"
    list_backups
    echo ""
    
    log_info "Enter backup name to restore (or 'latest' for most recent):"
    read -r backup_choice
    
    local backup_path
    if [[ "$backup_choice" == "latest" ]]; then
        backup_path=$(get_latest_backup)
    else
        backup_path="$BACKUP_DIR/$backup_choice"
    fi
    
    if [[ -n "$backup_path" ]]; then
        if verify_backup "$backup_path"; then
            restore_backup "$backup_path"
        else
            log_error "Backup verification failed"
            return 1
        fi
    else
        log_error "Invalid backup choice"
        return 1
    fi
}

# Export functions for use in other scripts
export -f init_backup backup_file backup_dotfiles restore_backup
export -f list_backups cleanup_backups get_latest_backup verify_backup
export -f interactive_rollback

# Export variables
export BACKUP_DIR BACKUP_TIMESTAMP CURRENT_BACKUP