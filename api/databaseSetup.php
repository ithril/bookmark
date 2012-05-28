<?php
$username="root";
$password="root";
$database="bookmark";
 

$link = mysql_connect(
  ':/Applications/MAMP/tmp/mysql/mysql.sock',
  'root',
  'root'
) or trigger_error("SQL", E_USER_ERROR);

 
if(!$link)
{
        die('Could not connect:' . mysql_error());
}
 
mysql_select_db($database) or die ('Could not connect to database' . mysql_error());
 
?>