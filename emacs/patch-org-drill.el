; -*- mode: Lisp; paredit-mode: 0; -*-


; reason for patching: I want to support really simple card types, kind of like simple topics
; (see https://gitlab.com/phillord/org-drill/tree/master#simple-topics)
; , but without even needing an answer

; TODO add test?
; TODO propose it to org-drill?

(el-patch-feature org-drill)
(with-eval-after-load 'org-drill

(el-patch-defun org-drill-entry-status (session)
  "Returns a list (STATUS DUE AGE) where DUE is the number of days overdue,
zero being due today, -1 being scheduled 1 day in the future.
AGE is the number of days elapsed since the item was created (nil if unknown).
STATUS is one of the following values:
- nil, if the item is not a drill entry, or has an empty body
- :unscheduled
- :future
- :new
- :failed
- :overdue
- :young
- :old
"
  (save-excursion
    (unless (org-at-heading-p)
      (org-back-to-heading))
    (let ((due (org-drill-entry-days-overdue session))
          (age (org-drill-entry-days-since-creation session t))
          (last-int (org-drill-entry-last-interval 1)))
      (list
       (cond
        ((not (org-drill-entry-p))
         nil)
        ((and (org-drill-entry-empty-p)
              (let* ((card-type (org-entry-get (point) "DRILL_CARD_TYPE" nil))
                    (dat (cdr (assoc card-type org-drill-card-type-alist))))
                ((el-patch-swap or and) (null card-type)
                    (not (cl-third dat)))))
         ;; body is empty, and this is not a card type where empty bodies are
         ;; meaningful, so skip it.
         nil)
        ((null due)                     ; unscheduled - usually a skipped leech
         :unscheduled)
        ;; ((eql -1 due)
        ;;  :tomorrow)
        ((cl-minusp due)                   ; scheduled in the future
         :future)
        ;; The rest of the stati all denote 'due' items ==========================
        ((<= (org-drill-entry-last-quality 9999)
             org-drill-failure-quality)
         ;; Mature entries that were failed last time are
         ;; FAILED, regardless of how young, old or overdue
         ;; they are.
         :failed)
        ((org-drill-entry-new-p)
         :new)
        ((org-drill-entry-overdue-p session due last-int)
         ;; Overdue status overrides young versus old
         ;; distinction.
         ;; Store marker + due, for sorting of overdue entries
         :overdue)
        ((<= (org-drill-entry-last-interval 9999)
             org-drill-days-before-old)
         :young)
        (t
         :old))
       due age))))


)
