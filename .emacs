;; Don't litter my init file
(setq custom-file (expand-file-name "custom.el" user-emacs-directory))
(load custom-file 'noerror)

;; Disable that startup screen
(setq inhibit-startup-screen t)

;; Store backups/autosaves in the temporary directory
(setq backup-directory-alist
      `((".*" . ,temporary-file-directory)))
(setq auto-save-file-name-transforms
      `((".*" ,temporary-file-directory t)))

;; Package management initialization
(require 'package)
(setq package-enable-at-startup nil)
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(add-to-list 'package-archives '("gnu" . "http://elpa.gnu.org/packages/"))
(package-initialize)

(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

;; Editor settings
(tool-bar-mode -1) 
(toggle-scroll-bar -1)

;; Personal package list
;; Associated package initialization is grouped with package
(use-package try
  :ensure t)

(use-package linum-relative
  :ensure t
  :init (setq linum-relative-current-symbol "")
  :config
  (progn
    (global-linum-mode t)
    (linum-relative-mode t)))

(use-package darkokai-theme
  :ensure t
  :config (load-theme 'darkokai t))

(use-package evil
  :ensure t
  :init (setq evil-want-C-u-scroll t) 
  :config (evil-mode 1))

(use-package evil-leader
  :ensure t)

(evil-define-motion me/evil-previous-visual-line (count)
  "Move the cursor COUNT screen lines down, or 5."
  :type exclusive
  (let ((line-move-visual t))
    (evil-line-move (or count -5))))

(evil-define-motion me/evil-next-visual-line (count)
  "Move the cursor COUNT screen lines down, or 5."
  :type exclusive
  (let ((line-move-visual t))
    (evil-line-move (or count 5))))


(with-eval-after-load 'evil-maps
    (define-key evil-normal-state-map "J" 'me/evil-next-visual-line)
    (define-key evil-normal-state-map "K" 'me/evil-previous-visual-line)
    (define-key evil-visual-state-map "J" 'me/evil-next-visual-line)
    (define-key evil-visual-state-map "K" 'me/evil-previous-visual-line))

;; Save and exit normal mode on cmd-s
(global-set-key
 (kbd "s-s")
 (lambda()
   (interactive)
   (evil-normal-state)
   (save-buffer)))

(use-package company
  :ensure t)

(use-package projectile
  :ensure t
  :config (projectile-mode))

(use-package evil-nerd-commenter
  :ensure t)

(use-package powerline
  :ensure t)

(use-package powerline-evil
  :ensure t
  :config (powerline-evil-vim-color-theme))

(use-package undo-tree
  :ensure t
  :init (global-undo-tree-mode))

(use-package yasnippet
  :ensure t)

;(desktop-save-mode 1)
;(savehist-mode 1)
;(add-to-list 'savehist-additional-variables 'kill-ring)
