<?php

function windpress_options_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			// output security fields for the registered setting "windpress_options"
			settings_fields( 'windpress_options' );
			// output setting sections and their fields
			// (sections are registered for "windpress", each field is registered to a specific section)
			do_settings_sections( 'windpress' );
			// output save settings button
			submit_button( __( 'Save Settings', 'textdomain' ) );
			?>
		</form>
	</div>
	<?php
}

function windpress_options_page() {
	add_options_page(
		'WindPress Options',
		'WindPress Options',
		'manage_options',
		'windpress',
		'windpress_options_page_html'
	);
}
add_action('admin_menu', 'windpress_options_page');