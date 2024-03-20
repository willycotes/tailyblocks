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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

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
// define('TAILWINDWP_PATH', plugin_dir_path( __FILE__ ));
define('TAILWINDWP_PATH', plugin_basename( __FILE__ ));
echo WP_CONTENT_DIR;

echo "<p>" . TAILWINDWP_URL . "</p>";
echo "<p>" . TAILWINDWP_PATH . "</p>";

/**
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function enqueue_editor_scripts_toolbar_and_sidebar() {
	$asset_file = include TAILWINDWP_PATH . 'build/index.asset.php';
	\wp_enqueue_script('tailwindwp', TAILWINDWP_URL . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true);
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_scripts_toolbar_and_sidebar', 20 );

/**
 * Enqueue Styles toolbar and sidebar control in block editor
 */
function enqueue_editor_styles_toolbar_and_sidebar() {
	\wp_enqueue_style('tailwindwp', TAILWINDWP_URL . 'build/index.css');
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
	
	\wp_register_script( 'tailwind_cdn', $tailwind_CDN, array(), true, false );

	\wp_enqueue_script( 'tailwind_cdn' );
}

\add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_cdn', 10 );


/**
 * Enqueue Tailwind configuration in editor
 */
function enqueue_tailwind_cdn_config() {
	if (! is_admin(  )) {
		return;
	}

	\wp_register_script('tailwind_cdn_config', TAILWINDWP_URL . 'build/tailwind-cdn.config.js', array('tailwind_cdn'), true, false);

	\wp_enqueue_script( 'tailwind_cdn_config' );
}

\add_action('enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_cdn_config');

 /**
 * Enqueue tailwind style generated in editor and frontend
 */
// function enqueue_style_tailwind_generated() {
	
// 	\wp_register_style( 'tailwind_styles_generated', TAILWINDWP_URL . 'build/style-index.css', array(), true, false );

// 	\wp_enqueue_style( 'tailwind_styles_generated' );
// }

// \add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_style_generated', 10 );


/**
 * ./bin/tailwindcss-linux-x64 -i src/style.scss -o src/styles/output.css
 */
require_once TAILWINDWP_PATH . 'includes/class-tailwind-controller.php';
// support wp-now
$tailwindExecutable = '/var/www/practices/wordpress-practices/gutenberg-blocks/addclassblock/bin/tailwindcss-linux-x64';
$id = 1;
$content = '<div class="text-lg font-bold">¡Hola, mundo!</div>';

$tailwind_controller = new \Tailwind_controller($tailwindExecutable, $id);
$tailwindCSS = $tailwind_controller->generateTailwindCSS($content);