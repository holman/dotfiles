;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets.
(setq user-full-name "Benjamin Hillmann"
      user-mail-address "hillmannben@gmail.com"
      doom-font (font-spec :family "DejaVu Sans Mono" :size 16)
      doom-theme 'doom-monokai-spectrum
      display-line-numbers-type nil

      company-idle-delay nil
      lsp-ui-sideline-enable nil
      lsp-enable-symbol-highlighting nil)

;; If you use `org' and don't want your org files in the default location below,
;; change `org-directory'. It must be set before org loads!
(setq org-directory (file-truename "~/Dropbox/org/")
      org-ellipsis " ▼ "
      org-adapt-indentation nil
      org-habit-show-habits-only-for-today t
      ben/org-agenda-directory (file-truename (concat org-directory "gtd/")))

(setq search-highlight t
      search-whitespace-regexp ".*?"
      isearch-lax-whitespace t
      isearch-regexp-lax-whitespace nil
      isearch-lazy-highlight t
      isearch-lazy-count t
      lazy-count-prefix-format " (%s/%s) "
      lazy-count-suffix-format nil
      isearch-yank-on-move 'shift
      isearch-allow-scroll 'unlimited)


;; Add the company-org-roam setup from here https://www.ianjones.us/own-your-second-brain
;; This is done automatically now in the org-roam package
;; (require 'company-org-roam)
;;     (use-package company-org-roam
;;       :when (featurep! :completion company)
;;       :after org-roam
;;       :config
;;       (set-company-backend! 'org-mode '(company-org-roam company-yasnippet company-dabbrev)))

;; Copied from the dotfiles of the original founder of org-roam
;; https://github.com/jethrokuan/dots/blob/master/.doom.d/config.el#L436
(after! org-journal
  (setq org-journal-date-prefix "#+TITLE: "
        org-journal-file-format "%Y-%m-%d.org"
        org-journal-dir (file-truename (concat org-directory "dailies"))
        org-journal-carryover-items nil))

(after! org
  :init
  (require 'org-habit)

  (with-eval-after-load 'flycheck
    (flycheck-add-mode 'proselint 'org-mode))

  (map! :leader
        :prefix "n"
        "c" #'org-capture)
  (map! :map org-mode-map
        "M-n" #'outline-next-visible-heading
        "M-p" #'outline-previous-visible-heading)
  (setq org-src-window-setup 'current-window
        org-return-follows-link t
        org-babel-load-languages '((emacs-lisp . t)
                                   (sh . t)
                                   (rust . t)
                                   (python . t)
                                   (dot . t)
                                   (R . t))
        org-confirm-babel-evaluate nil
        org-use-speed-commands t
        org-catch-invisible-edits 'show
        org-preview-latex-image-directory "/tmp/ltximg/"
        org-structure-template-alist '(("a" . "export ascii")
                                       ("c" . "center")
                                       ("C" . "comment")
                                       ("e" . "example")
                                       ("E" . "export")
                                       ("h" . "export html")
                                       ("l" . "export latex")
                                       ("q" . "quote")
                                       ("s" . "src")
                                       ("v" . "verse")
                                       ("el" . "src emacs-lisp")
                                       ("d" . "definition")
                                       ("t" . "theorem"))))

(setq org-capture-templates
        `(("i" "inbox" entry (file ,(concat ben/org-agenda-directory "inbox.org"))
           "* TODO %?")
          ("c" "org-protocol-capture" entry (file ,(concat ben/org-agenda-directory "inbox.org"))
               "* TODO [[%:link][%:description]]\n\n %i"
               :immediate-finish t)))

(use-package! org-roam
  :commands (org-roam-insert org-roam-find-file org-roam-switch-to-buffer org-roam)
  :hook
  (after-init . org-roam-mode)
  :init
  (map! :leader
        :prefix "n"
        :desc "org-roam" "l" #'org-roam
        :desc "org-roam-insert" "i" #'org-roam-insert
        :desc "org-roam-switch-to-buffer" "b" #'org-roam-switch-to-buffer
        :desc "org-roam-find-file" "f" #'org-roam-find-file
        :desc "org-roam-show-graph" "g" #'org-roam-show-graph
        :desc "org-roam-insert" "i" #'org-roam-insert
        :desc "org-roam-capture" "c" #'org-roam-capture)
  (setq org-roam-directory org-directory
        org-roam-db-location (concat org-directory "org-roam.db")
        org-roam-db-gc-threshold most-positive-fixnum
        org-roam-graph-exclude-matcher "private"
        org-roam-tag-sources '(prop last-directory)
        org-id-link-to-org-use-id t)
  :config
  (setq org-roam-capture-templates
        '(("l" "lit" plain (function org-roam--capture-get-point)
           "%?"
           :file-name "lit/${slug}"
           :head "#+title: ${title}\n"
           :unnarrowed t)
          ("c" "concept" plain (function org-roam--capture-get-point)
           "%?"
           :file-name "concepts/${slug}"
           :head "#+title: ${title}\n"
           :unnarrowed t)
          ("p" "private" plain (function org-roam-capture--get-point)
           "%?"
           :file-name "private/${slug}"
           :head "#+title: ${title}\n"
           :unnarrowed t)))
  ;; Keep org dailies in their own folder
  ;; https://www.baty.net/2020/keeping-org-roam-daily-notes-in-a-separate-folder/
  (setq org-roam-dailies-capture-templates '(("d" "daily" plain (function org-roam-capture--get-point) ""
        :immediate-finish t
        :file-name "dailies/%<%Y-%m-%d>"
        :head "#+TITLE: %<%Y-%m-%d>")))
  (setq org-roam-capture-ref-templates
        '(("r" "ref" plain (function org-roam-capture--get-point)
           "%?"
           :file-name "lit/${slug}"
           :head "#+roam_key: ${ref}
#+roam_tags: website
#+title: ${title}
- source :: ${ref}"
           :unnarrowed t)))
  (set-company-backend! 'org-mode '(company-capf)))

(require 'org-roam-protocol)

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type t)


;; Here are some additional functions/macros that could help you configure Doom:
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.
