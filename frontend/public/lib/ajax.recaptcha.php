<?php

require_once( 'recaptchalib.php');

$privatekey = '6LfTZcESAAAAAF87CNl_PqxibHOtTXr9gzEQfjLT';

$resp = recaptcha_check_answer ($privatekey,
    $_SERVER["REMOTE_ADDR"],
    $_POST["recaptcha_challenge_field"],
    $_POST["recaptcha_response_field"]);

if ($resp->is_valid) {
    ?>success<?php
}
else
{
    die ("The reCAPTCHA wasn't entered correctly. Go back and try it again." .
        "(reCAPTCHA said: " . $resp->error . ")");
}
?>