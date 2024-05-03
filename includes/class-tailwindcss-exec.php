<?php
/**
 * Class Tailwind use Tailwind executable CLI
 */
namespace WindPress\Classes;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

/**
 * class Tailwind CLI
 */
class Tailwindcss_Exec {
  private $tailwindcss_executable;
	
	/**
	 * $tailwindcss_executable Tailwind executable Path
	 * $post Post Object
	 */
  public function __construct($tailwindcss_executable) {
    $this->tailwindcss_executable = $tailwindcss_executable;
		
  }
		
	/**
	 * @param string $input_css Input css Tailwind
	 * @param string $config Configuration file
	 * @param string $html HTML Tailwind to compiled
	 * @param string $output_css Output stylesheet generated
	 */
  public function generate_tailwindcss($input_css, $config, $html, $output_css ) {
	
	// Directorio temporal para guardar el HTML
  $temp_dir = WINDPRESS_DIR_PATH . 'tmp/';
  // Nombre de archivo único para el HTML temporal
  $temp_html = $temp_dir . uniqid() . '.html';

  // Guarda el HTML como archivo temporal
  file_put_contents($temp_html, $html);

  // Ejecuta el comando Tailwind CLI
	$process = new Process([$this->tailwindcss_executable, '-i', $input_css, '-c', $config, '--content', $temp_html,'-o', $output_css]);
	$process->run();

	// executes after the command finishes
	if (!$process->isSuccessful()) {
    throw new ProcessFailedException($process);
	}

 	// Elimina los archivos temporales
	unlink($temp_html);

  }

}

