<?php
//require_once('databaseSetup.php');
require_once('twilio/Twilio.php');
define('TWILIO_ACCOUNT_SID','AC0ed29332c1c4490a9cc840fc6fc88ce6');
define('TWILIO_AUTH_TOKEN','45575da0505f5767ae5ec91d7749872a');
define('TWILIO_FROM','14155992671');
define('KOOKOO_API','KKa1f110221b2e22461879d89a1142b458');
define('KOOKOO_URL','http://www.kookoo.in/outbound/outbound_sms.php');

function main()
{
}

function sendSMS($numbers,$message)
{
	$results = array();
	foreach($numbers as $number)
	{
		preg_match_all('/([0-9]+)/',$number,$phone,PREG_PATTERN_ORDER);
		$phone = $phone[0];
		if($phone[0] == '91')
		{
			//Set post parameters
			$params = 'phone_no='.implode('',$phone)."&message=".urlencode($message)."&api_key=".KOOKOO_API;
			
			//Initiate cURL and Set Options
			$ch = curl_init();
			curl_setopt_array($ch, array(
				CURLOPT_URL => KOOKOO_URL,
				CURLOPT_HEADER => FALSE,
				CURLOPT_RETURNTRANSFER => TRUE,
				CURLOPT_POST => TRUE,
				CURLOPT_POSTFIELDS => $params,
				CURLOPT_TIMEOUT => 60,
				CURLOPT_RETURNTRANSFER => TRUE
				)
			);
			$response =  new SimpleXMLElement(curl_exec($ch));
			$results[$number] = $response;
		}
		elseif($phone[0] == '1')
		{
			unset($phone[0]);
			$client = new Services_Twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);
			$client->account->sms_messages->create(TWILIO_FROM,implode('',$phone),$message);
		}
	}
	return $results;
}
?>