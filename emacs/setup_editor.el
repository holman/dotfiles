;; Disable that startup screen
(setq inhibit-startup-screen t)

;; Store backups/autosaves in the temporary directory
(setq backup-directory-alist
      `((".*" . ,temporary-file-directory)))
(setq auto-save-file-name-transforms
      `((".*" ,temporary-file-directory t)))

;; Editor settings
(tool-bar-mode -1) 
(toggle-scroll-bar -1)
(fset 'yes-or-no-p 'y-or-n-p)
(setq ring-bell-function 'ignore)

; Highlight the current expression
(show-paren-mode t)
(setq show-paren-style 'expression)

; Autosave every 500 typed characters
(setq auto-save-interval 500)
; Scroll just one line when hitting bottom of window
;; (setq scroll-conservatively 10000)
