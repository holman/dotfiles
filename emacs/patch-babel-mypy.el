(setq --babel-mypy/exec-python "
output=$(python3 $tfile 2>&1)
res=$?
output=$(echo $output | sed \"$sed_command\")

echo \"Python output [exit code $res]:\"
echo $output
")


(setq --babel-mypy/exec-mypy "
output=$(python3 -m mypy --show-error-codes --strict $tfile 2>&1)
res=$?
output=$(echo $output | sed \"$sed_command\")

echo \"Mypy output [exit code $res]:\"
echo $output
")

(setq --babel-mypy/exec-preamble "
tfile=$(mktemp)
cp /dev/stdin $tfile
sed_command=\"s#$tfile#input.py#g\" # need to replace tmp directory for deterministic output
")

;; see https://code.orgmode.org/bzg/worg/raw/master/org-contrib/babel/ob-template.el
(defun org-babel-execute:mypy (body params)
  (let* ((execute (assoc-default :eval params))
         (parts (if execute `(,--babel-mypy/exec-python "echo" ,--babel-mypy/exec-mypy) `(,--babel-mypy/exec-mypy)))
         (cmd (string-join (cons --babel-mypy/exec-preamble parts))))
    (org-babel-eval cmd body)))

;; TODO wonder if tangle helps with highlighting in emacs?
;; (add-to-list 'org-babel-tangle-lang-exts '("mypy" . "py"))
