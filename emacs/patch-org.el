; assumes with-eval-after-load 'org

;; TODO eh, should probably reuse  org-insert-heading-after-current ?
(defun my/org-quicknote ()
  """
  Inserts child heading with an inactive timestamp, useful for adding quick notes to org items

  E.g. before:

  * parent note
    some text <cursor is here>
  ** child
     child text

  after you call this function, you end up with:
  * parent note
    some text
  ** child
     child text
  ** [YYYY-MM-DD Mom HH:MM] <cursor is here, edit mode>

  """
  (interactive)
  (let* ((has-children (save-excursion (org-goto-first-child))))
    (org-end-of-subtree)
    (let ((org-blank-before-new-entry nil)) (org-insert-heading))
    (org-time-stamp '(16) t) ; 16 means inactive
    (if has-children nil (org-do-demote)) (insert " ")
    (evil-append 1)))

(defun my/org-eshell-command (command)
  ;; run command in eshell (e.g. [[eshell: ls -al /home]]
  (interactive)
  (progn
    (eshell)
    (eshell-return-to-prompt)
    (insert command)
    (eshell-send-input)))

;; TODO export it properly?
(org-add-link-type "eshell" 'my/org-eshell-command)


;; 'p': raw prefix, 'P': numeric prefix. confusing ...
(defun my/org-wipe-subtree (&optional n)
  (interactive "p")
  (org-cut-subtree n)
  (pop kill-ring))


;; TODO extract in a sep function? e.g. with-current-entry?
;; TODO ert-deftest?
(defun my/org-inline-created ()
  "Convert CREATED property into inline date"
  (interactive)
  (let ((created (org-entry-get (point) "CREATED"))
        (heading (org-get-heading t t t t))) ;; t t t t means include everything
    (save-excursion
      (org-back-to-heading t)
      (org-edit-headline (concat created " " heading)))
    (org-entry-delete (point) "CREATED")))
