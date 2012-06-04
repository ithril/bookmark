<?php

// define url for Rest Server
define("APIURL", "http://werq.ath.cx/api");
//define("APIURL", "http://clone/api");

/* Get Profile Info */
function getProfile($id,$token = NULL)
{
    $url = APIURL.'/user/'.$id.'/profile';
	$profile = json_decode(get($url, array('token'=>$token)),true);
    return $profile;
}

/* Get Notifications */
function getNotifications($id,$token)
{
    $url = APIURL.'/user/'.$id.'/notifications';
	$notifications = json_decode(get($url, array('token'=>$token)),true);
    return $notifications;
}


/* Get following Info */
function getFollowing($id,$page= -1)
{
    $url = APIURL.'/user/'.$id.'/following';
	$followers = json_decode(get($url, array('page' => $page)),true);
	return $followers;
}

/* Get followers Info */
function getFollowers($id,$page= -1)
{
    $url = APIURL.'/user/'.$id.'/followers';
	$following = json_decode(get($url, array('page' => $page)),true);
	return $following;
}

/* Get friends Info */
function getFriends($id,$page= -1)
{
    $url = APIURL.'/user/'.$id.'/friends';
	$friends = json_decode(get($url, array('page' => $page)),true);
	return $friends;
}

/* Get bikes Info */
function getBikes($id, $token = NULL)
{
    $url = APIURL.'/user/'.$id.'/bikes';
    
   	if($token != NULL)
	{
		$bikes = json_decode(get($url,array('token'=>$token)),true);	
	}
	else
	{
		$bikes = json_decode(get($url,array()),true);	
	}

	return $bikes;
}

/* Get avatar */
function getAvatar($id)
{
    $url = APIURL.'/user/'.$id.'/avatar';
	$avatar = json_decode(get($url, array()),true);
	return $avatar;
}

/* Get garage Info */
function getGarage($id,$token)
{
	//@TODO: Garage does not really need userid, it computes the id from the token given!
    $url = APIURL.'/user/'.$id.'/garage';
	$garage = json_decode(get($url, array('token'=>$token)),true);
	return $garage;
}

/* Get groups joined by a user - id*/
function getGroups($id)
{
    $url = APIURL.'/user/'.$id.'/groups';
	$groups = json_decode(get($url, array()),true);
	return $groups;
}

/* Get info of group with id - gid*/
function getGroupInfo($gid)
{
    $url = APIURL.'/group/'.$gid;
	$groups = json_decode(get($url, array()),true);
	return $groups;
}

/* Get People ont he platform */
function getPeople() {
    $url = APIURL.'/people';
	$people = json_decode(get($url,array('page' => '-1')),true);		
	return $people;
}

/* Get groups on the platform */
function getAllGroups() {
    $url = APIURL.'/groups';
	$people = json_decode(get($url,array()),true);		
	return $people;
}

/* Get groups on the platform */
function getMessages($id,$option,$token) {
    $url = APIURL.'/user/'.$id.'/messages';
	$message = json_decode(get($url,array('type'=> $option, 'token'=>$token)),true);		
	return $message;
}

/* Get the detaield story */
function getStory($id, $token= NULL) {
    $url = APIURL."/story/".$id;
	if($token != NULL)
		$story = json_decode(get($url, array('token'=>$token)),true);
	else
		$story = json_decode(get($url, array()),true);

	return $story;
}

function getSearchResults($term, $type=null, $useFacet= true, $token = null, $page=0, $pageSize=20) {
    $url = APIURL."/search.php?term=" . $term;
    if ($page!=0 && is_numeric($page)) $url .= '&page=' . $page;
    if ($pageSize!=0 && is_numeric($pageSize)) $url .= '&pagesize=' . $pageSize;
    if (isset($type) && $type!='') $url.='&ctype=' . $type;
    if ($useFacet && !isset($type)) $url .= '&facet=true';
    $params = array();

    $searchResults = json_decode( get($url, $params), true);
    return $searchResults;
}

/* Get the comments of a story */
function getComments($id,$option)
{
	$url;
	
	if($option == 'story'){
		$url = APIURL."/story/".$id."/comment";
	}
	else if($option == 'group'){
		$url = APIURL."/story/".$id."/comment?option=group";
	}
	
	$comment = json_decode(get($url, array()),true);
	return $comment;
}


/* Get static feed */
function getFeedStatic($id,$page= 0)
{
    $url = APIURL."/feed/".$id;
	$feed = json_decode(get($url, array('page' => $page)),true);

	//var_dump($feed);

	return $feed;
}

/* 
Get dynamic feed, type is a filter 
which is used for any feed  
*/
function getFeed($name,$token = NULL,$type = NULL,$page = 0, $uid=NULL)
{
	if($type != NULL)
	{
		$url = APIURL."/feed/".$name."/".$type;
	}
	else
	{
		$url = APIURL."/feed/".$name;
	}
    
    // Dont think we need this, but kept it anyway 
    if($name == 'friends')
	{ 
		$feed = get($url, array('token'=>$token,'page' => $page));
	}
	
	else if($name == 'myposts')
	{
			if($token != NULL)
			{
				$feed = get($url, array('token'=>$token,'uid'=>$uid,'page' => $page));
			}

			else
			{
				$feed = get($url, array('uid'=>$uid,'page' => $page));
			}
	}
	
	else
	{
        if($token != NULL)
            $feed = get($url, array('page' => $page, 'token'=>$token));
        else
            $feed = get($url, array('page' => $page));
	}

	return json_decode($feed, true);
}


/* 
Get dynamic feed, type is a filter 
which is used for any feed  
*/
function getFeedLocation($lat,$lng,$distance = 200,$type=NULL,$page = 0)
{
	if($type != NULL)
	{
		$url = APIURL."/feed/location/".$type;
	}
	else
	{
		$url = APIURL."/feed/location";
	}
    
	$feed = json_decode(get($url, array('lat' => $lat,'lng' => $lng,'distance' => $distance, 'page' => $page)),true);
	
	return $feed;
}

/* Get Messages */
function getMesages($id,$token,$page=0)
{
    $url = APIURL."/user/".$id."/messages";
	$feed = json_decode(get($url,array('token'=>$token,'page' => $page)),true);

	//var_dump($feed);
	return $feed;
}

/* 
post request to authenticate user 
*/
function postAuth($username,$password,$rememberme)
{
    $url = APIURL."/user/authenticate";
    $postAuth = post($url, array('username' => $username,'password' => $password, 'dne'=>$rememberme));
	$authDetail = json_decode($postAuth,true);
	return $authDetail;
}

function putAuth($key) {
    $url = APIURL."/user/authenticate";
    $putAuth = put($url, array('validation'=>$key));
    $authDetail = json_decode($putAuth, true);
    return $authDetail;
}

/* Add garage Item */
function AddToGarage($id,$storyid,$token)
{
    $url = APIURL.'/user/'.$id.'/garage';
	$garage = json_decode(post($url, array('story_id'=>$storyid,'token'=>$token)),true);
	return $garage;
}


/* 
* Call the HTTP 'GET' method 
* @param string $url URL of the service.. 
* @param array $params request parameters, hash of (key,value) pairs
*/
function get($url, $params) 
{	
	$loggerGet = Zend_Registry::get('loggerGet');

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

		$loggerGet->log("URL: ".$url,Zend_Log::INFO);
	}
	
	//var_dump($url);
	$curl = curl_init(); 
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_HTTPGET, TRUE);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER , TRUE); 
	//curl_setopt($curl, CURLOPT_USERAGENT, RESTClient :: USER_AGENT);
	$result = curl_exec($curl); 
	curl_close($curl);
	
	$loggerGet->log($result,Zend_Log::INFO);
	
	return $result;
}


/* 
* Call the HTTP 'POST' method 
* @param string $url URL of the service.. 
* @param string $data request data 
* @return response string 
*/
function post($url, $data, $content_type = "text") 
{

	$curl = curl_init();
	
	$loggerPost = Zend_Registry::get('loggerPost');
	 
	//curl_setopt($curl, CURLOPT_HTTPHEADER, Array ("Content-Type: " . $content_type )); 
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_POST, TRUE); 
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data); 
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); 
	$result = curl_exec($curl);
	
	$loggerPost->log($result,Zend_Log::INFO);
	
	curl_close($curl);
	return $result;
}


/* 
* Call the HTTP 'PUT' method 
* @param string $url URL of the service.. 
* @param string $data request data 
* @return response string */

function put($url, $data) 
{
	$loggerPut = Zend_Registry::get('loggerPut');
	$loggerPut->log('URL:'.$url,Zend_Log::INFO);
	$loggerPut->log('Data:'.$data,Zend_Log::INFO);  
	
	$result = "";

    $putData = '';
    if (isset($data) && !empty($data)) {
        $putData = json_encode($data);
    }
	
	$fh = fopen('php://memory', 'rw'); 
	fwrite($fh, $putData);
	rewind($fh);
	
	$curl = curl_init();
	//curl_setopt($curl, CURLOPT_USERAGENT, RESTClient :: USER_AGENT);
	curl_setopt($curl, CURLOPT_INFILE, $fh); 
	curl_setopt($curl, CURLOPT_INFILESIZE, strlen($putData));
	curl_setopt($curl, CURLOPT_TIMEOUT, 10); 
	curl_setopt($curl, CURLOPT_PUT, 1); 
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); 
	$result = curl_exec($curl); 

	curl_close($curl);
	fclose($fh);
	
	$loggerPut->log($result,Zend_Log::INFO); 
	
	return $result;
}


/* 
* Call the HTTP 'DELETE' method 
* @param string $url URL of the service.. 
* @param array $params request parameters, hash of (key,value) pairs
*/
function delete($url, $params) 
{ 	
	$loggerDel = Zend_Registry::get('loggerDel');
	$loggerDel->log('URL:'.$url,Zend_Log::INFO);
	$loggerDel->log('Data:'.$params,Zend_Log::INFO); 
	 
	$params_str = "?"; 
	if (is_array($params)) 
	{
		foreach ($params as $key => $value) 
		{ 
			$params_str .= urlencode($key) . "=" .urlencode($value) . "&"; 
		} 
	}
	
 	else 
 	{ 
 		$params_str .= $params;
	} 
	
	$url .= $params_str; 
	$loggerDel->log('URL:'.$url,Zend_Log::INFO);
	
	$result = "";
	$curl = curl_init(); 
	curl_setopt($curl, CURLOPT_URL, $url); 
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER , TRUE); 
	//curl_setopt($curl, CURLOPT_USERAGENT, RESTClient ::USER_AGENT);
	$result = curl_exec($curl);
	curl_close($curl);
	
	$loggerDel->log('RESULT'.$result,Zend_Log::INFO);
	
	return $result;
}

?>