<!DOCTYPE html>
<html>
<head>
	<title>Estoque</title>
	<link rel="shortcut icon" href="img/estoque_icon_min.png"> 
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> -->
	<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> -->
	<!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script> -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="./lib/bootstrap/dist/css/bootstrap.min.css">
	<script src="./lib/jquery/dist/jquery.min.js"></script>
	<script src="./lib/bootstrap/dist/js/bootstrap.min.js"></script>
	<script src="./lib/datatables.net/datatables.min.js"></script>
	<script src="./lib/moment/moment.js"></script>

	<script src="./js/scriptCofing.js?<?php echo filemtime('./js/scriptCofing.js'); ?>"></script>
	<script src="./js/scriptGrade.js?<?php echo filemtime('./js/scriptGrade.js'); ?>"></script>

	<link rel="stylesheet" href="./style.css?<?php echo filemtime('./style.css'); ?>">
</head>
<body>

<div class="container">
	<div class="row">
		

		<div class="col-md-2 text-center">
			<img src="./img/estoque_icon.png" width="100px">
			<br><br>
			<button class="btn btn-block btn-default" onclick="$('#modalManual').modal('show');">
				<i class="fa fa-book"></i> Manual
			</button>
		</div>

		<div class="col-md-6" style="margin-top: 15px;">
			<table width="100%">
				<tr>
					<td style="padding-right: 10px;">
						<label for="empresa">Empresa: </label>
						<input id="empresa" class="form-control" list="empresas">
					</td>
					<td style="padding-right: 10px;">
						<label for="" style="opacity: 0;">.</label>
						<button class="btn btn-primary btn-block" onclick="buscarArquivoEmpresa();">
							<i class="fa fa-search"></i>
						</button>
					</td>
					<td>
						<label for="" style="opacity: 0;">.</label>
						<button class="btn btn-warning btn-block" onclick="enviarArquivoEmpresa();">
							<i class="fa fa-upload"></i>
						</button>
					</td>
				</tr>
			</table>

			<label style="margin-top: 10px;" for="selectAno">Ano à ser processado: </label>
			<div id="divSelectAno"></div>
			<script>
				var anos = [], anoAtual = parseInt(moment().format('Y'));
				for (let i = 2010; i < anoAtual; i++) anos.push(i);
				console.log(anos);

				var selectAno = ''
					+ 	'<select class="form-control" id="selectAno" onchange="buscarArquivoEmpresa();">'
					+ 		anos.reverse().map(ano => `<option value="${ano}">${ano}</option>`).join('')
					+ 	'</select>'
				$("#divSelectAno").html(selectAno);
			</script>
			<br>

			
			<label for="mes_referente">Mês Referente: </label>
			<select id="mes_referente" class="form-control">
				<option value="01">Janeiro</option>
				<option value="02" selected>Fevereiro</option>
				<option value="03">Março</option>
				<option value="04">Abriu</option>
				<option value="05">Maio</option>
				<option value="06">Junho</option>
				<option value="07">Julho</option>
				<option value="08">Agosto</option>
				<option value="09">Setembro</option>
				<option value="10">Outubro</option>
				<option value="11">Novembro</option>
				<option value="12">Dezembro</option>
			</select>

			<br>
			
			<label for="">Meses referênte ao ano <span id="anoRef"></span>: </label>
			<script>
				$("#anoRef").html($("#selectAno").val());
			</script>
			<div id="listaArquivo">
				Informe a empresa e o ano a ser processado
			</div>
		</div>

		<div class="col-md-4" style="margin-top: 15px;">

			<!-- <label for="">Extensão: </label>
			<br>
			<input type="radio" name="typeFile" id="typeFileCSV" checked>
			<label for="typeFileCSV"> CSV</label>
			<br>
			<input type="radio" name="typeFile" id="typeFileTXT">
			<label for="typeFileTXT"> TXT</label>
			<br><br> -->
			
			<label for="">Informações Exportadas: </label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="codigoProd" data-id="COD_ITEM" data-ref="CODIGO" checked>
			<label for="codigoProd"> Código</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="descricaoProd" data-id="DESCR_ITEM" data-ref="DECRI" checked>
			<label for="descricaoProd"> Descrição</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="entIniProd" data-id="QTD_EST_INI" data-ref="ESTINI" checked>
			<label for="entIniProd"> Estoque Inicial</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="entProd" data-id="QTD_ENTRADA" data-ref="ENTRADA" checked>
			<label for="entProd"> Entrada</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="saidaProd" data-id="QTD_SAIDA" data-ref="SAIDA" checked>
			<label for="saidaProd"> Saída</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="unitProd" data-id="UNITARIO" data-ref="VALUNIT" checked>
			<label for="unitProd"> $ Unitário</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="saldoProd" data-id="SALDO" data-ref="SALDO" checked>
			<label for="saldoProd"> Saldo</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="totalProd" data-id="TOTAL" data-ref="VALTOT" checked>
			<label for="totalProd"> $ Total</label>
			<br>
			<input type="checkbox" name="exrpotInfo" id="codigoBarraProd" data-id="COD_BARRA" data-ref="BARRA" checked>
			<label for="codigoBarraProd"> Código de Barras</label>

			<br><br><br>

			<!-- <button class="btn btn-warning btn-block">
				<i class="fa fa-list"></i> Verificar
			</button>
			<br> -->
			<button class="btn btn-primary btn-block" onclick="processarArquivo()" id="btnProcessarEstoque">
				<i class="fa fa-gear"></i> Processar
			</button>
			<br>
			<select class="form-control" id="tipoArquivo">
				<option value="1">Estoque Planilha (CSV)</option>
				<option value="2">Estoque Texto (TXT)</option>
				<option value="3">SPED NOVO</option>
			</select>
			<br>
			<button class="btn btn-success btn-block" onclick="baixarArquivoProcessado();">
				<i class="fa fa-download"></i> Baixar
			</button>
		</div>

		<div class="col-md-2 col-xs-6" style="margin-top: 15px;">
		</div>

	</div>

</div>

<a id="link" style="display: none;" download="SPED.csv"></a>

<script type="text/javascript" src="./script.js?<?php echo filemtime('./script.js'); ?>"></script>



<div id="modalProcessarEstoque" class="modal fade" role="dialog"> 
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close closeModalSPED" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">
					Processar Estoque: 
				</h4>
			</div>
			<div class="modal-body">
				Grade de Arquivos Processados: 
				<div id="arquivosProcessadoEstoque"></div>
				<br><br>
				<div id="gradeEstoqueProcessado"></div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default closeModalSPED" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>



<div id="modalArquivoSPED" class="modal fade" role="dialog"> 
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close closeModalSPED" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">
					Importar Arquivo: 
				</h4>
			</div>
			<div class="modal-body">
				Data: 
				<input type="month" class="form-control" id="dataArquivoSped">
				<br>
				Nome Empresa: 
				<input type="text" class="form-control" id="nomeEmpresaSped" list="empresas" autocomplete="off">
				<br>
				Arquivo: 
				<input type="file" class="form-control" id="arquivoSPED_upload">
				<br>
				<div id="progressArquivoSPED"></div>
				<button class="btn btn-block btn-warning" id="btnEnviarArquivoSped"
					onclick="enviarArquivoSPED();"
				>
					<i class="fa fa-upload"></i> Enviar Arquivo
				</button>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default closeModalSPED" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>


<div id="modalManual" class="modal fade" role="dialog"> 
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close closeModalSPED" data-dismiss="modal">&times;</button>
				<h4 class="modal-title"> Manual:  </h4>
			</div>

			<div class="modal-body">
				<p>
					<b>1º: </b> Informe a empresa e ano que deseja processar e depois clique na lupa, o sistema vai 
					verificar todos os arquivo que estão para aquela empresa e carrega-los numa grade abaixo do campo de 
					Mês Referente
					<center>
						<img src="./img/manual/empresa e ano.png" width="80%" style="border: 1px solid black">
					</center>
				</p>
				<br>
				<p>
					<b>2º: </b> Confira se estão todos os meses referênte a empresa e o ano
					<center>
						<img src="./img/manual/arquivo listados.png" width="80%" style="border: 1px solid black">
					</center>
				</p>
				<br>
				<p>
					<b><i class="fa fa-asterisk" style="color: red"></i> Obs: </b> Caso esteja faltando algum arquivo basta clicar
					no botão amarelo do lado do campo da empresa, irá carregar uma janela flutuate para informa qual o mês, 
					a empresa e o arquivo, feito so clicar em enviar, o arquivo já será carregado na grade de meses referente
					<center>
						<img src="./img/manual/enviar arquivo.png" width="80%" style="border: 1px solid black">
					</center>
				</p>
				<br>
				<p>
					<b>3º: </b> Informe o Mês referente, por padrão vem o mes de Fevereiro.
					<br>Esse mês referente quer dizer a qual arquivo do ano sucessor ao que será processado o sistema deve
					armazanar as informarções do estoque.
					<br><br>
					<b>Exemplo: </b>se for processar o ano de 2019 e o mês referênte for Fevereiro, 
					o sistema vai armazenar os dados processados (H001, H005, H010 e H990) de 2019 no arquivo de Fevereiro de 2020 
					dessa empresa
					<center>
						<img src="./img/manual/mes referente.png" width="80%" style="border: 1px solid black">
					</center>
				</p>
			</div>

			<div class="modal-footer">
				<button class="btn btn-default closeModalSPED" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>


</body>
</html>