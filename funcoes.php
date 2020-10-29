<?php

function toJson($variavel) { 
	// header('Content-type: text/html; charset=ISO-8859-1');
	$resultado = $variavel;
		 if(gettype($variavel) == 'object') $resultado = objectEmJson($variavel);
	else if(gettype($variavel) == 'array' ) $resultado = arrayEmJson($variavel);

	return $resultado;
}

function objectEmJson($objeto) { 
	$class_vars = get_class_vars(get_class($objeto));
	$arrayObjeto = array();
	// $arrayObjeto = [];
	$namesClass = array();

	$indiceVariable = -1;
	foreach ($class_vars as $name => $value) {
		if($name == 'variable') $indiceVariable = sizeof($namesClass);
		array_push($namesClass, $name);
	}

	if ($indiceVariable != -1) $namesClass = $objeto->get($namesClass[$indiceVariable]);

	for ($i=0; $i < sizeof($namesClass); $i++) { 
		array_push($arrayObjeto, $namesClass[$i], $objeto->get($namesClass[$i]));
	}

	// foreach ($class_vars as $name => $value) {
	// 	array_push($arrayObjeto, $name , $objeto->get($name));
	// }

	$verifica = true;
	$primeiro = true;
	$stringArray = "";
	$preStringArray = "";
	$oldValue = "teste";
	foreach ($arrayObjeto as $key => $value) {
		if ($verifica) {
			if($primeiro) 	$preStringArray = "{\"".$value."\":";
			else 			$preStringArray = ",\"".$value."\":";
			$verifica = false;
		} else {
			switch (gettype($value)) {
				case 'string':
					$stringArray .= $preStringArray."\"".$value."\"";
					break;
				case 'integer':
					$stringArray .= $preStringArray.$value;
					break;
				case 'double':
					$stringArray .= $preStringArray.$value;
					break; 
				case 'floute':
					$stringArray .= $preStringArray.$value;
					break;
				case 'boolean':
					$stringArray .= $value ? $preStringArray."1" : $preStringArray."0";
					break;
				case 'object':
					$stringArray .= $preStringArray.objectEmJson($value);
					break;
				case 'array':
					$stringArray .= $preStringArray.arrayEmJson($value);
					break;
				case 'NULL':
					// $stringArray .= $preStringArray.arrayEmJson($value); 
					break;
				default:
					$stringArray .= $preStringArray."\"".$value."\"";
			}
			if (gettype($value) != 'NULL') $primeiro = false;
			$verifica = true;
		}
	}
	return $stringArray."}";
}

function arrayEmJson($array) { 
	$stringArray = "[";
	$primeiro = true;

	foreach ($array as $key => $value) {
		switch (gettype($value)) {
			case 'string':
				if($primeiro) 	$stringArray .= "\"".$value."\"";
				else 			$stringArray .= ",\"".$value."\"";
				break;
			case 'interger':
				if($primeiro)	$stringArray .= $value;
				else 			$stringArray .= ",".$value;
				break;
			case 'int':
				if($primeiro)	$stringArray .= $value;
				else 			$stringArray .= ",".$value;
				break;
			case 'double':
				if($primeiro) 	$stringArray .= $value;
				else 			$stringArray .= ",".$value;
				break; 
			case 'float':
				if($primeiro)	$stringArray .= $value;
				else 			$stringArray .= ",".$value;
				break;
			case 'boolean':
				if($value)		$value = "1";
				else 			$value = "0";
				if($primeiro) 	$stringArray .= $value;
				else 			$stringArray .= ",".$value;
				break;
			case 'object':
				if($primeiro) 	$stringArray .= objectEmJson($value);
				else 			$stringArray .= ",".objectEmJson($value);
				break;
			case 'array':
				if($primeiro)	$stringArray .= arrayEmJson($value);
				else 			$stringArray .= ",".arrayEmJson($value);
				break;
			default:
				$stringArray .= "\"".$value."\"";
				break;
		}
		$primeiro = false;
	}
	return $stringArray."]";
}



class Arquivo { 
	var $nome;
	var $path;
	var $pai;

	function __construct($nome, $path, $pai) { 
		$this->nome = $nome;
		$this->path = $path;
		$this->pai = $pai;
	}
}

class PadraoObjeto {
	var $debug = 'OK';
	public function get($nome_campo){
		return $this->$nome_campo;
	}

	public function set($valor , $nome_campo){
		$this->$nome_campo = $valor;
	}

	public function check($nome_campo){
		return isset($this->$nome_campo);
	}

	public function push($valor, $nome_campo){
		if(gettype($this->$nome_campo) == "array") array_push($this->$nome_campo, $valor);
	}

	public function removeQuebra($tipo, $valor){
							$valor = 	str_replace("\"", '\'',
										str_replace("\r", '', $valor));
		if($tipo == 'html') return 		str_replace("\t", '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
										str_replace("\n", '<br>', $valor));
		else 				return 		str_replace("\t", ' ',
										str_replace("\n", '', $valor));
	}
}
class Dir extends PadraoObjeto { 
	var $name;
	// var $origin;
	var $branchs = array();
	var $isFile = false;

	function __construct($name){
	// function __construct($name, $origin = '.'){
		$this->name = $name;
		// $this->origin = $origin;
	}
}
class File extends PadraoObjeto { 
	var $name;
	var $path;
	var $dateCriation;
	var $isFile = true;
	var $ext;
	var $height;
	var $width;

	function __construct($name, $path){
		$this->name = $name;
		$this->path = $path;
	}
}


function getObjFile($file,$path) { 
	$filObj = new File($file, $path.'/'.$file);
	$filObj->set(date('Y-m-d H:i:s', filemtime($path.'/'.$file)), 'dateCriation');
	return $filObj;
}


function listDir($path) { 
	$dir = new Dir($path);
	if (is_dir($path)) {
		$diretorio = dir($path);
		while ($file = $diretorio->read()) {
			if ($file != '.' && $file != '..') {
				if (is_dir($path.'/'.$file)) { 
					$dir->push(listDir($path.'/'.$file), 'branchs');
				} else { 
					$ext = explode('.', $file);
					array_splice($ext, 0,-1);
					$ext = implode('', $ext);

					$filObj = getObjFile($file,$path);

					$extsImgs = explode(',','PNG,JPG,TIFF,JPEG,BMP,PSD,EXIF,RAW,PDF,WEBP,GIF,EPS,SVG');
					if (in_array(strtoupper($ext), $extsImgs) && $size = getimagesize($path.'/'.$file)) { 
						list($width, $height) = $size;
						$filObj->set($height, 'height');
						$filObj->set($width, 'width');
					}
					$filObj->set($ext, 'ext');
					$dir->push($filObj, 'branchs');
				}
			}
		}
	} else {
		$dir->set('Not Dir', 'name');
	}
	return $dir;
}

?>