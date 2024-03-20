<?php

class Tailwind_controller {
  private $tailwindExecutable;
	private $id;
	private $name;
	private $css_cache;
	
	/**
	 * $tailwindExecutable Tailwind executable Path
	 * $post Post Object
	 */
  public function __construct($tailwindExecutable, $id) {
    $this->tailwindExecutable = $tailwindExecutable;
		$this->id = $id;
  }
		
	
  public function generateTailwindCSS($content) {
		
	// Captura el directorio temporal del sistema para guardar el HTML
  $temp_dir = sys_get_temp_dir();
  // Genera un nombre de archivo único para el HTML temporal
  $temp_file = uniqid() . '.html';
	// Temporal path
	$temp_path = $temp_dir . '/' . $temp_file;
	echo $temp_path;

  // Guarda el HTML en un archivo temporal
  file_put_contents($temp_path, $content);

	// Directorio del CSS de salida (cambiar la ruta por una constante definida en el archivo principal)
	// formatear los slash
	// $css_output_dir = TAILWINDWP_PATH . 'src/styles/';

	// support wp-now
	$css_output_dir = 'var/www/practices/wordpress-practices/gutenberg-blocks/addclassblock/src/styles/';
  // Genera un nombre de archivo para el CSS de Tailwind
  $css_output_file = $this->id . '.css';
	// Output path css generated
	$css_output_path = $css_output_dir . '/' . $css_output_file;

  // Ejecuta el comando Tailwind CLI
	// ./bin/tailwindcss-linux-x64 -i src/style.scss -o src/styles/output.css
  // $command = '"' . $this->tailwindExecutable . '" -i ' . $temp_dir . '/' . $temp_file . ' -o ' . $css_dir . $css_file;
	// $command = $this->tailwindExecutable . ' -i '  . $temp_path . ' -o ' . $css_output_path;
	$command = $this->tailwindExecutable . ' --help';
// echo $command;
	// exec($command);
  exec($command, $output, $returnCode);
// return;


  // Verifica si el comando se ejecutó correctamente
  if ($returnCode !== 0) {
    throw new Exception("Error al ejecutar Tailwind CLI: " . implode("\n", $output));
  }
 // Elimina los archivos temporales
 unlink($temp_path);

	// elimina el archivo de css anterior
	// validar por la fecha de creacion del archivo tambien
	if (file_exists($this->css_cache)) {
		unlink($this->css_cache);
	}
				
	// guarda la ubicación del css generado
	$this->css_cache = $css_output_path;

  // Lee el contenido del archivo CSS generado
  $css_content = file_get_contents($this->css_cache);	

  // Devuelve el contenido CSS generado
    return $css_content;
  }

  // public function enqueue_tailwind_css() {
  //   // Crear la logica para que encole el css generado
	// 	wp_enqueue_style( $this->name . $this->id, $this->css_cache, array(), uniqid(), 'all' );
  // }
}

