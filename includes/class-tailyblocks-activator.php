<?php
/**
 * Fired during plugin activation
 *
 */
// require_once TAILYBLOCKS_DIR_PATH . 'includes/class-tailyblocks.php';

namespace Classes;
use Classes\TailyBlocks;


/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 */
class TailyBlocks_Activator {

	/**
	 * Activate
	 */
	public static function activate() {
		// En este punto, la clase TailyBlocks ya debería estar cargada
    // gracias al require_once en tailyblocks.php.
    // Obtenemos la instancia Singleton de la clase principal.
    // Esto también asegura que la instancia se cree si no lo estaba ya.
    $main_plugin_instance = TailyBlocks::get_instance();

    // Eliminamos la creación explícita del directorio de uploads aquí.
    // El directorio se creará de forma recursiva cuando se genere el primer archivo CSS.

    // *** Aquí puedes añadir otra lógica de activación: ***
    // - Creación de tablas de base de datos (si las necesitas)
    // - Configuración de opciones por defecto
    // - Comprobaciones de entorno
    // Ejemplo:
    // $main_plugin_instance->install_database_tables();
    // add_option( 'tailyblocks_default_setting', 'some_value' );
	}

}
