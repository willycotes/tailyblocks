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
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function cws_enqueue_editor_scripts_toolbar_and_sidebar() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
	\wp_enqueue_script('tailwindwp', plugin_dir_url( __FILE__ ) . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true);
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\cws_enqueue_editor_scripts_toolbar_and_sidebar', 20 );

/**
 * Enqueue JavaScript toolbar and sidebar control in block editor
 */
function cws_enqueue_editor_styles_toolbar_and_sidebar() {
	\wp_enqueue_style('tailwindwp', plugin_dir_url( __FILE__ ) . 'build/index.css');
}

\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\cws_enqueue_editor_styles_toolbar_and_sidebar', 20 );

/**
 * Enqueue tailwind CDN in editor and frontend
 */

 function enqueue_tailwind_cdn() {
	$tailwindCDN = 'https://cdn.tailwindcss.com';
	\wp_register_script( 'tailwind_cdn', $tailwindCDN, array(), true, false );

	\wp_enqueue_script( 'tailwind_cdn' );
 }

 \add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_tailwind_cdn', 1 );


/**
 * Enqueue Tailwind configuration in editor
 */

 function cws_tailwind_config() {
	\wp_register_script('tailwind_config', plugin_dir_url( __FILE__ ) . 'build/tailwind.config.js', array('tailwind_cdn'), 10);

	\wp_enqueue_script( 'tailwind_config' );
 }
 \add_action('enqueue_block_assets', __NAMESPACE__ . '\cws_tailwind_config');
