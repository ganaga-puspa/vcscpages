<?php 
	
class User{
    private $json_file;

    private $stored_data;

    private $number_of_records;

    private $ids = [];

    private $mobiles = [];
    
    public function __construct($file_path){
        $this->json_file = $file_path;

        $this->stored_data = json_decode(file_get_contents($this->json_file), true);

        $this->number_of_records = count($this->stored_data);

        if($this->number_of_records != 0){
            foreach($this->stored_data as $user){
                array_push($this->ids, $user['id']);
                array_push($this->mobiles, $user['mobile']);

            }
        }

    }

    private function setUserId($user){
        if($this->number_of_records == 0){
            $user['id'] = 1;
        }else{
            $user['id'] = max($this->ids) + 1;
        }
        return $user;
    }

    private function storeData(){
        file_put_contents(
            $this->json_file,
            json_encode($this->stored_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            LOCK_EX
        );
    }

    public function insertNewUser($new_user){
        $user_with_id_field = $this->setUserId($new_user);
        array_push($this->stored_data,$user_with_id_field);
        if($this->number_of_records == ''){
            $this->storeData();
        }else{
            if(!in_array($new_user['mobile'],$this->mobiles)){
                $this->storeData();
            }
        }
    }

    public function updateUser($user_id){}

    public function deleteUser($user_id){}

    public function getUsers($user_id){}

}