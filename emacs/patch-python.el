; assumes with-eval-after-load 'python

(with-eval-after-load 'importmagic
  (setq importmagic-style-configuration-alist
    '((multiline   . backslash)
      (max_columns . 150))))

(with-eval-after-load 'lsp-mode
  (setq lsp-pyls-plugins-pylint-args '("--errors-only"))
  (setq lsp-pyls-plugins-pyflakes-enabled nil))

; TODO disable live mode for mypy?
; https://github.com/warchiefx/dotemacs/blob/e71c779f28955eaa234c097afd6e492ec3ba642e/site-wcx/wcx-lsp.el#L20
