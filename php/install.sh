#!/bin/sh
php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php
php composer-setup.php
php -r "unlink('composer-setup.php');"

mv composer.phar /usr/local/bin/composer;


#pecl install xdebug apcu apcu-bc intl mcrypt
