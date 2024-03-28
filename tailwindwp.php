<?php
/**
 * Plugin Name:       TailwindWP
 * Description:       Tailwind integration in WordPress block editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            CotesWebStudio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tailwindwp
 *
 * @package           create-block
 */

 namespace tailwindwp;
 use classes\Tailwind_CSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once 'vendor/autoload.php';
require_once 'includes/class-tailwindcss.php';
/**
 * Currently plugin version.
 * Start at version 0.1.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '0.1.0' );

/**
 * Plugins constants path and url root directory
 */
define('TAILWINDWP_URL', plugin_dir_url( __FILE__ ));
define('TAILWINDWP_PATH', plugin_dir_path( __FILE__ ));



/**
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function enqueue_editor_scripts_toolbar_and_sidebar() {
	$asset_file = include TAILWINDWP_PATH . 'build/index.asset.php';
	wp_register_script('tailwindwp', TAILWINDWP_URL . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true);

	wp_enqueue_script('tailwindwp');

	$tailwindwp_ajax = array( 
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce('tailwindwp_ajax')
	);

	wp_add_inline_script( 'tailwindwp', 'const tailwindwpAJAX = ' . json_encode($tailwindwp_ajax), 'before');

}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_scripts_toolbar_and_sidebar', 20 );

/**
 * Enqueue Styles toolbar and sidebar control in block editor
 */
function enqueue_editor_styles_toolbar_and_sidebar() {
	wp_enqueue_style('tailwindwp', TAILWINDWP_URL . 'build/index.css');
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_styles_toolbar_and_sidebar', 20 );

/**
 * Enqueue tailwind CDN only in editor
 */
function enqueue_tailwind_cdn() {
	if (! is_admin()) {
		return;
	}

	$tailwind_CDN = 'https://cdn.tailwindcss.com';
	
	wp_register_script( 'tailwind_cdn', $tailwind_CDN, array(), null, false );

	wp_enqueue_script( 'tailwind_cdn' );

	/**
	 *  Add config Tailwind CDN dynamically
	 */ 
	
	/* lógica para obtener en un objeto PHP el objeto de configuración del contenido del 
	 * archivo tailwind.config.js, de tal forma que se le pueda modificar valores de sus propiedades 
	 * y luego formatearlo para añadirlo a la variable window.config de javascript del navegador
	 * Modificar las propiedades para la compatibilidad con la CDN (ciertas propiedades se agregan a traves de variables de url en la url de la CDN)
	 */
	$object_tailwind_config = json_encode(['test' => 'valor test']);

	wp_add_inline_script( 'tailwind_cdn', 
	"
	const config = JSON.parse('$object_tailwind_config'); 
	const windowConfig = config;
	"
);

}

\add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_cdn', 10 );


/**
 * Enqueue Tailwind configuration in editor
 */
function enqueue_tailwind_cdn_config() {
	if (! is_admin(  )) {
		return;
	}

	wp_register_script('tailwind_cdn_config', TAILWINDWP_URL . 'build/tailwind-cdn.config.js', array('tailwind_cdn'), true, false);

	wp_enqueue_script( 'tailwind_cdn_config' );
}

\add_action('enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_cdn_config');

/**
 * Generate Tailwind Stylesheet
 */
function generate_tailwind_css( $html, $type, $id ) {
	$tailwindExecutable = TAILWINDWP_PATH . 'bin/tailwindcss-linux-x64';

$tailwind_css = new Tailwind_CSS($tailwindExecutable);

$input_css = TAILWINDWP_PATH . 'src/tailwind-styles.config.scss';
$output_css = TAILWINDWP_PATH . "src/tailwind-styles/$type-$id.css";
$config = TAILWINDWP_PATH . './src/tailwind.config.js';

$tailwind_css->generate_tailwind_css($input_css, $config, $html, $output_css);
 
}

 /**
	* Function manejadora de la peticion ajax
  */
function process_tailwindwp_ajax_post_content() {
	!check_ajax_referer( 'tailwindwp_ajax', 'nonce' ) && exit;  // Check the nonce.
	// ejecutar tailwind_execute con la data que corresponde al contenido de la pagina

	$id = $_POST['id'];;
	$type = $_POST['type'];;
	$html = stripslashes($_POST['content']);

	generate_tailwind_css($html, $type, $id);

	wp_send_json( $_POST['test'] );
	// wp_send_json( $id );

	wp_die(); 
}

\add_action('wp_ajax_process_tailwindwp_ajax_post_content', __NAMESPACE__ . '\process_tailwindwp_ajax_post_content');
\add_action('wp_ajax_nopriv_process_tailwindwp_ajax_post_content', __NAMESPACE__ . '\process_tailwindwp_ajax_post_content');

/**
 * Enqueue Tailwind styles generated 
 */
function enqueue_tailwind_style() {
	if ( !is_singular( )) {
		return;
	} 
	$id = get_the_ID();
	$type = get_post_type( $id );
	$tailwind_style_file = TAILWINDWP_PATH . "src/tailwind-styles/$type-$id.css";

	if (!file_exists( $tailwind_style_file)) {
		return;
	}

	wp_enqueue_style("tailwind-style-$type-$id", TAILWINDWP_URL . "src/tailwind-styles/$type-$id.css", array(), filemtime($tailwind_style_file), 'all');

}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_tailwind_style');
