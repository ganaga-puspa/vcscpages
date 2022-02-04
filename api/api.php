<?php 
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");

	require("user.class.php");
	$data = json_decode(file_get_contents("php://input"));

	$new_user = array(
			"name" => $data->name,
			"about" => $data->about,
			"facebook" => $data->facebook,
			"youtube" => $data->youtube,
			"mobile" => $data->mobile,
			"address"=> $data->address,
			"email"=> $data->email,
			"imgs"=>$data->imgs
		);

    $user = new User('users.json');
    $user->insertNewUser($new_user);
