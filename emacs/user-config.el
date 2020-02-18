; https://raw.githubusercontent.com/karlicoss/dotfiles-emacs/master/.spacemacs.d/config.el
; refined init.el, gradually will mode all of my config here
; loaded in dotspacemacs/user-config

;;; random helpers

; TODO should this be macro??
(cl-defun with-error-on-user-prompt (body)
  "Suppress user prompt and throw error instead. Useful when we really want to avoid prompts, e.g. in non-interactive functions"
  (interactive)
  (cl-letf (((symbol-function 'y-or-n-p) (lambda (arg) (error "IGNORING PROMPT %s" arg))))
    (eval body)))
;;;


; omg why is elisp so shit...
(defun my/get-output (cmd)
  "shell-command-to-string mixes stderr and stdout, so we can't rely on it for getting filenames etc..
   It also ignores exit code.
   (see https://github.com/emacs-mirror/emacs/blob/b7d4c5d1d1b55fea8382663f18263e2000678be5/lisp/simple.el#L3569-L3573)

   This function ignores stderr for now since I haven't figured out how to redirect it to *Messages* buffer :("
  (with-output-to-string
    (with-temp-buffer
      (shell-command
       cmd
       standard-output
       (current-buffer)))))


;;; searching for things
(cl-defun my/files-in (path &key (exts nil) (follow nil))
  "Search for files with certail extensions and potentially following symlinks.
   None of standard Elisp functions or popular libs support following symlink :(
   In addition, rg is ridiculously fast."
  (assert (stringp path)) ;; TODO surely there is a nicer way?? how to define it next to path?
  (let* ((patterns (s-join " " (-map (lambda (i) (format "-e %s" i)) exts)))
         (follows (if follow "--follow" ""))
         (rg-command (format
	              ;; TODO ugh. quoting third %s broke agenda for some reason (fd complained it wasn't a directory??)
                      "fdfind . %s %s %s -x readlink -f" ; ugh, --zero isn't supported on alpine (cloudmacs)
                      follows
                      patterns
                      path))
         (filenames (s-split "\n" (shell-command-to-string rg-command) t)))
    (-map #'file-truename filenames)))

(cl-defun my/org-files-in (path &key (archive nil) (follow nil))
  (my/files-in path :exts (if archive '("org" "org_archive") '("org")) :follow follow))



(with-eval-after-load 'helm
  ;; patch spacemacs/helm-files-do-rg to support extra targets argument used in --my/helm-files-do-rg
  (load-file "~/.dotfiles/emacs/patch-helm.el"))


(cl-defun --my/helm-files-do-rg (dir &key (targets nil) (rg-opts nil))
  "Helper function to aid with passing extra arguments to ripgrep"
  (require 'helm-ag)
  ;; TODO need to ignore # files?
  (let ((helm-ag-command-option (s-join " " rg-opts)))
    ;; NOTE: spacemacs/helm-files-do-rg is patched to support second argument with multiple directories
    ;; (see patch-helm.el)
    (spacemacs/helm-files-do-rg dir targets)))


(defun --my/find-file-defensive (f)
  "Open file, ignoring lock files, various IO race conditions and user prompts.
   Returns filename if successful, othewise nil"
  (ignore-errors (with-error-on-user-prompt `(find-file-read-only f)) f))


;; TODO FIXME fucking hell, elisp doesn't seem to have anything similar to e.g. check_call in python
;; also no simple way to pass set -eu -o pipefail
;; so, if find or xargs fails, you'd get with garbage in the variable

;; really wish there was some sort of bridge for configuring emacs on other programming languages
;; there is zero benefit of using Elisp for most of typical emacs configs; only obstacles.
;; can't say about other lisps, but very likely it's not very beneficial either
(setq my/git-repos-search-root "/home/bhillmann/code")
(setq my/search-targets "/home/bhillmann/code")

(defun --my/git-repos-refresh ()
  (let ((search-git-repos-cmd (s-join " "
                                      `(
                                        "fd"
                                        "--follow" ; follow symlink
                                        ;; match git dirs, excluding bare repositories (they don't have index)
                                        "--hidden" "--full-path" "--type f" "'.git/index$'"
                                        ,(format "'%s'" my/git-repos-search-root)
                                        "-x" "readlink" "-f" "'{//}'")))) ; resolve symlinks and chop off 'index'
    (progn
      (message "refreshing git repos...")
      (defconst *--my/git-repos*
        (-distinct
         (-map (lambda (x) (s-chop-suffix "/.git" x))
               (s-split "\n" ; remove duplicates due to symlinking
                        (shell-command-to-string search-git-repos-cmd) t))))))) ; t for omit-nulls


(defun my/code-targets ()
  "Collects repositories across the filesystem and bootstraps the timer to update them"
  ; TODO there mustbe some generic caching mechanism for that in elisp?
  (let ((refresh-interval-seconds (* 60 5)))
    (progn
      (unless (boundp '*--my/git-repos*)
        (--my/git-repos-refresh)
        (run-with-idle-timer refresh-interval-seconds t '--my/git-repos-refresh))
      *--my/git-repos*)))



(defun --my/one-off-helm-follow-mode ()
;; I only want helm follow when I run helm-ag against my notes,
;; but not all the time, in particular when I'm running my/search-code because it
;; triggers loading LSP etc
;; Problem is helm-follow-mode seems to be handled on per-source basis
;; and there is some logic that tries to persist it in customize-variables
;; for future emacs sessions.
;; helm-ag on one hand seems to use since source (helm-ag-source) for all searches
;; on the orther hand it does some sort of dynamic renaming and messing with source names
;; (e.g. search by "helm-attrset 'name")
;; As a result it's very unclear what's actually happening even after few hours of debugging.
;; also see https://github.com/emacs-helm/helm/issues/2006,

;; other things I tried (apart from completely random desperate attempts)
;; - setting
;;   (setq helm-follow-mode-persistent t)
;;   (setq helm-source-names-using-follow `(,(helm-ag--helm-header my/search-targets))))
;; - using different source similar to helm-ag-source, but with :follow t -- doesn't work :shrug:

;; in the end I ended up hacking hooks to enable follow mode for specific helm call
;; and disabling on closing the buffer. Can't say I like it at all and looks sort of flaky.

  (defun --my/helm-follow-mode-set (arg)
    "Ugh fucking hell. Need this because helm-follow-mode works as a toggle :eyeroll:"
    (unless (eq (helm-follow-mode-p) arg)
      (helm-follow-mode)))

  (defun --my/enable-helm-follow-mode ()
    (--my/helm-follow-mode-set t))

  (defun --my/disable-helm-follow-mode ()
    (--my/helm-follow-mode-set nil)
    (remove-hook 'helm-move-selection-before-hook '--my/enable-helm-follow-mode)
    (remove-hook 'helm-cleanup-hook '--my/disable-helm-follow-mode))

  ;; ugh, helm-move-selection-before-hook doesn seem like the right one frankly
  ;; but I haven't found anything better, e.g. helm-after-initialize-hook seems too early
  ;; helm-after-update-hook kinda worked, but immediately dropped after presenting results
  ;; as helm complains at 'Not enough candidates' :(
  (add-hook 'helm-move-selection-before-hook '--my/enable-helm-follow-mode)
  (add-hook 'helm-cleanup-hook '--my/disable-helm-follow-mode))


(defun my/search ()
  (interactive)
  (--my/one-off-helm-follow-mode)
  (--my/helm-files-do-rg my/search-targets
                         :rg-opts '("--follow")))

(defun my/search-code ()
  (interactive)
  (--my/helm-files-do-rg "/"
                         :targets (my/code-targets)
                         :rg-opts '("-T" "txt" "-T" "md" "-T" "html" "-T" "org" "-g" "!*.org_archive")))


(with-eval-after-load 'helm-ag
  ;; see helm-ag--construct-command. Not configurable otherwise ATM
  (defun helm-ag--construct-ignore-option (pattern)
    (concat "--glob=!" pattern)))
;;;

(spacemacs/set-leader-keys
  "RET" #'helm-swoop
  "S s" #'my/search
  "S c" #'my/search-code

  ;; TODO extract search-hotkeys so it's easy to extract for the post?
  "p P" #'helm-projectile-find-file-in-known-projects

  ; TODO link to my post?
  "q q" #'kill-emacs
  )



(global-set-key (kbd "<f1>") #'my/search)
(global-set-key (kbd "<f3>") #'my/search-code)
