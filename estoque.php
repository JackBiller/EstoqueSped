<?php

date_default_timezone_set('America/Sao_Paulo');
set_time_limit(300);

include './funcoes.php';

if (!empty($_POST['buscaLista'])) { 
	$arquivos = array();
	$mes_referencia = $_POST['mes_referencia'];

	$pasta = './arquivo_sped/'.$mes_referencia.'/';

	if (!is_dir($pasta)) mkdir($pasta);

	// $pasta = 'http://localhost/sped_fiscal/txt';
	if (is_dir($pasta)) { 
		$diretorio = dir($pasta);
		while (($pastaEmpresa = $diretorio->read()) !== false) { 
			// if (!is_dir($pasta.$pastaEmpresa)) {
			if (
				is_dir($pasta.$pastaEmpresa) && $pastaEmpresa != '.' && $pastaEmpresa != '..'
			) { 
				// $empresa = array();
				$pastaEmpresaFull = $pasta.$pastaEmpresa.'/';
				$diretorioEmpresa = dir($pastaEmpresaFull);
				while (($pastaEmpresaData = $diretorioEmpresa->read()) !== false) {
					if (
						is_dir($pastaEmpresaFull.$pastaEmpresaData) &&
						$pastaEmpresaData != '.' && $pastaEmpresaData != '..'
					) { 
						// array_push($empresa, 
						array_push($arquivos, 
							new Arquivo($pastaEmpresaData, $pastaEmpresaFull.$pastaEmpresaData, $pastaEmpresa)
						);
					}
				}
				$diretorioEmpresa->close();
				// $pastaEmpresa
				// array_push($arquivos, $empresa);
				// array_push($arquivos, new Arquivo($arquivo, $pasta.$arquivo));
			}
		}
		$diretorio->close();

	}
	echo json_encode($arquivos);
}

if (!empty($_POST['abrirArquivo'])) { 
	if (is_file($_POST['path'])) { 
		$arquivo = fopen($_POST['path'], "r") or die("Unable to open file!");
		echo fread($arquivo, filesize($_POST['path']));
		fclose($arquivo);
	} else { 
		echo '';
	}
	// echo file_get_contents($_POST['path']);
}

if (!empty($_POST['gerarArquivo'])) { 
	$ctx = $_POST['ctx'];
	$ext = empty($_POST['ext']) ? 'csv' : $_POST['ext'];

	$num = rand(40,50);

	$arquivo = fopen("./temp/".$num.".".$ext, 'w');
	fwrite($arquivo, $ctx);
	// fwrite($arquivo, utf8_encode($ctx));
	fclose($arquivo);

	echo "./temp/".$num.".$ext";
}

if (!empty($_POST['enviarArquivoSPED'])) { 
	// $nome = $_POST['nome'];
	$base64 	= utf8_encode(base64_decode($_POST['base64']));
	$ext 		= $_POST['ext'];
	$empresa 	= $_POST['empresa'];
	$data 		= $_POST['data'];
	$mes 		= $_POST['mes'];

	$pasta = './arquivo_sped/'.$mes.'/';
	if (!is_dir($pasta)) mkdir($pasta);
	$pasta .= $empresa . '/';
	if (!is_dir($pasta)) mkdir($pasta);
	$pasta .= $data . '/';
	if (!is_dir($pasta)) mkdir($pasta);

	$arquivo = fopen($pasta."SPED.".$ext, 'w');
	fwrite($arquivo, $base64);
	fclose($arquivo);

	echo '1';
}

if (!empty($_POST['buscarListaEmpresa'])) { 
	echo toJson(listDir('./arquivo_sped'));
}

if (!empty($_POST['buscarArquivoEmpresa'])) { 
	$empresa = $_POST['empresa'];
	$ano = $_POST['ano'];

	echo toJson(is_dir("./arquivo_sped/$empresa/$ano") ?  listDir("./arquivo_sped/$empresa/$ano") : array());
}

if (!empty($_POST['buscarArquivo'])) { 
	$empresa 		= $_POST['empresa'];
	$ano 			= $_POST['ano'];
	$mes_referente 	= $_POST['mes_referente'];

	$path = "./arquivo_sped/$empresa/$ano/$mes_referente/SPED.txt";

	if (is_file($path)) { 
		$arquivo = fopen($path, "r") or die("Unable to open file!");
		echo fread($arquivo, filesize($path));
		fclose($arquivo);
	} else { 
		echo '';
	}
}

if (!empty($_POST['verificaProcesso'])) { 
	$empresa 		= $_POST['empresa'];
	$ano 			= $_POST['ano'];
	$mes_referente 	= $_POST['mes_referente'];
	$path = "./arquivo_sped/$empresa/$ano/$mes_referente/SPED_NOVO.txt";
	echo is_file($path) ? '1' : '0'; 
}





if (!empty($_POST['sendBase64'])) { 
	$tempName = !empty($_POST['tempName']) ? $_POST['tempName'] : date('ymdHis').rand(0,100);
	$base64 = $_POST['base64'];

	if (!is_dir('./temp')) mkdir('./temp');

	$arquivo = fopen('./temp/'.$tempName, 'a');
	fwrite($arquivo, $base64);
	fclose($arquivo);

	echo $tempName;
}

if (!empty($_POST['doneSendBase64'])) { 
	$tempName 	= $_POST['tempName'];
	$fileName 	= $_POST['fileName'];
	$path 		= $_POST['path'];
	$ext 		= $_POST['ext'];

	$arquivo = fopen('./temp/'.$tempName, "r") or die("Unable to open file!");
	$ctx = fread($arquivo, filesize('./temp/'.$tempName));
	fclose($arquivo);

	$path = resolvPath($path);

	$arquivo2 = fopen($path.$fileName.'.'.$ext, "w") or die("Unable to open file!");
	if (empty($_POST['no_base64'])) { 
		fwrite($arquivo2, utf8_encode(base64_decode($ctx)));
	} else { 
		fwrite($arquivo2, $ctx);
	}
	fclose($arquivo2);

	$file = './temp/'.$tempName;
 	if (is_file($file)) unlink($file);

	echo '1';
}

function resolvPath($path) { 
	$path = explode('/', $path);
	$pathNew = '';
	for ($i = 0; $i < sizeof($path); $i++) { 
		$pathNew .= ($i == 0 ? '' : '/') . $path[$i];
		if ($path[$i] != '.' && $path[$i] != '..' && $path[$i] != '' && !is_dir($pathNew)) { 
			mkdir($pathNew);
		}
	}
	return $pathNew.'/';
}


?>