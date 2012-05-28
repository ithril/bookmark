<?php
require_once('databaseSetup.php');

define("EMBEDLY", "http://api.embed.ly/1/oembed");
define("KEY", "d8d0c9468b2d11e181894040d3dc5c07");

requestMain();

/** 
 * main entry point: GET, PUT, POST allowed
 * 
* Gets the HTTP method type and dispatches to the appropriate function
*/
function requestMain() 
{
	$request_method = $_SERVER["REQUEST_METHOD"];

	switch($request_method) 
	{
		case "GET":
		getBookMarks();
		break;
		case "DELETE":
		deleteBookMark();
		break;
		case "POST":
		insertBookMark();
		break;
		
		default:
		header('HTTP/1.1 405 Method Not Allowed'); // no other request types allowed
		die(1);
	}
}

// Returns Bookmarks in the given topic. 
// If topic not mentioned, returns all bookmarks.

function getBookMarks()
{
	$userId = isset($_GET['uid']) ? $_GET['uid'] : '';
	$topic = isset($_GET['topic']) ? $_GET['topic'] : '';

	// Return 400 if ID is missing
	if ($userId == '') 
	{
		error_response(400, '\'userID\' field is missing!');
		return;
	}
	
	$query = null;
	
	// If topic is not mentioned, return all of the rows
	if ($topic == '') 
	{
		$query = "SELECT topic,url,embedobj FROM bookmarks WHERE uid = '$userId'";
	}
	else
	{
		$query = "SELECT topic,url,embedobj FROM bookmarks WHERE uid = '$userId' AND topic = '$topic'";
	}
	
	$result = mysql_query($query) or die(mysql_error());

	$response = formatResponse($result); 
	
	echo json_encode($response);	 
	
	header('HTTP/1.1 200 OK');
  	return;
}


/**
 * Formats the rows retrieved from the dataset
 */
function formatResponse($result) 
{
	$responseArray = array();

	while ($row = mysql_fetch_array($result)) 
	{	
		//var_dump($row);
		$responseArray[] = formatRow($row);
	}

	return $responseArray;
}


function formatRow($row)
{
	$arr = array(
	"topic"=> $row['topic'],
	"url"=> $row['url'],
	"data"=> $row['embedobj'],
	);
	
	return $arr;
}


// Inserts the url info into DB 
function insertBookMark()
{
	$url = isset($_POST['url']) ? $_POST['url'] : '';
	$topic = isset($_POST['topic']) ? $_POST['topic'] : '';
	$userId = isset($_POST['uid']) ? $_POST['uid'] : '';
	
	// Return 400 if ID is missing
	if ($url == '') 
	{
		error_response(400, '\'URL\' field is missing!');
		return;
	}
	
	// Return 400 if ID is missing
	if ($userId == '') 
	{
		error_response(400, '\'userid\' field is missing!');
		return;
	}
	
	$dataobj = getEmbed($url);
	
	//$result = insertIntoDb($userId,$topic,$url,$dataobj);
	insertIntoDb($userId,$topic,$url,$dataobj);
	
	// return the preview itself on a post!
	//return $result;
	echo '1';
	 
}


/* HELPERS */

//@TODO: use mysql PDO object to avoid sql injecions
function insertIntoDb($userId,$topic,$url,$dataobj)
{
	$sql="INSERT INTO bookmarks(uid,topic,url,embedobj) VALUES('$userId','$topic','$url','$dataobj')";
	$query = mysql_query($sql) or die(mysql_error());
	//return getrow() 
}

/* Get url preview from embedly*/
function getEmbed($url)
{
	//@TODO: send max width parameter etc for videos!
	//Refer to: http://embed.ly/docs/endpoints/arguments 
	
    $url = EMBEDLY.'?key='.KEY.'?url='.$url;
	$embedobj = get($url, array('token'=>$token));
    return $embedobj;
}

/* 
* Call the HTTP 'GET' method 
* @param string $url URL of the service.. 
* @param array $params request parameters, hash of (key,value) pairs
*/
function get($url, $params) 
{	
	if(!empty($params))
	{
		$params_str = "?"; 
		if (is_array($params)) 
		{
			foreach ($params as $key => $value) 
			{ 
				// @TODO: prints out extra & at the end!
				$params_str .= urlencode($key) . "=" . urlencode($value) . "&"; 
			}
		} 
		
		else 
		{ 
			$params_str .= $params;
		} 
		
		$url .= $params_str;
		
	}
	
	//var_dump($url);
	$curl = curl_init(); 
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_HTTPGET, TRUE);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER , TRUE); 
	//curl_setopt($curl, CURLOPT_USERAGENT, RESTClient :: USER_AGENT);
	$result = curl_exec($curl); 
	curl_close($curl);
	
	return $result;
}

/**
* Helper function to send error status codes and responses
* 
* Ensures headers are set correctly for error messages and encodes response
*
* @param  $code   
*	the http status code to respond with
* @param  $error  
*	the reason the error occurred
*
* @return output the http status code specified by $code and the json-encoded
*   reason that error occurred in the response body
**/
function error_response($code, $error) {
  switch($code) {
    case 403:
      header('HTTP/1.1 403 Forbidden');
      break;
    default:
      header('HTTP/1.1 400 Bad Request');
      break;
  }

  echo json_encode(array('error' => $error));
}
?>