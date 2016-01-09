# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


# Work-related aliases and symlinks

# Switching versions of databases
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
preCreateSymlink="cd ~/bin/tesla/7/sites_d7/default/;rm -f settings.php"
postCreateSymlink="ll;cd ../../drupal/;./drush cc all"

alias teslausemigration="$preCreateSymlink;ln -s settings-d7-migration.php settings.php;$postCreateSymlink"
alias teslauseproduction="$preCreateSymlink;ln -s settings-d7-production.php settings.php;$postCreateSymlink"

alias resetafterd6dbsync="cd ~/bin/tesla/6/drupal;./drush updb;./drush tesla-d6p-modules-on;./drush tesla-d6p-vars-on;./drush pm-disable tesla_sso;./drush cc all"
alias resetafterdbsync="cd ~/bin/tesla/7/drupal/;./drush pm-disable tesla_gatekeeper;./drush cc all;./drush uli --mail=eritchey@teslamotors.com"


# Drush shortcuts
alias dr='./Users/eritchey/bin/tesla/7/drupal/drush'


# Sass watch alias for D7 Master
alias watch="sass --unix-newlines --sourcemap --watch --compass scss:css"

function sass-watcher() {
    if [[ $1 = "d7-theme" ]]; then
        cd ~/bin/tesla/7/sites_d7/all/themes/custom/tesla_theme/
        rm -rf css
        watch
    elif [[ $1 = "d7-theme-alt" ]]; then
        cd ~/bin/tesla/7/sites_d7/all/themes/custom/tesla_theme/assets
        watch
    elif [[ $1 = "findus" ]]; then
        cd ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_findus_map/styles
        watch
    elif [[ $1 = "d6-config" ]]; then
        cd ~/bin/tesla/6/sites/all/themes/tesla/configurator/css
        sass --style expanded --unix-newlines --watch scss:src
    elif [[ $1 = "d6-dashboard" ]]; then
        rm ~/bin/tesla/6/sites/all/themes/tesla/mytesla_dashboard/css/style.css
        cd ~/bin/tesla/6/sites/all/themes/tesla/mytesla_dashboard/css
        sass --unix-newlines --watch style.scss:style.css
    fi
}


# All the Ants
# examples:
#   ant-me d6 ge
#   ant-me d6 config
#   ant-me d7
function ant-me() {
    if [[ $1 = "d6" ]]; then
        if [[ $2 = "ge" ]]; then
            "ant -buildfile ~/bin/tesla/6/sites/all/themes/tesla/goelectric/build/"
        elif [[ $2 = "config" ]]; then
            "ant -buildfile ~/bin/tesla/6/drupal/tesla_theme/configurator"
        fi
    elif [[ $1 = "d7" ]]; then
        "ant -buildfile ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator"
    fi
}
# alias d6-goelectric-ant="ant -buildfile ~/bin/tesla/6/sites/all/themes/tesla/goelectric/build/"
# alias d6-configurator-ant="ant -buildfile ~/bin/tesla/6/drupal/tesla_theme/configurator"
# alias d7-configurator-ant="ant -buildfile ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator"

# Engine Compiler
function engine() {
    if [[ $1 = "d6" ]]; then
        "coffee -c ~/bin/tesla/6/drupal/tesla_theme/configurator/src/engine.coffee;uglifyjs2 -cmv ~/bin/tesla/6/drupal/tesla_theme/configurator/src/engine.js -o ~/bin/tesla_d6/drupal/tesla_theme/configurator/src/engine.js"
    elif [[ $1 = "d7" ]]; then
        "coffee -c ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.coffee;uglifyjs2 -cmv ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.js -o ~/bin/tesla/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.js"
    fi
}
# alias d6-engine="coffee -c ~/bin/tesla/6/drupal/tesla_theme/configurator/src/engine.coffee;uglifyjs2 -cmv ~/bin/tesla/6/drupal/tesla_theme/configurator/src/engine.js -o ~/bin/tesla_d6/drupal/tesla_theme/configurator/src/engine.js"
# alias d7-engine="coffee -c ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.coffee;uglifyjs2 -cmv ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.js -o ~/bin/tesla/sites_d7/all/modules/custom/tesla_configurator/js/coffee/engine.js"


# Price Calculator Compilers
function pricecalc() {
    if [[ $1 = "d6" ]]; then
        "coffee -c ~/bin/tesla/6/drupal/tesla_theme/configurator/src/price_calculator.coffee;uglifyjs2 -cmv ~/bin/tesla/6/drupal/tesla_theme/configurator/src/price_calculator.js -o ~/bin/tesla_d6/drupal/tesla_theme/configurator/src/price_calculator.js"
    elif [[ $1 = "d7" ]]; then
        "coffee -c ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/price_calculator.coffee;uglifyjs2 -cmv ~/bin/7/tesla/sites_d7/all/modules/custom/tesla_configurator/js/coffee/price_calculator.js -o ~/bin/tesla/7/sites_d7/all/modules/custom/tesla_configurator/js/coffee/price_calculator.js"
    fi
}

# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
