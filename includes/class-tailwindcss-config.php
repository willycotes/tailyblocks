<?php
/**
 * Class Tailwindcss configuration
 */

namespace WindPress\Classes;

class Tailwindcss_Config {
	public $file_path_config = '';
	private $file_content_config = '';
	
	public function __construct($path) {
		if ( empty($path) || !file_exists($path)) {
			throw new \Error('Error: Indique una ruta valida al archivo de configuración de TailwindCSS');
		}
			$this->file_path_config = $path;
			$this->file_content_config = file_get_contents($path);
			
	}
	public function get_file_content_config() {
		return $this->file_content_config;
	}
	public function get_config() {
		preg_match('/module\.exports\s*=\s*({\s*[\s\S]*?\s*});/', $this->file_content_config, $matches);
		return $matches[1];
	}
	private function has_plugins_config() {
		return preg_match('/plugins\s*:\s*\[([\s\S]*?)\]/', $this->get_config(), $matches);
	}
	private function delete_plugins_config() {
		if ( !$this->has_plugins_config() ) {
			return $this->get_config();
		}
		return preg_replace('/plugins\s*:\s*\[([\s\S]*?)\],/', '', $this->get_config());
	}
	public function get_config_cdn() {
		return $this->delete_plugins_config();
	}
	public function get_link_tailwindcss_cdn() {
		$cdn = 'https://cdn.tailwindcss.com';
		return $cdn;
	}
}