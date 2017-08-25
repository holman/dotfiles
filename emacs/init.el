;; Don't litter my init file

;; Added by Package.el.  This must come before configurations of
;; installed packages.  Don't delete this line.  If you don't want it,
;; just comment it out by adding a semicolon to the start of the line.
;; You may delete these explanatory comments.
;; (package-initialize)

(setq custom-file (expand-file-name "custom.el" user-emacs-directory))
(load custom-file 'noerror)

(defun me/load (filename)
  "Load file from user emacs directory"
  (load-file (expand-file-name filename user-emacs-directory)))

(me/load "./setup_package_mgmt.el")
(me/load "./setup_editor.el")
(me/load "./setup_evil_mode.el")
(me/load "./setup_powerline.el")
;; (me/load "./legacy-theme.el")

(setq initial-scratch-message "Welcome")

(setq use-package-always-ensure t)
;; Personal package list
;; Associated package initialization is grouped with package
(use-package try)

(use-package linum-relative
  :init (setq linum-relative-current-symbol "")
  :config
  (global-linum-mode t)
  (linum-relative-mode t))

(use-package doom-themes
  :config
  (load-theme 'doom-one t)
  (doom-themes-neotree-config) 
  (doom-themes-visual-bell-config))

(use-package company
  :config
  (company-mode)
  (add-hook 'after-init-hook 'global-company-mode))

(use-package projectile
  :config (projectile-mode))

(use-package undo-tree
  :init (global-undo-tree-mode))

(use-package yasnippet)

(use-package which-key
  :config (which-key-mode))

(use-package zoom-window)

(use-package neotree
  :config (setq neo-theme (if (display-graphic-p) 'icons 'arrow)))

(use-package all-the-icons)

;; (use-package smooth-scroll
;;   :config
;;   (smooth-scroll-mode 1)
;;   (setq smooth-scroll/vscroll-step-size 5))

(use-package helm
  :config (global-set-key (kbd "M-x") 'helm-M-x))

(defun telephone-line-evil-config ()
  "A simple default for using telephone-line with evil."
  (setq telephone-line-lhs
        '((evil   . (telephone-line-evil-tag-segment))
          (accent . (telephone-line-vc-segment
                     telephone-line-erc-modified-channels-segment
                     telephone-line-process-segment))
          (nil    . (telephone-line-minor-mode-segment
                     telephone-line-buffer-segment))))

  (setq telephone-line-rhs
        '((nil    . (telephone-line-misc-info-segment))
          (accent . (telephone-line-major-mode-segment))
          (evil   . (telephone-line-airline-position-segment))))

  (telephone-line-mode t))

(use-package telephone-line
  :config
  (telephone-line-evil-config))
