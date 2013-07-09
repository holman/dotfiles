$| = 1;

while(true) {
    print "perl>  ";
    $line=<>;
    $value=eval($line);
    $error=$@;
    if( $error ne "" ) { 
            print $error; 
        } else { 
            print "$value\n"; 
    }
}
