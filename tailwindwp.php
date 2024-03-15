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
 * Enqueue script 
 */
function cws_enqueue_editor_scripts_toobar_and_sidebar() {
	$asset_file = include plugin_dir_path( __FILE__ ) . '/build/index.asset.php';
	wp_enqueue_script('tailwindwp', plugin_dir_url( __FILE__ ) . '/build/index.js', $asset_file['dependencies'], $asset_file['version'], true)
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\cws_enqueue_editor_scripts_toobar_and_sidebar' );