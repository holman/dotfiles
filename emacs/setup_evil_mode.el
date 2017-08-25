(use-package evil
  :ensure t
  :init (setq evil-want-C-u-scroll t) 
  :config (evil-mode 1))

; (use-package evil-leader
;   :ensure t)

(use-package evil-nerd-commenter
  :ensure t)

(defun me/move-line-up ()
  "Move a single line up"
  (transpose-lines 1)
  (previous-line 2))

(defun me/move-line-down ()
  "Move a single line down"
  (next-line 1)
  (transpose-lines 1)
  (previous-line 1))

(defun me/move-region-up ()
  "Move a visual selected region up"
  (concat ":m '<-2" (kbd "RET") "gv=gv"))

(defun me/move-region-down ()
  "Move a visual selected region down"
  (concat ":m '>+1" (kbd "RET") "gv=gv"))

;; One day try to figure out how to actually write elisp
;; (defun me/map-evil-key (key f &optional modes)
;;   "
;; Allow functions to skip the specification of interactive
;; Provides a wrapper around keyboard strings
;; Also allows the desired vim modes to be specified
;; "
;;   (interactive)
;;   (let ((modes (or modes 1)))
;;     (loop for (key . value) in modes
;; 	  (+ 2 3))))

;; (me/map-evil-key "J" 'me/evil-jump-5-lines-down)

(with-eval-after-load 'evil-maps
  ;; Multiple line jumps up or down
  (define-key evil-normal-state-map (kbd "J") "5j")
  (define-key evil-normal-state-map (kbd "K") "5k")
  (define-key evil-visual-state-map (kbd "J") "5j")
  (define-key evil-visual-state-map (kbd "K") "5k")
  ;; Move individual lines up or down
  (define-key evil-normal-state-map (kbd "M-j") 'me/move-line-down)
  (define-key evil-normal-state-map (kbd "M-k") 'me/move-line-up)
  ;; Move selected regions up or down
  (define-key evil-visual-state-map (kbd "M-j") 'me/move-region-up)
  (define-key evil-visual-state-map (kbd "M-k") 'me/move-region-down))

;; Save and exit normal mode on cmd-s
(global-set-key
 (kbd "s-s")
 (lambda()
   (interactive)
   (evil-normal-state)
   (save-buffer)))
