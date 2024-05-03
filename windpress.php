<?php
/**
 * Plugin Name:       WindPress
 * Description:       Tailwind CSS integration in WordPress block editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            CotesWebStudio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       windpress
 *
 * @package           create-block
 */

 namespace WindPress;
 use WindPress\Classes\Tailwindcss_Exec;
 use WindPress\Classes\Tailwindcss_Config;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once 'vendor/autoload.php';
require_once 'includes/class-tailwindcss-exec.php';
require_once 'includes/class-tailwindcss-config.php';
/**
 * Currently plugin version.
 * Start at version 0.1.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '0.1.0' );

/**
 * Plugins constants path and url root directory
 */
define('WINDPRESS_DIR_URL', plugin_dir_url( __FILE__ ));
define('WINDPRESS_DIR_PATH', plugin_dir_path( __FILE__ ));



/**
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function enqueue_windpress_editor_scripts() {
	$asset_file = include WINDPRESS_DIR_PATH . 'build/index.asset.php';
	wp_register_script('windpress-editor', WINDPRESS_DIR_URL . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true);

	wp_enqueue_script('windpress-editor');

	$windpress_ajax = array( 
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce('windpress_ajax')
	);

	wp_add_inline_script( 'windpress-editor', 'const windpressAJAX = ' . json_encode($windpress_ajax), 'before');

}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_windpress_editor_scripts', 20 );

/**
 * Enqueue Styles toolbar and sidebar control in block editor
 */
function enqueue_windpress_editor_styles() {
	wp_enqueue_style('windpress', WINDPRESS_DIR_URL . 'build/index.css');
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_windpress_editor_styles');

/**
 * Enqueue tailwind CDN only in editor
 */
function enqueue_tailwindcss_cdn() {
	if (! is_admin()) {
		return;
	}

	$tailwindcss_config = new Tailwindcss_Config(WINDPRESS_DIR_PATH . 'build/tailwind.config.js');

	$tailwindcss_CDN = $tailwindcss_config->get_link_tailwindcss_cdn();
	
	wp_register_script( 'tailwindcss_cdn', $tailwindcss_CDN, array(), null, false );

	wp_enqueue_script( 'tailwindcss_cdn' );

	/**
	 *  Add config Tailwind CDN dynamically
	 */ 

	$script = 'tailwind.config = ' . $tailwindcss_config->get_config_cdn() . ';';

	wp_add_inline_script( 'tailwindcss_cdn', $script );

}

\add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwindcss_cdn');

/**
 * Generate Tailwind Stylesheet
 */
function generate_tailwindcss( $html, $type, $id ) {
	$file_tailwindcss_executable = WINDPRESS_DIR_PATH . 'bin/tailwindcss-linux-x64';

$tailwindcss_cli = new Tailwindcss_Exec($file_tailwindcss_executable);

$input_css = WINDPRESS_DIR_PATH . 'src/main.tailwind.css';
$output_css = WINDPRESS_DIR_PATH . "src/styles-generated/$type-$id.css";
$config = WINDPRESS_DIR_PATH . 'src/tailwind.config.js';

$tailwindcss_cli->generate_tailwindcss($input_css, $config, $html, $output_css);
 
}

 /**
	* Function manejadora de la peticion ajax
  */
function process_windpress_ajax_post_content() {
	!check_ajax_referer( 'windpress_ajax', 'nonce' ) && exit;  // Check the nonce.
	// ejecutar tailwind_execute con la data que corresponde al contenido de la pagina

	$id = $_POST['id'];;
	$type = $_POST['type'];;
	$html = stripslashes($_POST['content']);

	generate_tailwindcss($html, $type, $id);

	wp_send_json( $_POST['test'] );
	// wp_send_json( $id );

	wp_die(); 
}

\add_action('wp_ajax_process_windpress_ajax_post_content', __NAMESPACE__ . '\process_windpress_ajax_post_content');
\add_action('wp_ajax_nopriv_process_windpress_ajax_post_content', __NAMESPACE__ . '\process_windpress_ajax_post_content');

/**
 * Enqueue Tailwind styles generated 
 */
function enqueue_tailwindcss_style() {
	if ( !is_singular( )) {
		return;
	} 
	$id = get_the_ID();
	$type = get_post_type( $id );
	$tailwindcss_stylesheet = WINDPRESS_DIR_PATH . "src/styles-generated/$type-$id.css";

	if (!file_exists( $tailwindcss_stylesheet)) {
		return;
	}

	wp_enqueue_style("tailwindcss-$type-$id", WINDPRESS_DIR_URL . "src/styles-generated/$type-$id.css", array(), filemtime($tailwindcss_stylesheet), 'all');

}

\add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_tailwindcss_style');

// add_action( 'save_post', function() {
// 	sleep( 5 );
// } );

// require_once WINDPRESS_DIR_PATH . 'admin/menu_config.php';