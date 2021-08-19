<?php



class AgileStoreLocator_Helper {


	public static function fix_backward_compatible()
	{
		
		global $wpdb;

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		
		$prefix 	 = $wpdb->prefix."asl_";
		$store_table = $prefix."stores";
		$database    = $wpdb->dbname;


		//Add Open Hours Column		
		$sql 	= "SELECT count(*) as c FROM information_schema.COLUMNS WHERE TABLE_NAME = '{$store_table}' AND COLUMN_NAME = 'open_hours';";// AND TABLE_SCHEMA = '{$database}'
		$result = $wpdb->get_results($sql);
		

		if($result[0]->c == 0) {

			$wpdb->query("ALTER TABLE {$store_table} ADD open_hours text;");
		}
		else {
			return;
		}

		//Convert All Timings
		$stores = $wpdb->get_results("SELECT s.`id` , s.`start_time`, s.`end_time` FROM {$store_table} s");
		
		foreach($stores as $timing) {

			$time_object = new \stdClass();
			$time_object->mon = array();
			$time_object->tue = array();
			$time_object->wed = array();
			$time_object->thu = array();
			$time_object->fri = array();
			$time_object->sat = array();
			$time_object->sun = array();
			

			if(trim($timing->start_time) && trim($timing->end_time)) {

				$time_object->mon[] = $time_object->sun[] = $time_object->tue[] = $time_object->wed[] = $time_object->thu[] =$time_object->fri[] = $time_object->sat[] = trim($timing->start_time) .' - '. trim($timing->end_time);
			}
			else {

				$time_object->mon = $time_object->tue = $time_object->wed = $time_object->thu = $time_object->fri = $time_object->sat = $time_object->sun = '1';
			}
			
			$time_object = json_encode($time_object);

			//Update new timings
			$wpdb->update($prefix."stores",
				array('open_hours'	=> $time_object),
				array('id' => $timing->id)
			);
		}
	}
}

?>
