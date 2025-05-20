<?php
/**
 * Class TailwindCSS configuration
 */

namespace classes;

class TailwindCSS_Config {
	private $tailwindcss_config_file_path = '';
	private $tailwindcss_config_data = [];


	public function __construct( $tailwindcss_config_file_path)
	{
		if ( empty($tailwindcss_config_file_path) || !file_exists($tailwindcss_config_file_path)) {
			return;
		}
			$this->tailwindcss_config_file_path = $tailwindcss_config_file_path;
		
		$this->tailwindcss_config_data = json_encode(file_get_contents($this->tailwindcss_config_file_path));
		return $this->tailwindcss_config_data;
	}

}
