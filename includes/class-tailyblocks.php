<?php
/**
 * Class Tailwind use Tailwind executable CLI
 */
namespace Classes;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

// Evitar el acceso directo al archivo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * class Tailwind CLI
 */
class TailyBlocks {
	/**
	 * The unique identifier of this plugin.
	 *
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;


  // Propiedad estática para mantener la única instancia
  private static $_instance = null;

	private $tailyblocks_upload_dir = '';
	
	/**
	 * $tailwindExecutable Tailwind executable Path
	 * $post Post Object
	 */
  public function __construct() {
		$this->version = TAILYBLOCKS_VERSION;
		$this->plugin_name = TAILYBLOCKS_PLUGIN_NAME;
		
  }

	/**
   * Evita la clonación de la instancia Singleton.
   */
  private function __clone() {
    //
  }

	/**
   * Evita la deserialización de la instancia Singleton.
   */
  public function __wakeup() {
    //
  }

  /**
   * Método estático para obtener la única instancia de la clase.
   *
   * @return TailyBlocks La única instancia de la clase.
   */
  public static function get_instance() {
    if ( \is_null( self::$_instance ) ) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }
	
	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}
	/**
	 * Crea el directorio de carga del plugin.
	 *
	 * @return bool | \WP_Error
	 */
	public function ensure_upload_directories() {
		// Asegurarse de que wp_upload_dir esté disponible.
    // A veces es necesario cargar file.php manualmente en ciertos contextos.
    if ( ! \function_exists( 'wp_upload_dir' ) ) {
        require_once( ABSPATH . 'wp-admin/includes/file.php' );
    }

		// Obtener información del directorio de uploads
		$upload_dir_info = \wp_upload_dir();

		// Comprobar si hay errores en la configuración del directorio de subidas de WordPress
    if ( $upload_dir_info['error'] !== false ) {
      \error_log( 'TailyBlocks Plugin Error: Error configurando directorio de subidas de WordPress: ' . $upload_dir_info['error'] );
      // Podrías añadir un notice de administración aquí si estás en el área de administración
      return new \WP_Error( 'tailyblocks_upload_dir_error', 'Error configurando directorio de subidas de WordPress.' );
    }

		// La ruta absoluta del directorio de uploads en el servidor
		$uploads_base_dir = $upload_dir_info['basedir'];

		// Construir la ruta completa al directorio temporal dentro del directorio del plugin
		$filename = $this->get_plugin_name();
		$tailyblocks_temp_dir = \trailingslashit( $uploads_base_dir ) . $filename . '/tmp/';

		// Crear el directorio de carga de TailyBlocks y el directorio temporal de manera recursiva sólo si no existen.
		if ( ! \wp_mkdir_p( $tailyblocks_temp_dir ) ) {
				\error_log( 'Error: No se pudo crear los directorios necesarios para TailyBlocks en el directorio de uploads de WordPress referenciando a: ' . $tailyblocks_temp_dir );
				// Dependiendo de tu lógica, podrías lanzar una excepción o notificar al usuario.
				return new \WP_Error( 'tailyblocks_temp_dir_error', 'No se pudo crear los directorios necesario para TailyBlocks en el directorio de uploads de WordPress.' );
		}

		return true; // Indicar éxito
	}
	/**
	 * Obtener el directorio de carga del plugin.
	 *
	 * @return string
	 */
	public function get_tailyblocks_upload_dir() {
		// Asegurarse de que wp_upload_dir esté disponible.
    // A veces es necesario cargar file.php manualmente en ciertos contextos (como la activación).
    if ( ! \function_exists( 'wp_get_upload_dir' ) ) {
        require_once( ABSPATH . 'wp-admin/includes/file.php' );
    }

		// Obtener información del directorio de uploads
		$upload_dir_info = \wp_get_upload_dir();

		

		// La ruta absoluta del directorio de uploads en el servidor
		$uploads_base_dir = $upload_dir_info['basedir'];

		// Crear un subdirectorio dentro de uploads
		// para los archivos de tu plugin (ej: tailyblocks/)
		$filename = $this->get_plugin_name();
		$tailyblocks_upload_dir = \trailingslashit( $uploads_base_dir ) . $filename . '/';
		
		return $tailyblocks_upload_dir;
	}

	/**
   * Método para mostrar un aviso al administrador si falló la creación del directorio.
   */
  public function directory_creation_admin_notice() {
  	// Solo mostrar el aviso si el usuario actual tiene permisos suficientes
    if ( \current_user_can( 'manage_options' ) ) {
      $uploads_path = $this->get_tailyblocks_upload_dir();
      ?>
      <div class="notice notice-error is-dismissible">
        <p><?php \printf(
          \__( '<strong>TailyBlocks Error:</strong> No se pudo crear el directorio necesario en <code>%s</code>. Por favor, verifica los permisos de escritura de WordPress para el directorio uploads.', 'tailyblocks' ), \esc_html( $uploads_path )
          ); ?></p>
      </div>
      <?php
      }
    }

	/**
	 * @param string $input_css Input css Tailwind
	 * @param string $config Configuration file
	 * @param string $html HTML Tailwind to compiled
	 * @param string $output_css Output stylesheet generated
	 */
  public function generate_tailwindcss($input_css, $config, $html, $output_css ) {
		// Asegurar que los directorios de carga existan
		$dirs_created = $this->ensure_upload_directories();
		if ( \is_wp_error( $dirs_created ) ) {
				return $dirs_created; // Devolver el error si no se pudieron crear los directorios
		}

		// Ruta al ejecutable de Tailwind CLI
		$tailwindExecutable = TAILYBLOCKS_DIR_PATH . 'bin/tailwindcss-linux-x64';

		// Directorio temporal para guardar el HTML
		$tailyblocks_upload_dir = $this->get_tailyblocks_upload_dir();
		$temp_dir = \trailingslashit($tailyblocks_upload_dir) . 'tmp/';


		// Nombre de archivo único para el HTML temporal
		$temp_html = $temp_dir . \uniqid() . '.html';

		// Registro: Mostrar la ruta del archivo temporal
		\error_log( 'TailyBlocks Debug: Intentando escribir archivo temporal en: ' . $temp_html );

		// Guarda el HTML como archivo temporal
		$write_result = \file_put_contents($temp_html, $html);

		// Registro: Mostrar el resultado de file_put_contents
		if ( $write_result === false ) {
				\error_log( 'Error: No se pudo escribir el archivo temporal de TailyBlocks: ' . $temp_html );
				return new \WP_Error( 'tailyblocks_temp_file_error', 'No se pudo escribir el archivo temporal necesario para TailyBlocks.' );
		} else {
				\error_log( 'TailyBlocks Debug: Archivo temporal: ' . $temp_html . ' se ha escrito con exito.' );
		}


		// Ejecuta el comando Tailwind CLI
		$process = new Process([$tailwindExecutable, '-i', $input_css, '-c', $config, '--content', $temp_html,'-o', $output_css]);
		$process->run();

		// executes after the command finishes
		if (!$process->isSuccessful()) {
			// Elimina el archivo temporal incluso si el proceso falla
			if ( \file_exists( $temp_html ) ) {
				// \unlink($temp_html);
			}
			throw new ProcessFailedException($process);
		}

		// Elimina los archivos temporales
		// if ( \file_exists( $temp_html ) ) {
		// 	\unlink($temp_html);
		// }


  }

}
