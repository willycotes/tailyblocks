<?php
/**
 * Plugin Name:       TailyBlocks
 * Description:       Tailwindcss integration in WordPress block editor.
 * Version:           0.1.0
 * Author:            Willy Cotes
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tailyblocks
 *
 */

namespace TailyBlocks;
use Classes\TailyBlocks;
use Classes\TailyBlocks_Activator;
use Classes\TailyBlocks_Deactivator;
use Classes\TailwindCSS_Config;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

/**
 * Currently plugin version.
 * Start at version 0.1.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'TAILYBLOCKS_VERSION', '0.1.0' );

/**
 * Plugin name	
 */
define( 'TAILYBLOCKS_PLUGIN_NAME', 'tailyblocks' );



/**
 * Archivo principal del plugin
 */
define( 'TAILYBLOCKS_PLUGIN_FILE', __FILE__ );

/**
 * Plugins constants path and url root directory
 */
define('TAILYBLOCKS_DIR_URL', \plugin_dir_url( __FILE__ ));
define('TAILYBLOCKS_DIR_PATH', \plugin_dir_path( __FILE__ ));

/**
 * Incluir librerias y clases necesarias
 */
require_once 'vendor/autoload.php';
require_once 'includes/class-tailyblocks.php';
require_once 'includes/class-tailyblocks-activator.php';
require_once 'includes/class-tailyblocks-deactivator.php';
// require_once 'includes/class-tailwindcss-config.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-tailyblocks-activator.php
 */
function activate_tailyblocks() {
	TailyBlocks_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_tailyblocks() {
	TailyBlocks_Deactivator::deactivate();
}

\register_activation_hook( TAILYBLOCKS_PLUGIN_FILE, __NAMESPACE__ . '\activate_tailyblocks' );
\register_deactivation_hook( TAILYBLOCKS_PLUGIN_FILE, __NAMESPACE__ . '\deactivate_tailyblocks' );



/**
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function enqueue_tailyblocks_editor_scripts() {

	$asset_file = include TAILYBLOCKS_DIR_PATH . 'build/index.asset.php';

	\wp_register_script('tailyblocks-editor', TAILYBLOCKS_DIR_URL . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true);

	\wp_enqueue_script('tailyblocks-editor');

	$tailyblocks_ajax = array( 
		'ajax_url' => \admin_url( 'admin-ajax.php' ),
		'nonce' => \wp_create_nonce('tailyblocks_ajax')
	);

	\wp_add_inline_script( 'tailyblocks-editor', 'const tailyblocksAJAX = ' . json_encode($tailyblocks_ajax), 'before');

}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_tailyblocks_editor_scripts', 20 );

/**
 * Enqueue Styles toolbar and sidebar control in block editor
 */
function enqueue_tailyblocks_editor_styles() {
	\wp_enqueue_style('tailyblocks', TAILYBLOCKS_DIR_URL . 'build/index.css');
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_tailyblocks_editor_styles');

/**
 * Enqueue tailwind CDN only in editor
 */
function enqueue_tailwindcss_cdn() {
	if (! \is_admin()) {
		return;
	}

	$tailwindcss_CDN = 'https://cdn.tailwindcss.com';
	
	\wp_register_script( 'tailwindcss_cdn', $tailwindcss_CDN, array(), null, false );

	\wp_enqueue_script( 'tailwindcss_cdn' );

	$tailwindConfig = 'tailwind.config = {
	// content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [],
	important: true,
};';

	\wp_add_inline_script( 'tailwindcss_cdn', $tailwindConfig );




}

\add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwindcss_cdn');


/**
 * Generate Tailwind Stylesheet
 */
function generate_tailwindcss( $html, $type, $id ) {
	$tailyblocks = TailyBlocks::get_instance();
	
	$tailyblocks_upload_dir = $tailyblocks->get_tailyblocks_upload_dir();
	$input_css = TAILYBLOCKS_DIR_PATH . 'build/tailwind-input.css';
	$output_css_filename = $type . '-' . $id . '.css';
	$output_css_path = \trailingslashit($tailyblocks_upload_dir) . $output_css_filename;
	$config = TAILYBLOCKS_DIR_PATH . 'build/tailwind.config.js';

	$tailyblocks->generate_tailwindcss($input_css, $config, $html, $output_css_path);
 
}

 /**
	* Function manejadora de la peticion ajax
  */
function process_tailyblocks_ajax_post_content() {
	!\check_ajax_referer( 'tailyblocks_ajax', 'nonce' ) && exit;  // Check the nonce.
	// ejecutar tailwind_execute con la data que corresponde al contenido de la pagina

	$id = $_POST['id'];
	$type = $_POST['type'];
	$html = stripslashes($_POST['content']);

	generate_tailwindcss($html, $type, $id);

	// Devolver una respuesta JSON simple
	\wp_send_json_success( array( 'message' => 'Estilos generados correctamente.' ) );
}

\add_action('wp_ajax_process_tailyblocks_ajax_post_content', __NAMESPACE__ . '\process_tailyblocks_ajax_post_content');
\add_action('wp_ajax_nopriv_process_tailyblocks_ajax_post_content', __NAMESPACE__ . '\process_tailyblocks_ajax_post_content');

/**
 * Enqueue Tailwind styles generated 
 */
function enqueue_tailwindcss_style() {
	if ( ! \is_singular( )) {
		return;
	} 
	$id = \get_the_ID();
	$type = \get_post_type( $id );
	$tailwind_style_file_name = $type . '-' . $id . '.css';

	$tailyblocks = TailyBlocks::get_instance();

	$tailwind_style_file =  \trailingslashit($tailyblocks->get_tailyblocks_upload_dir()) . $tailwind_style_file_name;

	if (!file_exists( $tailwind_style_file)) {
		return;
	}

	$tailwind_style_url = \trailingslashit(wp_get_upload_dir()['baseurl']) . $tailyblocks->get_plugin_name() . '/' . $tailwind_style_file_name;


	\wp_enqueue_style("tailwindcss-$type-$id", $tailwind_style_url, array(), \filemtime($tailwind_style_file), 'all');

}

\add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_tailwindcss_style');

/**
 * Start the main class of the plugin.
 * This obtains the only instance of the Singleton class
 * And records regular plugin hooks (not those of activation/deactivation).
 * It should be done after defining classes and registering activation/deactivation hooks.
 */
function run_tailyblocks() {
    // llama a la instancia de la clase TailyBlocks
    TailyBlocks::get_instance();
}

// Ejecuta la función para iniciar el plugin
run_tailyblocks();
