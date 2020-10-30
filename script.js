
function buscarListaEmpresa() { 
	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarListaEmpresa': true },
		error: function() { }
	}).done(function(data) { 
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		let empresas = [], name;

		data.branchs.forEach(empresa => {
			name = empresa.name.split('/').pop();
			if (empresas.indexOf(name) < 0) empresas.push(name);
		});

		console.log(empresas);

		$("body").append(''
			+ 	`<datalist id="empresas">`
			+ empresas.map(e => ''
				+ 	`<option value="${e}">`
			).join('')
			+ 	`</datalist>`
		);
	});
}

function buscarArquivoEmpresa() { 
	possuiProcesso_Global = false;
	var empresa = $("#empresa").val();
	if (empresa == '') return alert('Informe a empresa!');
	var ano = $("#selectAno").val();
	if (ano == '') return alert('Informe o ano!');

	$("#anoRef").html(ano);

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarArquivoEmpresa': true, empresa, ano },
		error: function() { alert('Falha ao fazer a requisição!')},
	}).done(function(data) { 
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		var grade = 'Nenhum arquivo encontrado!';
		if ((data.branchs || []).length > 0) { 
			var files = data.branchs.map(dt => {
				const ref = dt.name.split('/');
				ref.splice(0,ref.length-3);
				return {
					empresa: 	ref[0],
					ano: 		ref[1],
					mes: 		ref[2],
				}
			})
			console.log(files);
			grade = resolvGrade(files, {
				inputs: [
					{ head: 'Empresa'	, param: 'empresa' 	},
					{ head: 'Mês'		, param: dt => dt.mes + '/' + dt.ano, align: 'center' }
				],
				descForm: 'tabelaArquivoEmpresaAno',
				no_dataTable: true
			})
		}
		$("#listaArquivo").html(grade);
		verificaProcesso();
	});
}

var possuiProcesso_Global = false;
function verificaProcesso() { 
	possuiProcesso_Global = false;
	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val()) + 1
	, 	mes_referente 	= $("#mes_referente").val();

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'verificaProcesso': true, empresa, ano, mes_referente },
		error: function() {  }
	}).done(function(data) { 
		if (data == '1') { 
			possuiProcesso_Global = true;
		}
	})
}

function baixarArquivoProcessado() { 
	if (!possuiProcesso_Global) return alert('Arquivo não processado ainda!');

	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val()) + 1
	, 	mes_referente 	= $("#mes_referente").val()
	, 	tipoArquivo 	= $("#tipoArquivo").val();

	if (empresa == '') return alert('Informe a empresa!');

	switch (tipoArquivo) {
		case '1': 
			$("#link")
				.attr('href', "./arquivo_sped/" + empresa + "/" + ano + "/" + mes_referente + "/ESTOQUE.csv")
				.attr('download', 'ESTOQUE ' + empresa + ' ' + mes_referente + '-' + ano + '.csv')[0].click();
			break;
		case '2':
			$("#link")
				.attr('href', "./arquivo_sped/" + empresa + "/" + ano + "/" + mes_referente + "/ESTOQUE.txt")
				.attr('download', 'ESTOQUE ' + empresa + ' ' + mes_referente + '-' + ano + '.txt')[0].click();
			break;
		case '3':
			$("#link")
				.attr('href', "./arquivo_sped/" + empresa + "/" + ano + "/" + mes_referente + "/SPED_NOVO.txt")
				.attr('download', 'SPED_NOVO ' + empresa + ' ' + mes_referente + '-' + ano + '.txt')[0].click();
			break;
	}
}

function enviarArquivoEmpresa() { 
	$("#modalArquivoSPED").modal('show');
}

function enviarArquivoSPED() { 
	if ($("#dataArquivoSped"	).val() == '') return alert('Informe data!');
	if ($("#nomeEmpresaSped"	).val() == '') return alert('Informe nome da empresa!');
	if ($("#arquivoSPED_upload"	).val() == '') return alert('Informe arquivo SPED!');

	var empresa = $("#nomeEmpresaSped").val();
	var mes = $("#dataArquivoSped").val().split('-')

	sendBase64({
		id: 'arquivoSPED_upload',
		div: '#progressArquivoSPED',
		fileName: 'SPED',
		path: './arquivo_sped/' + empresa + '/' + mes[0] + '/' + mes[1],
		onstart: function() { 
			$("#btnEnviarArquivoSped").attr('disabled', true);
			$(".closeModalSPED").attr('disabled', true);
			$("#dataArquivoSped").attr('disabled', true);
			$("#nomeEmpresaSped").attr('disabled', true);
			$("#arquivoSPED_upload").attr('disabled', true);
		},
		ondone: function() { 
			$("#btnEnviarArquivoSped").attr('disabled', false);
			$(".closeModalSPED").attr('disabled', false);
			$("#dataArquivoSped").attr('disabled', false);
			$("#arquivoSPED_upload").attr('disabled', false).val('');
			$("#nomeEmpresaSped").attr('disabled', false);
			$("#empresa").val($("#nomeEmpresaSped").val());
			buscarListaEmpresa();
			buscarArquivoEmpresa();
			alert('Arquivo enviado com sucesso!');
		},
	});
}

var arquivoReferente_Global = '';
// Adiconar linhas do 0200
var refProdutoFinal_Global = '';
function processarArquivo() { 
	$("#btnProcessarEstoque").attr('disabled',true);
	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val()) + 1
	, 	mes_referente 	= $("#mes_referente").val();

	if (empresa == '') { 
		$("#btnProcessarEstoque").attr('disabled',false);
		return alert('Informe a empresa!');
	}

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarArquivo': true, empresa, ano, mes_referente },
		error: function() { alert('Falha ao fazer a requisição!') },
	}).done(function(data) { 
		console.log(data);
		if (data == '') { 
			alert(`Não localizou o arquivo do mês ${mes_referente}/${ano} para armazenar os dados de estoque do ano de ${ano-1}!`);
			$("#btnProcessarEstoque").attr('disabled',false);
			return;
		}
		data = data.replace(/\r/g, '').split('\n');

		// Adiconar linhas do 0200
		refProdutoFinal_Global = returnDadosRef(data);

		arquivoReferente_Global = data;
		buscarEstoqueInicial();
	});
}

var estoqueInical_Global = '';
var produtosEntrada_Global = '';
var produtosSaida_Global = '';
var produtosRef_Global = '';
var produtosEstoque_Global = [];
function buscarEstoqueInicial() { 
	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val())
	, 	mes_referente 	= $("#mes_referente").val();

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarArquivo': true, empresa, ano, mes_referente },
		error: function() { alert('Falha ao fazer a requisição!') },
	}).done(function(data) { 
		console.log(data);
		produtosEstoque_Global = [];
		if (data == '') { 
			alert(`Não localizou o arquivo do mês ${mes_referente}/${ano} para buscar estoque inicial!`);
			$("#btnProcessarEstoque").attr('disabled',false);
			return;
		}
		data = data.replace(/\r/g, '').split('\n');
		estoqueInical_Global 	= calcDiffProduto(returnDadosEstIni(data));
		produtosEntrada_Global 	= calcDiffProduto(returnDadosEntrada(data));
		produtosSaida_Global 	= calcDiffProduto(returnDadosSaida(data));
		produtosRef_Global 		= returnDadosRef(data)
			.filter((v,i,a) => a.map(t => t.COD_ITEM).indexOf(v.COD_ITEM) == i);
		// console.log(estoqueInical_Global);

		if (estoqueInical_Global.length == 0) { 
			alert('Sem estoque inicial do ano a ser processado!');
			$("#btnProcessarEstoque").attr('disabled',false);
			return;
		}

		carregarArquivosProcessados();
	});
}

var arquivoProcessados_Global = [];
var indiceArquivoPRocessado_Global = 0;
function carregarArquivosProcessados() { 
	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val())
	, 	mes_referente 	= $("#mes_referente").val();

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarArquivoEmpresa': true, empresa, ano },
		error: function() { alert('Falha ao fazer a requisição!')},
	}).done(function(data) { 
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		if ((data.branchs || []).length > 0) { 
			indiceArquivoPRocessado_Global = 0;
			arquivoProcessados_Global = data.branchs.map(dt => { 
				const ref = dt.name.split('/');
				ref.splice(0,ref.length-3);
				return {
					empresa: 	ref[0],
					ano: 		ref[1],
					mes: 		ref[2],
				}
			});
			$("#arquivosProcessadoEstoque").html(''
				+ 	'<table>'
				+ arquivoProcessados_Global.map(file => ''
					+ 		'<tr>'
					+ 			'<td>'
					+ (mes_referente == file.mes
						? 	'<i class="fa fa-check" style="color:mediumseagreen" id="icon' + file.mes + '"></i>'
						: 	'<i class="fa fa-spinner fa-spin fa-fw" id="icon' + file.mes + '"></i>'
					)
					+ 			'</td>'
					+ 			'<td style="padding-left:15px">'
					+ 				file.mes + '/' + file.ano
					+ 			'</td>'
					+ 		'</tr>'
				).join('')
				+ 	'</table>'
			);
			$("#modalProcessarEstoque").modal('show');
			$("#btnProcessarEstoque").attr('disabled',false);
			setTimeout(() => {
				percorrerArquivoProcessados();
			}, 500);
		} else { 
			alert(`Não localizou os arquivos para processar os meses do ${ano}!`);
			$("#btnProcessarEstoque").attr('disabled',false);
			return;
		}
	});
}

function percorrerArquivoProcessados() { 
	if (arquivoProcessados_Global.length <= indiceArquivoPRocessado_Global) {
		$("#gradeEstoqueProcessado").html('Carregando dados dp estoque...');
		return carregarGradeEstoque();
	}

	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val())
	, 	mes_referente 	= $("#mes_referente").val();

	if (arquivoProcessados_Global[indiceArquivoPRocessado_Global].mes == mes_referente) { 
		indiceArquivoPRocessado_Global++;
		return percorrerArquivoProcessados();
	}

	mes_referente = arquivoProcessados_Global[indiceArquivoPRocessado_Global].mes;

	$.ajax({
		url: './estoque.php',
		type: 'POST',
		dataType: 'text',
		data: { 'buscarArquivo': true, empresa, ano, mes_referente },
		error: function() { alert('Falha ao fazer a requisição!') },
	}).done(function(data) { 
		if (data != '') { 
			data = data.replace(/\r/g, '').split('\n');
			produtosEntrada_Global 	= produtosEntrada_Global.concat(returnDadosEntrada(data))
				.filter((v,i,a) => a.map(t => t.COD_ITEM).indexOf(v.COD_ITEM) == i);

			produtosSaida_Global 	= calcDiffProduto(produtosSaida_Global.concat(returnDadosSaida(data)));
			produtosRef_Global 		= calcDiffProduto(produtosRef_Global.concat(returnDadosRef(data)));
		}
		setTimeout(() => {
			$("#icon" + mes_referente).attr('class','fa fa-check').css('color','mediumseagreen');
			indiceArquivoPRocessado_Global++;
			percorrerArquivoProcessados();
		}, 100);
	});
}

function returnDadosEstIni(data) { 
	var ref = data.filter(linha => (linha.split('|') || [])[1] == 'H010');
	return ref.map(dt => dt.split('|')).map(dt => ({
		COD_ITEM: 		parseInt(dt[02]),
		QTD: 			parseFloat(dt[04].replace(',','.')),
		VL_ITEM: 		parseFloat(dt[06].replace(',','.')),
		UNID: 			dt[03],
	}));
}

function returnDadosRef(data) { 
	let result = [], linha, indice;
	for (let i = 0; i < data.length; i++) { 
		linha = data[i].split('|') || [];
		if (linha[1] == '0200') { 
			result.push({
				REG: 			linha[01],
				COD_ITEM: 		parseInt(linha[02]),
				DESCR_ITEM: 	linha[03],
				COD_BARRA: 		linha[04],
				COD_ANT_ITEM: 	linha[05],
				UNID_INV: 		linha[06],
				TIPO_ITEM: 		linha[07],
				COD_NCM: 		linha[08],
				EX_IPI: 		linha[09],
				COD_GEN: 		linha[10],
				COD_LST: 		linha[11],
				ALIQ_ICMS: 		linha[12],
				CEST: 			linha[13],
			});
		} else if (linha[1] == '0205') { 
			indice = result.length-1;
			if ((result[indice]['0205'] || '') == '') result[indice]['0205'] = [];
			result[indice]['0205'].push({
				REG: 			linha[1],
				DESCR_ANT_ITEM: linha[2],
				DT_INI: 		linha[3],
				DT_FIM: 		linha[4],
				COD_ANT_ITEM: 	linha[5],
			});
		}
	}
	return result;
}

function returnDadosEntrada(data) { 
	var ref = data.filter(linha => (linha.split('|') || [])[1] == 'C170');
	return ref.map(dt => dt.split('|')).map(dt => ({
		COD_ITEM: 		parseInt(dt[03]),
		DESCR_ITEM: 	dt[04],
		QTD: 			parseFloat(dt[05].replace(',','.')),
		VL_ITEM: 		parseFloat(dt[07].replace(',','.')),
	}));
}

function returnDadosSaida(data) { 
	var ref = data.filter(linha => (linha.split('|') || [])[1] == 'C425');
	return ref.map(dt => dt.split('|')).map(dt => ({
		COD_ITEM: 		parseInt(dt[02]),
		QTD: 			parseFloat(dt[03].replace(',','.')),
		VL_ITEM: 		parseFloat(dt[05].replace(',','.')),
		UNID: 			dt[04],
	}));
}

function calcDiffProduto(data) { 
	var produtos = [], indice
	for (var i = 0; i < data.length; i++) { 
		indice = produtos.map(p => p.COD_ITEM).indexOf(data[i].COD_ITEM);
		if (indice >= 0) { 
			produtos[indice].QTD 		+= data[i].QTD;
			produtos[indice].VL_ITEM 	+= data[i].VL_ITEM;
		} else { 
			produtos.push(data[i]);
		}
	}
	return produtos;
}

var estoque_Global;
function carregarGradeEstoque() { 
	var codProdutos = estoqueInical_Global
		.concat(produtosEntrada_Global, produtosSaida_Global, produtosRef_Global)
		.map(d => d.COD_ITEM).filter((v,i,a) => a.indexOf(v) == i);

	estoqueInical_Global.forEach((d,i) => {
		estoqueInical_Global[i].QTD_EST_INI 		= d.QTD;
		estoqueInical_Global[i].VL_ITEM_EST_INI 	= d.VL_ITEM;
	});
	produtosEntrada_Global.forEach((d,i) => { 
		produtosEntrada_Global[i].QTD_ENTRADA 		= d.QTD;
		produtosEntrada_Global[i].VL_ITEM_ENTRADA 	= d.VL_ITEM;
	});
	produtosSaida_Global.forEach((d,i) => {
		produtosSaida_Global[i].QTD_SAIDA 			= d.QTD;
		produtosSaida_Global[i].VL_ITEM_SAIDA 		= d.VL_ITEM;
	});

	var estoque = [], item, item0200;

	// Adiconar linhas do 0200
	var cod_0200_fix = refProdutoFinal_Global.map(d => d.COD_ITEM);
	var prod_0200_add = [];

	codProdutos.forEach(cod => { 
		item = $.extend({}, 
			(produtosRef_Global		.find(d => d.COD_ITEM == cod) || {}), 
			(estoqueInical_Global	.find(d => d.COD_ITEM == cod) || {}), 
			(produtosEntrada_Global	.find(d => d.COD_ITEM == cod) || {}), 
			(produtosSaida_Global	.find(d => d.COD_ITEM == cod) || {}), 
		);

		item.SALDO = (item.QTD_EST_INI || 0) + (item.QTD_ENTRADA || 0) - (item.QTD_SAIDA || 0);
		item.TOTAL = (item.VL_ITEM_EST_INI || 0) + (item.VL_ITEM_ENTRADA || 0) - (item.VL_ITEM_SAIDA || 0)

		if (item.SALDO > 0 && item.TOTAL > 0) { 
			item.UNITARIO = item.TOTAL / item.SALDO;
			estoque.push(item);

			// Adiconar linhas do 0200
			item0200 = produtosRef_Global.find(d => d.COD_ITEM == cod);
			if ((item0200 || false) && cod_0200_fix.indexOf(cod) < 0) prod_0200_add.push(item0200);
		}
	});

	// Adiconar linhas do 0200
	let cod0205 = 0;
	refProdutoFinal_Global = prod_0200_add.concat(refProdutoFinal_Global);
	refProdutoFinal_Global = refProdutoFinal_Global
		.filter((v,i,a) => a.map(t => t.COD_ITEM).indexOf(v.COD_ITEM) == i)
		.map(l => ''
			+ `|${l.REG}|${l.COD_ITEM}|${l.DESCR_ITEM}|${l.COD_BARRA}|${l.COD_ANT_ITEM}|${l.UNID_INV}|${l.TIPO_ITEM}`
			+ `|${l.COD_NCM}|${l.EX_IPI}|${l.COD_GEN}|${l.COD_LST}|${l.ALIQ_ICMS}|${l.CEST}|`
			+ ((l['0205'] || '') == '' ? '' : '\n'
				+ l['0205'].map(s => (cod0205++, '')
					+ `|${s.REG}|${s.DESCR_ANT_ITEM}|${s.DT_INI}|${s.DT_FIM}|${s.COD_ANT_ITEM}|`
				).join('\n')
			)
		)
	// refProdutoFinal_Global = refProdutoFinal_Global.map(l => ''
	// 	+ `|${l.REG}|${l.COD_ITEM}|${l.DESCR_ITEM}|${l.COD_BARRA}|${l.COD_ANT_ITEM}|${l.UNID_INV}|${l.TIPO_ITEM}`
	// 	+ `|${l.COD_NCM}|${l.EX_IPI}|${l.COD_GEN}|${l.COD_LST}|${l.ALIQ_ICMS}|${l.CEST}|`
	// );


	estoque_Global = estoque;

	var exrpotInfo = document.getElementsByName('exrpotInfo');
	var num = ['QTD_EST_INI', 'QTD_ENTRADA', 'QTD_SAIDA', 'UNITARIO', 'SALDO', 'TOTAL'];

	arquivoEstoqueCsv = '';
	arquivoEstoqueTxt = '';

	for (var i = 0; i < exrpotInfo.length; i++) {
		if (exrpotInfo[i].checked) { 
			arquivoEstoqueCsv += (i == 0 ? '' : ';') + $(exrpotInfo[i]).data('ref');
			arquivoEstoqueTxt += (i == 0 ? '' : '|') + $(exrpotInfo[i]).data('ref');
		}
	}
	arquivoEstoqueCsv += '\n'
		+ estoque.map(e => {
			let linha = '';
			for (var i = 0; i < exrpotInfo.length; i++) {
				if (exrpotInfo[i].checked) {
					if (num.indexOf($(exrpotInfo[i]).data('id')) >= 0) { 
						linha += (i == 0 ? '' : ';') + number_format((e[$(exrpotInfo[i]).data('id')] || 0), 2, ',', '');
					} else {
						linha += (i == 0 ? '' : ';') + (e[$(exrpotInfo[i]).data('id')] || '');
					}
				}
			}
			return linha
		}).join('\n');
	arquivoEstoqueTxt += '\n'
		+ estoque.map(e => {
			let linha = '';
			for (var i = 0; i < exrpotInfo.length; i++) {
				if (exrpotInfo[i].checked) {
					if (num.indexOf($(exrpotInfo[i]).data('id')) >= 0) { 
						linha += (i == 0 ? '' : '|') + number_format((e[$(exrpotInfo[i]).data('id')] || 0), 2, ',', '');
					} else {
						linha += (i == 0 ? '' : '|') + (e[$(exrpotInfo[i]).data('id')] || '');
					}
				}
			}
			return linha
		}).join('\n');


	var empresa 		= $("#empresa").val()
	, 	ano 			= parseInt($("#selectAno").val())+1
	, 	mes_referente 	= $("#mes_referente").val();


	var linhaH = [
		'|H001|0|',
		'|H005|3112' + $("#selectAno").val() + '|' 
			+ String(parseFloat(estoque.reduce((t,v) => t + v.TOTAL, 0).toFixed(2))).replace('.',',') + '|01|'
	].concat(
		estoque.map(e => ''
			+ '|H010|' + e.COD_ITEM + '|' 
			// + (((e.UNID || '') == '') ? 'UN' : e.UNID) + '|' 
			+ (((e.UNID_INV || '') == '') ? 'UN' : e.UNID_INV) + '|' 
			+ String(parseFloat(e.SALDO.toFixed(2))).replace('.',',') + '|' 
			+ String(parseFloat(e.UNITARIO.toFixed(2))).replace('.',',') + '|' 
			+ String(parseFloat(e.TOTAL.toFixed(2))).replace('.',',') + '|0|||0|' 
			+ String(parseFloat(e.TOTAL.toFixed(2))).replace('.',',') + '|'
		),
		['|H990|' + (estoque.length + 3) + '|']
	);

	// Adiconar linhas do 0200
	addLineArquivoSped('0205', arquivoReferente_Global.map(l => l.split('|')[1]).indexOf('0205'), []);
	addLineArquivoSped('0200', arquivoReferente_Global.map(l => l.split('|')[1]).indexOf('0200'), refProdutoFinal_Global);
	addLineArquivoSped('H', arquivoReferente_Global.map(l => l.split('|')[1]).indexOf('H001'), linhaH);


	let totBlock0 = arquivoReferente_Global.filter(l => l.indexOf('|0') == 0).length + cod0205;

	arquivoReferente_Global.forEach((l,i) => {
		if (l.indexOf('|9900|H001|') == 0 && arquivoReferente_Global[i+1].indexOf('|9900|H005|') < 0) { 
			arquivoReferente_Global.splice(i+1, 0, '|9900|H005|1|');
		}
		if (l.indexOf('|9900|H005|') == 0 && arquivoReferente_Global[i+1].indexOf('|9900|H010|') < 0) { 
			arquivoReferente_Global.splice(i+1, 0, '|9900|H010|' + estoque.length + '|');
		}
	});

	let tot9900 = arquivoReferente_Global.filter(l => l.indexOf('|9900') == 0).length;
	let totBlock9 = arquivoReferente_Global.filter(l => l.indexOf('|9') == 0).length;


	arquivoReferente_Global.forEach((l,i) => {
		if (l.indexOf('|9900|H010|') == 0) { 
			arquivoReferente_Global[i] = '|9900|H010|' + estoque.length + '|';
		}
		if (l.indexOf('|9900|0200|') == 0) { 
			arquivoReferente_Global[i] = '|9900|0200|' + refProdutoFinal_Global.length + '|';
		}
		if (l.indexOf('|9900|0205|') == 0) { 
			arquivoReferente_Global[i] = '|9900|0205|' + cod0205 + '|';
		}
		if (l.indexOf('|9900|9900|') == 0) { 
			arquivoReferente_Global[i] = '|9900|9900|' + tot9900 + '|';
		}
		if (l.indexOf('|0990|') == 0) { 
			arquivoReferente_Global[i] = '|0990|' + totBlock0 + '|';
		}
		if (l.indexOf('|9990|') == 0) { 
			arquivoReferente_Global[i] = '|9990|' + totBlock9 + '|';
		}
		if (l.indexOf('|9999|') == 0) { 
			arquivoReferente_Global[i] = '|9999|' + (arquivoReferente_Global.length+cod0205-1) + '|';
		}
	});


	base64Foto_Global.push({
		base64: arquivoReferente_Global.join('\n'),
		ext: 'txt',
		id: 'arquivoCodigoSPED_upload',
		nome: $(".codigoSPED").html()
	});
	sendBase64({
		no_base64: true,
		id: 'arquivoCodigoSPED_upload',
		div:  '#progressArquivoCodigoSPED',
		fileName: 'SPED_NOVO',
		path: './arquivo_sped/' + empresa + '/' + ano + '/' + mes_referente,
		onstart: function() { 
		},
		ondone: function() { 

			base64Foto_Global.push({
				base64: arquivoEstoqueCsv,
				ext: 'csv',
				id: 'arquivoCodigoSPED_uploadCSV',
				nome: $(".codigoSPED").html()
			});
			sendBase64({
				no_base64: true,
				id: 'arquivoCodigoSPED_uploadCSV',
				div:  '#progressArquivoCodigoSPEDCSV',
				fileName: 'ESTOQUE',
				path: './arquivo_sped/' + empresa + '/' + ano + '/' + mes_referente,
				onstart: function() { 
				},
				ondone: function() { 

					base64Foto_Global.push({
						base64: arquivoEstoqueTxt,
						ext: 'txt',
						id: 'arquivoCodigoSPED_uploadTXT',
						nome: $(".codigoSPED").html()
					});
					sendBase64({
						no_base64: true,
						id: 'arquivoCodigoSPED_uploadTXT',
						div: '#progressArquivoCodigoSPEDTXT',
						fileName: 'ESTOQUE',
						path: './arquivo_sped/' + empresa + '/' + ano + '/' + mes_referente,
						onstart: function() { 
						},
						ondone: function() { 

							$("#gradeEstoqueProcessado").html(
								resolvGrade(estoque, { 
									inputs: [
										{ head: 'Código' 			, param: 'COD_ITEM' 	, format: { } },
										{ head: 'Descrição' 		, param: 'DESCR_ITEM' 	},
										{ head: 'Est Ini'			, param: 'QTD_EST_INI' 	, format: { casas: 2 } },
										{ head: 'Entrada'			, param: 'QTD_ENTRADA' 	, format: { casas: 2 } },
										{ head: 'Saída'				, param: 'QTD_SAIDA' 	, format: { casas: 2 } },
										{ head: 'Unitário' 			, param: 'UNITARIO' 	, format: { casas: 2 } },
										{ head: 'Saldo'				, param: 'SALDO' 		, format: { casas: 2 } },
										{ head: 'Total'				, param: 'TOTAL' 		, format: { casas: 2 } , foot: {} },
										// { head: 'Unidade' 			, param: 'UNID' 		, align: 'center' },
										// { head: 'Código de Barras' 	, param: 'COD_BARRA' 	},
									],
									descForm: 'tabelaEstoque',
									no_scrollX: true,
								})
							);
							verificaProcesso();

						},
					});

				},
			});

		},
	});
}

function addLineArquivoSped(prefixo, indice, linhaSet) { 
	// var indice = arquivoReferente_Global.map(l => l.split('|')[1]).indexOf('H001');
	arquivoReferente_Global = arquivoReferente_Global.filter(l => {
		try {
			return (l.split('|')[1]).indexOf(prefixo) != 0
		} catch(e) { 
			return true;
		}
	});
	var restoSped = arquivoReferente_Global.splice(indice, arquivoReferente_Global.length-indice);
	console.log(linhaSet);
	for (var i = 0; i < linhaSet.length; i++) {
		arquivoReferente_Global.push(linhaSet[i]);
	}
	for (var i = 0; i < restoSped.length; i++) {
		arquivoReferente_Global.push(restoSped[i]);
	}
}




var base64Foto_Global = [];
function readURL(input, id, idPreview='') { 
	if (input.files && input.files[0]) { 
		var reader = new FileReader();
		reader.onload = function(e) { 
			let indice = base64Foto_Global.map(e => e.id).indexOf(id);
			let nome = $("#" + id).val().split('.');
			let ext = (nome.splice(nome.length-1,1)).join('');

			if (indice < 0) { 
				indice = base64Foto_Global.length;
				base64Foto_Global.push({ id, base64: e.target.result, ext, nome: nome.join('.') });
			} else { 
				base64Foto_Global[indice].base64 = e.target.result;
				base64Foto_Global[indice].ext = ext;
			}
			if (idPreview != '') { 
				$("#" + idPreview).attr('src',base64Foto_Global[indice].base64);
			}
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function sendBase64(options) { 
	/*
		options: {
			id: '' 					// achar o base64
			div: '#' 				// desenhar o progresso do upload
			fileName: ''			// orientar onde está o download
			onstart: function		// dispara na primeira vez que chama a rotina
			ondone: function		// dispara quando termina de enviar o arquivo
			path: '' 				// caminho para salvar o arquivo
			limitChar: 7000000 		// quantos caracteres vai ser enviado por vez
			url: '' 				// para onde vai o arquivo
			no_base64: (0|1) 		// se o conteudo do arquivo não for base64
		}

		base64Foto_Global: {
			base64: ''
			ext: ''
			id: ''
			nome: ''
		}
	*/
	let indice = base64Foto_Global.map(i => i.id).indexOf(options.id);
	if (indice < 0) return false;

	if (base64Foto_Global[indice].base64.length == 0) { 
		options.fileName = (options.fileName || base64Foto_Global[indice].nome);
		options.ext = base64Foto_Global[indice].ext;
		base64Foto_Global.splice(indice, 1);
		doneSendBase64(options);
		return true;
	}

	if ((options.tempName || '') == '') { 
		if (typeof(options.onstart) == 'function') options.onstart(options);
		if ((options.no_base64 || '') == '')
			base64Foto_Global[indice].base64 = base64Foto_Global[indice].base64.split(';base64,')[1];
		options.totalChart = base64Foto_Global[indice].base64.length;
	}

	var progress = (base64Foto_Global[indice].base64.length*100) / options.totalChart;
	progress = 100 - progress;
	$(options.div).html(''
		+ 	`<div class="progress">`
		+ 		`<div class="progress-bar" role="progressbar" aria-valuenow="${progress}"`
		+ 			`aria-valuemin="0" aria-valuemax="100" style="width:${progress}%"`
		+ 		`>`
		+ 			`<span class="sr-only">${progress}% Completo</span>`
		+ 		`</div>`
		+ 	`</div>`
	);

	if ((options.limitChar || '') == '') options.limitChar = 7000000;

	$.ajax({
		url: (options.url || './estoque.php'),
		type: 'POST',
		dataType: 'text',
		data: { 
			'sendBase64': true,
			'tempName': (options.tempName || ''),
			'base64': base64Foto_Global[indice].base64.substring(0, options.limitChar),
		},
		error: function() { alert('Falha ao enviar arquivo!'); }
	}).done(function(data) { 
		console.log(data);
		base64Foto_Global[indice].base64 = base64Foto_Global[indice].base64
			.substring(options.limitChar, base64Foto_Global[indice].base64.length);

		options.tempName = data;
		sendBase64(options);
	});
}

function doneSendBase64(options) { 
	$(options.div).html('Salvando Arquivo...');
	$.ajax({
		url: (options.url || './estoque.php'),
		type: 'POST',
		dataType: 'text',
		data: { 
			'doneSendBase64': true,
			'tempName': options.tempName,
			'fileName': options.fileName,
			'path': (options.path || './'),
			'ext': options.ext,
			'no_base64': (options.no_base64 || ''),
		},
		error: function() { alert('Falha ao enviar arquivo!'); }
	}).done(function(data) { 
		console.log(data);
		$(options.div).html('');
		if (typeof(options.ondone) == 'function') options.ondone(options);
	});
}


setTimeout(() => { 
	$("#arquivoSPED_upload").change(function(){ readURL(this, 'arquivoSPED_upload'); });

	$("#modalArquivoSPED").on('shown.bs.modal', function () { 
		$("#dataArquivoSped").val( $("#selectAno").val() + moment().format('-MM') )[0].focus();
		$("#nomeEmpresaSped").val($("#empresa").val());
	});

	$("#modalArquivoCodigoSPED").on('shown.bs.modal', function () { 
		carregarArquivoCodigo();
	});

	// buscaListaArquivo();
	buscarListaEmpresa();
}, 500);
