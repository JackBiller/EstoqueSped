
function capitalize(s) { 
	if (typeof s !== "string") return ""
	return s.charAt(0).toUpperCase() + s.slice(1)
}

/** GER */
function resolvGrade(data, option) { 
	/*
		objParamGrade: {
			tamanhoFont: 		11
			fontFamily: 		"NomeDaFont"
			classTable: 		"table table-bordered stripe table-hover table-condensed table-responsive backTeste"
			titleTableBgColor: 	"#D5DEE3"
			titleTableColor: 	"black"
			titleTableWeight: 	"bold"
			headTableBgColor: 	"#D5DEE3"
			headTableColor: 	"black"
			headTableWeight: 	"bold"
			footTableBgColor: 	"#D5DEE3"
			footTableColor: 	"black"
			footTableWeight: 	"bold"
			stripTableColors: 	[{bgcolor: "white"}]
			hoverTrTableColor: 	"lightblue"
			padination: 		[15,25]
			isMobile_Global: 	false
			no_scrollX: 		true
			languageJson: 		''
			dom: 				"<'row'<'col-sm-12 col-md-8'l><'col-sm-12 col-md-4'f>>" +
								"<'row'<'col-sm-12'tr>>" +
								"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
		}

		option = {
			inputs: [
				{
					head: ''												// Descrição no titulo da tabela

					param: '' 												// Parametro a ser mostrado na celula OR
					param: function(data, option, indice) 					// Parametro a ser mostrado por function usará como callback, 
					... 													// 		o option é referente as opções do input e o indice é dos dados OR
					param: { 												// Parametro mais personalizado para mostrar valores
						op: (CONCAT|SUM), 									// operação a ser realizada pelos valores
						val: [ { attr,literal } ] 							// valores a serem trabalhos para mostrar
					}

					align: 'left' 											// Alinhamento da celula (left | right), default: 'center'
					alignHead: '' 											// Alinhamento do cabeçario (left | right), 
					... 													// OBS: herarquia de configuração:  this > defaultAlignHead > align > 'center'
					dateFormat: { 											// Indica que o campo é data
						format: 'DD/MM/Y' 									// Define com vai ser impresso o formato da data
						format: function(data, option, indice) 				// Pode usar como callback, similar ao atributo param
						useDataTable: 										// (0|1) default: 1
					}
					format: { 												// Indica que o campo é um número
						casas: 	  0 										// numero de casas decimais
						dec: 	',' 										// separedor decimal
						mili: 	'.' 										// separedor de milhar
					}
					default: '' 											// substitui o undefined
					setDefaultValZero: (0|1) 								// quando for campo numerico (format) e o valor for zero, vai imprimir o valor padrão 
					foot: { 												// se este for enviado como objeto vazio '{}', será usado o valor de param
						op: 'SUM,MEDIA|expression|personalizado|literal' 	// padrão SUM
						val: { 												// caso omitido será usado o param do próprio input, pode ser enviado um array tambem
							attr: '' 										// nome do atributo a ser usado
							op: 'SUM,MEDIA|expression' 						// operação valor 
						}
						OR val: '' 											// String no caso de ser literal vai replicar o valor extamente que está escrito
						... 												// Caso seja expressão e attr val for omitido, usa o seguinte padrão [{attr: option.param}]
						algin: '' 											// caso omitido será usado o align do próprio input
						format: { 											// caso omitido será usado o format do próprio input
							casas: 	  0 									// numero de casas decimais
							dec: 	',' 									// separedor decimal
							mili: 	'.' 									// separedor de milhar
						}
						mask: '%0%' 										// mascara do campo
						ignoreNull: (0|1) 									// para media vai ignorar os valores undfined na hora de divir, default: false
					}
					style: {} 												// props de css podendo passar int, string e funcs de callback
					...														// OBS: os nomes dos attrs deve ser iguais ao do css
					... 													// Quando callback chama-se func(dt,el=inputs[i],indice)
					... { thead: { td: { style } } }						// É possivel confecionar o estilo do head

					mask: '%0%' 											// substiui o %0% pelo valor correspondentes e coloca o restante do texto, ex: (R$ %0% || %0% %)

					tooltip: function(data,element){} 						// mandar callback direto com padrão de posição como bottom OR
					tooltip: { 												// parametro para colocar balão demostrativo quando passar o mouse emcima
						pos: 'bottom'										// posição que vai aparecer (top | right | bottom | left)
						html: function(data,element){} 						// callback para resowlver o conteudo do balão
					}
					tdClick: { 												// Click na celula
						desc: 'func(%0%)' 									// nome da função a ser executada
						val: [ { (attr | index) } ] 						// valores de referencia
					}
					no_render: (0|1) 										// Para indicar se tem que renderizar a coluna ou não
				}
			],
			defaultAlignHead: 'center' 										// align default of header
			ck_edit: (0|1) 													// Opção de editar chamando a função editar + capitalize(descForm) e passando indice no paramtro
			ck_delete: (0|1) 												// Opção de apagar chamando a função apagar + capitalize(descForm) e passando indice no paramtro
			div: '#id' 														// Nome do elemento que vai ser para renderizar a grade
			... 															// Caso não informado considera returnHTML como sendo verdadeiro
			descForm: '' 													// referica para a função de editar e apagar registros
			languageJson: '' 												// caminho do objeto JSON para traduzir a grade para PoRtugues ou outro idioma
			objParamGrade: '' 												// objeto de estilização do qualidade
			returnHTML: (0|1) 												// se vai retornar ou não um HTML, em caso verdadeiro não precisa definir o parametro div
			order: [[0,"asc"]] 												// opção de inicialização de ordenação
			class: { 														// Setar classes no geral
				thead: { tr | td }
				tbody: { tr | td }
				tfoot: { tr | td }
			}
			style: { 														// Setar style no geral
				thead: { tr | td }
				tbody: { tr | td } 											// no td aceita callback passando por parametro dt e el=inputs[i]
				tfoot: { tr | td }
			}
			trClick: { 														// onclick na tag tr da grade
				desc: 'func(%0%)' 											// nome da função a ser executada
				val: [ { (attr | index) } ] 								// valores de referencia
			}
			trClickFoot: { 													// onclick na tag tr do rodape
				desc: 'funct()' 											// nome da função a ser executada
			}
			search: '' 														// Campo de busca inicializado com valor
			onOrder: function(e, settings, data){  } 						// Envento disparado quando ordenar
			onSearch: function(e, settings, data){  } 						// Envento disparado quando procura
			onPage: function(e, settings, data){  } 						// Envento disparado quando mudar paginação
			no_scrollX: (0|1) 												// Remover parametro da grade scrollX (bug do cabaçalho desalhiado)
			invertPadination: (0|1) 										// Inverter Paginação da Grade

			no_tableSetWidth: (0|1) 										// Não seta width da tabela com 100%
			no_dataTable: (0|1) 											// Não usa lib dataTable
			initComplete: function(){} 										// Função diparada quando termina de carregar a grade
			setDefaultValZero: (0|1) 										// quando for campo numerico (format) e o valor for zero, vai imprimir o valor padrão 
			title: ''														// titulo para exportação de dados
			dom: "<'row'<'col-sm-12 col-md-8'l><'col-sm-12 col-md-4'f>>" + 	// definição de layout da table
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
		}
	*/

	let objParamGrade = $.extend({}, (objParamGrade_Global || {}), (option.objParamGrade || {}))
	, 	title = option.title || 'CDI - Informatica e Assessoria'
	, 	ck_tFoot = false
	, 	ck_tooltip = false;

	if (typeof(data) == 'string') { 
		try { 
			data = JSON.parse(data);
		} catch(e) { 
			return false;
		}
	}
	var grade = '<br>' + (data[0]?.debug || 'Nenhum resultado encontrado!');
	if ( (data.length > 0 && (data[0].debug || '') == '') || data[0].debug == "OK" ) { 
		grade = ``
			// + 	`<br>`
			// + 	`<table class='table' id='tabela${capitalize(option.descForm || '')}' border='1'>`
			+ 	`<table`
			+ 		` id='tabela${capitalize(option.descForm || '')}'`
			+ 		` class='${(objParamGrade.classTable || '')}'`
			+ 		((option.no_tableSetWidth || '') != '' ? '' : " width='100%'")
			+ 		` border='1'`
			+ 		` style='font-size:${(objParamGrade.tamanhoFont || '12')}px'`
			+ 	`>`
			+ 		`<thead>`

			+ 	`<tr`
			+ 		` class='${(option.class?.thead?.tr || '')}'`
			+ 		` style='` // white-space:nowrap;
			+ 			((objParamGrade.headTableWeight 	|| '') == '' ? '' : "font-weight:"		+ objParamGrade.headTableWeight		+ ";")
			+ 			((objParamGrade.headTableBgColor 	|| '') == '' ? '' : "background-color:"	+ objParamGrade.headTableBgColor	+ ";")
			+ 			((objParamGrade.headTableColor 		|| '') == '' ? '' : "color:"			+ objParamGrade.headTableColor		+ ";")
			+ 			resolvStyleGrade( option.style?.thead?.tr || {} )
			+ 		`'`
			+ 	`>`

			+ option.inputs.map(input => { 
				return (input.no_render || '') != '' ? '' : ``
					+ 	`<td`
					+ 		` align='${input.alignHead || option.defaultAlignHead || input.align || 'center'}'`
					+ 		` class='${(option.class?.thead?.td || '')}'` // + 		" class='padraoLinhaH'"
					+ 		` style='${resolvStyleGrade( $.extend((option.style?.thead?.td || {}), (input.style?.thead?.td || {}) ) )}'`
					+ 	`>`
					+ 		`<b>${input.head}</b>`
					+ 	`</td>`
			}).join('')
			+ (!(option.ck_edit 	|| false) ? `` : `<td align='center' class='padraoLinhaH'><b></b></td>`)
			+ (!(option.ck_delete 	|| false) ? `` : `<td align='center' class='padraoLinhaH'><b></b></td>`)

			+ 	`</tr>`

			+ 		`</thead>`
			+ 		`<tbody>`

		for (var i = 0; i < data.length; i++) {
			grade += ``
				+ 		`<tr`
				+ ((option.trClick || '') == '' ? '' : ''
					+ 	` onclick='${resolveClick(data[i], option.trClick, i)}'`
				)
				+ 			` class='`
				+ 				((option.trClick || '') == '' ? '' : 'cursorClick ')
				+				(option.class?.tbody?.tr || '')
				+ 			`'`
				+ 			` style='`
				+ 				resolvStyleGrade ( 
									$.extend({}, (option.style?.tbody?.tr || {}), (option.inputs[i]?.style?.tr || {})) , data[i]
								)
				+ 			`'`
				+ 		`>`

				+ option.inputs.map(input => { 
					input  = $.extend({}, { setDefaultValZero: (option.setDefaultValZero || false) }, input);

					const style 		= $.extend( {}, (option.style?.tbody?.td || {}), ((input.style || {}).td || {}) )
					, 	valPrint 		= resolveValPrint(input, data[i], i)
					, 	defaultAling 	= 	(input.format 		|| '') != '' ? 'right'
										: 	(input.dateFormat 	|| '') != '' ? 'center'
										: 	'left';

					if ((input.foot || '') != '') ck_tFoot = true;

					return (input.no_render || '') != '' ? '' : ``
						+ 	`<td`
						+ 		` align='${(input.align || defaultAling)}'`
						+ 		` class='`
						+ 			((input.tdClick || '') == '' ? '' : 'cursorClick ')
						+			(option.class?.tbody?.td || '')
						+		`'`
						+ ((input.tdClick || '') == '' ? '' : ''
							+ 	` onclick='${resolveClick(data[i], input.tdClick, i)}'`
						)
						+ (Object.keys(style).length == 0 ? '' : ''
							+ 	` style='${resolvStyleGrade( style, data[i], input, i )}'`
						)
						+ 	">"

						+ ((input.tooltip || '') == '' 
							? valPrint  					// não é tooltip
							: (ck_tooltip = true, '') 		// caso for tooltip
							+ 	`<div data-toggle='tooltip' data-html='true'`
							+ (typeof(input.tooltip) == 'function' 
								? ''
								+ 	` data-placement='bottom'`
								// + 	` title='${(input.tooltip(data[i], input) || '').replace(/\"/g, '\\\"')}'`
								+ 	` title='${(input.tooltip(data[i], input) || '')}'`
								: ''
								+ 	` data-placement='${(input.tooltip.pos || 'bottom')}'`
								+ 	` title='${(input.tooltip.html(data[i], input) || '')}'`
							)
							+ 	`>`
							+ 		valPrint
							+ 	`</div>`
						)
						+ 	`</td>`
				}).join('')

				+ (!(option.ck_edit || 0) ? `` : ``
					+ 		`<td align='center'`
					+ 			` class='${(option.class?.tbody?.td || '')}'`
					+ 			` style='`
					+ 				resolvStyleGrade( option.style?.tbody?.td || {} )
					+ 			`'`
					+ 		`>`
					+ 			`<a href='#' style='color:orange' onclick='editar${capitalize(option.descForm || '')}(${i});'>`
					+ 				`<i class='fa fa-pencil'></i>`
					+ 			`</a>`
					+ 		`</td>`
				)
				+ (!(option.ck_delete || 0) ? `` : ``
					+ 		`<td align='center'`
					+ 			` class='${(option.class?.tbody?.td || '')}'`
					+ 			` style='`
					+ 				resolvStyleGrade( option.style?.tbody?.td || {} )
					+ 			`'`
					+ 		`>`
					+ 			`<a href='#' style='color:red' onclick='apagar${capitalize(option.descForm || '')}(${i});'>`
					+ 				`<i class='fa fa-times'></i>`
					+ 			`</a>`
					+ 		`</td>`
				)
				+ 		`</tr>`
		}
		grade += ``
			+ 		`</tbody>`


		if (ck_tFoot) { 

			grade += ``
				+ 	`<tfoot>`
				// + 		`<tr bgcolor='${objParamGrade.footTableBgColor}' `
				// + 			`style='font-weight:${objParamGrade.footTableWeight};color:${objParamGrade.footTableColor}'>`
				+ 	`<tr`
				+ 		` class='${(option.class?.tfoot?.tr || '') + ((option.trClickFoot?.desc || '') == '' ? '' : ' cursorClick')}'`
				+ 		` style='`
				+ 			resolvStyleGrade( option?.style?.tfoot?.tr || {} )
				+ 			((objParamGrade.footTableWeight 	|| '') == '' ? '' : "font-weight:"		+ objParamGrade.footTableWeight		+ ";")
				+ 			((objParamGrade.footTableBgColor 	|| '') == '' ? '' : "background-color:"	+ objParamGrade.footTableBgColor	+ ";")
				+ 			((objParamGrade.footTableColor 		|| '') == '' ? '' : "color:"			+ objParamGrade.footTableColor		+ ";")
				+ 		`'`
				+ 		((option.trClickFoot?.desc || '') == '' ? '' : ` onclick="${option.trClickFoot.desc}"`)
				+ 	`>`
				+ option.inputs.map(input => { 
					const align = (input.foot?.align || input.align || 
						((input.format || '') != '' ? 'right' : ((input.dateFormat || '') != '' ? 'center' : 'left')))

					let valPrint = '';
					if ((input.foot || '') != '') { 
						if ((input.foot.val || '') == '') { 
							input.foot.val = {};
							input.foot.val.attr = input.param;
						}

						valPrint = resolveFoot(data, input.foot, input);
					}

					return (input.no_render || '') != '' ? '' : ``
						+ 	`<td`
						+ 		` align='${align}'`
						+ 		` class='${(option.class?.tfoot?.td || '')}'`
						+ 		` style='${resolvStyleGrade( option.style?.tfoot?.td || {} )}'`
						+ 	`>`
						+ 		valPrint
						+ 	`</td>`;
				}).join('')
				+ 		`</tr>`
				+ 	`</tfoot>`
		}
		grade += ``
			+ 	`</table>`
	} else { 
		grade = `<b>Debug != OK</b>`;
	}

	if ((option.no_dataTable || '') != '') { 
		if ((option.div || '') != '') { 
			$((option.div || '')).html(grade);
			return true;
		} else if([false,0].indexOf(option.returnHTML) < 0) { 
			return grade;
		}
	};

	option.inputs.forEach((input, i) => { option.inputs[i].indice = i; });

	var padination = (objParamGrade.padination || [])
		.filter(v => v <= data.length)
		.filter((v,i,a) => a.indexOf(v) === i);
	if ((option.invertPadination || '') != '') padination = invertPadination((objParamGrade.padination || []), data.length);
	if (padination.indexOf(data.length) < 0) padination.push(data.length);

	var stripeClasses = (objParamGrade.stripTableColors || []).map(i => 'stripe'+i);

	var mynumeric = option.inputs
		.filter(input => (input.format || '') != '' && (input.tooltip || '') == '')
		.map(el => el.indice);

	var mynumericTooltip = option.inputs
		.filter(input => (input.tooltip || '') != '')
		.map(el => el.indice);

	if ((option.returnHTML || false) || (option.div || '') == '') { 
		return grade
			+ 	`<script>`
			+ 		(ck_tooltip ? `$('[data-toggle="tooltip"]').tooltip();` : '')
			+ 		`$("#tabela${capitalize(option.descForm || '')}").DataTable({`
			+ 			`  'language' 		: {'url': '${(option.languageJson || objParamGrade.languageJson || '../lb/DataTables-1.10.18/Portuguese.json')}'}`
			+ 			`, 'lengthMenu' 	: ${JSON.stringify(padination)}`
			+ 			`, 'autoWidth' 		: false`
			+ 			`, 'order' 			: ${JSON.stringify(option.order || [[0,"asc"]])}`
			+ 			`, 'stripeClasses' 	: ${JSON.stringify(stripeClasses)}`
			+ 			`, 'columnDefs'		: [`
			+ 					`  {"sType":"mynumeric","aTargets":${JSON.stringify(mynumeric)}}`
			+ 					`, {"sType":"mynumericTooltip","aTargets":${JSON.stringify(mynumericTooltip)}}`
			+ 			`]`
			+ (ck_tooltip || (option.no_scrollX || '') != '' || (objParamGrade.no_scrollX || '') != '' ? '' : ''
				+ 		`, 'scrollX': '${((option.scrollX || objParamGrade.isMobile_Global ? "100%" : "false"))}'`
			)
			+ 			`, 'search': {`
			+ 				`'search': '${(option.search || '')}'`
			+ 			`}`
			// + ((objParamGrade.dom 		|| '') == '' ? '' : `, dom:"${objParamGrade.dom}"` 	)
			+ 	`, dom:	\`${(option.dom || objParamGrade.dom || ''
						+ "<'row'<'col-sm-12 col-md-8'l><'col-sm-12 col-md-4'f>>"
						+ "<'row'<'col-sm-12'tr>>"
						+ "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
				)
			}\``
			// + ((objParamGrade.buttons 	|| '') == '' ? '' : `, buttons:${JSON.stringify(objParamGrade.buttons)}` )
			+ 			`, 'buttons': [`
			// + 				`{ extend: 'copy'	, text: '<i class="fa fa-copy"></i> Copiar'			, title: "${title}" , exportOptions: { stripHtml: false } },`
			// + 				`{ extend: 'csv'	, text: '<i class="fa fa-file-o"></i> CSV'			, title: "${title}" , exportOptions: { stripHtml: false } },`
			// + 				`{ extend: 'excel'	, text: '<i class="fa fa-file-excel-o"></i> Excel'	, title: "${title}" , exportOptions: { stripHtml: false } },`
			// + 				`{ extend: 'pdf'	, text: '<i class="fa fa-file-pdf-o"></i> PDF'		, title: "${title}" , exportOptions: { stripHtml: false } },`
			+ 				`{ extend: 'print'	, text: '<i class="fa fa-print"></i> Print'			, title: "${title}" , exportOptions: { stripHtml: false }, autoPrint: true },`
			+ 			`]`
			+ (typeof(option.initComplete) != 'function' ? '' : ''
				+ 		`, initComplete: ${String(option.initComplete)}`
			)
			+		`});`
			+ 	"</"+"script>"
	} else { 
		$((option.div || '')).html(grade);

		if (ck_tooltip) $('[data-toggle="tooltip"]').tooltip();

		$("#tabela" + capitalize(option.descForm || ''))
			.on('order.dt', 	function (e, settings, data) { if ((option.onOrder 	|| '') != '')  option.onOrder	(e, settings, data); })
			.on('search.dt', 	function (e, settings, data) { if ((option.onSearch || '') != '')  option.onSearch	(e, settings, data); })
			.on('page.dt', 		function (e, settings, data) { if ((option.onPage 	|| '') != '')  option.onPage	(e, settings, data); })
			.DataTable({
			  "language": 		{ "url": (option.languageJson || objParamGrade.languageJson || "../lb/DataTables-1.10.18/Portuguese.json") }
			//   "language": 		{ "url": "../lb/DataTables-1.10.18/Portuguese.json" }
			, "lengthMenu": 	padination
			, "order":			(option.order || [[0,"asc"]]) // order = VLR_DEVOLUCAO_MES : desc
			, 'autoWidth': 		false
			, 'stripeClasses':  stripeClasses
			, 'columnDefs': [
				{"sType":"mynumeric","aTargets":mynumeric}
				, {"sType":"mynumericTooltip","aTargets":mynumericTooltip}
			]
			, 'scrollX': (ck_tooltip  || (option.no_scrollX || '') != '' || (objParamGrade.no_scrollX || '') != '' ? '' : ''
				+ "'" + (option.scrollX || objParamGrade.isMobile_Global ? "100%" : false) + "'"
			)
			, 'search': {
				'search': (option.search || '')
			}
			, 'initComplete': option.initComplete
			// "scrollX": true,
			// "scrollX": '100%',
			// "scrollY": 350,
			// paging: false,
			// dom: 'Bfrtip',
			// dom: 'Blfrtip',
			// "dom": '<lf<t>ip>',
			// dom: '<"wrapper"flipt>',
			// "dom": '<"top"i>rt<"bottom"flp><"clear">',
			// "dom": "<'row'<'col-sm-6'l><'col-sm-6'f>>",
			// , dom: '<Blf<t>ip>'
			, dom: 	(option.dom || objParamGrade.dom || '' 
					+ "<'row'<'col-sm-12 col-md-8'l><'col-sm-12 col-md-4'f>>" 
					+ "<'row'<'col-sm-12'tr>>" 
					+ "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
			)
			// , dom: 'Blfrtip'
			, 'buttons': [
				// { extend: 'copy'	, text: '<i class="fa fa-copy"></i> Copiar'			, title , exportOptions: { stripHtml: false }, autoPrint: false  },
				// { extend: 'csv'		, text: '<i class="fa fa-file-o"></i> CSV'			, title , exportOptions: { stripHtml: false }, autoPrint: false  },
				// { extend: 'excel'	, text: '<i class="fa fa-file-excel-o"></i> Excel'	, title , exportOptions: { stripHtml: false }, autoPrint: false  },
				// { extend: 'pdf'		, text: '<i class="fa fa-file-pdf-o"></i> PDF'		, title , exportOptions: { stripHtml: true }, autoPrint: false  },
				{ extend: 'print'	, text: '<i class="fa fa-print"></i> Print'			, title , exportOptions: { stripHtml: false }, autoPrint: true },
			]
		});
		// console.log(objParamGrade.scrollX);
		// console.log(objParamGrade.isMobile_Global);
		// console.log((objParamGrade.scrollX || objParamGrade.isMobile_Global ? "100%" : false));
		return true;
	}
}

function resolvStyleGrade(obj,dt={},el={},indice=-1) { 
	let html = '', keys = Object.keys(obj), func, htmlTemp;

	for (var i = 0; i < keys.length; i++) { 
		if (typeof(obj[keys[i]]) == 'function') { 
			func = obj[keys[i]];
			htmlTemp = func(dt,el,indice);
		}
		html += keys[i] + ':' + (typeof(obj[keys[i]]) == 'string' ? obj[keys[i]] : htmlTemp) + ';';
	}
	return html;
}

function resolveValPrint(option, data, indice) { 
	let mask = (data[option.param] == undefined) ? '%0%' : (option.mask || '%0%');

	let valData = '';
	if (typeof(option.param) == 'function') { 
		valData = option.param(data, option, indice)
	}
	else if (typeof(option.param) == 'object') { 
		if (['sum'].indexOf(option.param.op) < 0) valData = 0;

		if ((option.param.op || 'CONCAT').toUpperCase() == 'CONCAT') { 
			valData = option.param.val.map((val) => { return val.literal || data[val.attr]; }).join('');
		}
		if (option.param.op.toUpperCase() == 'SUM') { 
			valData = option.param.val
				.map((val) => { return parseFloat(val.literal || data[val.attr] || 0) })
				.reduce((t,v) => { return t + v; }, 0);
		}
	}
	else { 
		valData = (data[option.param] || '');
	}


	let val = '';
	if((option.format || '') != '') { 
		let { casas, dec, mili } = option.format;
		if (
			(typeof(option.param) == 'function' && valData == '') || 
			(typeof(option.param) != 'function' && data[option.param] == undefined)
		) { 
			valData = option.default || '';
		} else { 
			valData = (valData || 0);
			if (valData == 0 && (option.setDefaultValZero || false)) { 
				val = option.default || '';
			} else { 
				val = number_format(valData, (casas || 0), (dec || ','), (mili || '.'));
			}
		}
	}
	else if ((option.dateFormat || '') != '') { 
		option.dateFormat.format = (option.dateFormat?.format || 'DD/MM/Y')
		let valHide = "<spam style='display:none;'>%0%</spam>";
		try { valHide = valHide.replace('%0%', moment(valData).format('Y-MM-DD')); } catch(e) { }

		if (valData == '') {
			valData = option.default || '';
		} else {
			valData = moment(valData).format(
				eval(`option.dateFormat.format${ typeof(option.dateFormat.format) == 'string' ? '' : '(data, option, indice)' }`)
			)
		}
		val = valHide + valData;
	}
	else { 
		val = valData || option.default || '';
	}

	return mask.replace(/%0%/g, val);
}

function resolveClick(data, objClick, indice) { 
	let html = objClick.desc;
	if ( Object.keys(objClick.val)[0] != '0' ) objClick.val = [objClick.val];

	(objClick.val || []).forEach((val, i) => { 
		html = html.replace( new RegExp('%'+i+'%', 'gi'), ((val.index || '') != '' ? indice : data[val.attr]) );
	});
	return html;
}

function resolveParam(data, format, options) { 
	var param = '', val = '', valIf = '', cont = 0, 
		setIf, setIfFunc, isTrueValid, isTrue, exclamacao, notSet;

	for (var i = 0; i < data.length; i++) { 
		val = format;
		setIf = true;
		setIfFunc = true;

		for (var j = 0; j < (options.if || []).length; j++) { 

			// [ notSet ]
			if ((options.if[j].notSet || '') != '') { 
				notSet = options.if[j].notSet;
				exclamacao = notSet[0] == '!' ? (notSet = notSet.substring(1,notSet.length), true) : false;
				setIf = (data[i][notSet] || false) ? exclamacao : (exclamacao ? false : setIf);
			}

			// [ first ]
			if ((options.if[j].first || '') != '') { 
				valIf = options.if[j].first.split('?');
				valIf = cont == 0 ? valIf[0] : valIf[1];
			}

			// [ isTrue ]
			if ((options.if[j].isTrue || '') != '') { 

				isTrueValid = options.if[j].isTrue[0] == '!';
				if (isTrueValid) options.if[j].isTrue = options.if[j].isTrue.substring(1,options.if[j].isTrue.length);
				isTrue = (data[i][options.if[j].isTrue] || false);
				if (isTrueValid) isTrue = !isTrue;

				if ((options.if[j].setFunc || '') != '') { 
					setIfFunc = false;
					if (isTrue) { 
						val = resolveParamSetFunc(val, options.if[j], j);
						// val.replace(new RegExp('#'+j+'#', 'gi'), valIf);
					} else { 
						val = val.replace(new RegExp('#'+j, 'gi'), '');
						val = val.replace(new RegExp(j+'#', 'gi'), '');
					}
				} else { 
					valIf = options.if[j].set.split('?');
					valIf =  isTrue ? valIf[0] : valIf[1];
				}
				if (isTrueValid) options.if[j].isTrue = '!' + options.if[j].isTrue;
			}

			if (setIfFunc) val = val.replace(new RegExp('#'+j+'#', 'gi'), valIf);
			setIfFunc = true;
			valIf = '';
		}

		for (var j = 0; j < (options.val || []).length; j++) { 
			if ((options.val[j].default || '') != '') { 
				val = val.replace(new RegExp('%'+j+'%', 'gi'), resolveParamDefault(data[i], options.val[j]) );
			} else { 
				val = val.replace(new RegExp('%'+j+'%', 'gi'), data[i][options.val[j].attr] );
			}
		}
		val = setIf ? (cont++, val) : '';
		param += val;
	}
	return param;
}

// resolveParamSetFunc("#0param0#", {setFunc: 'teste'}, 0)
// resolveParamSetFunc("#0param0#", {setFunc: 'teste(123)'}, 0)
// resolveParamSetFunc("#0param0#", {setFunc: 'teste);'}, 0)
// resolveParamSetFunc("#0param0#", {setFunc: 'teste(123...456) ? "continua" : "ou não";'}, 0)
function resolveParamSetFunc(val, options, indice) { 
	// setFunc =  "func'('pre_param'...'pos_param')'pos_func"

	var pre_param = '', pos_param = '', 
		setFunc = options.setFunc, 
		isParamPre = false, isEtc = false, isParamPos = false;

	if (setFunc.indexOf('...') != -1) { 
		pre_param = setFunc.split('...')[0];
		setFunc = setFunc.split('...');
		setFunc.splice(0,1);
		pos_param = setFunc.join('');
		setFunc = '';
		isEtc = true;
	}
	else if (setFunc.indexOf('(') != -1) { 
		pre_param = setFunc.split('(')[0];
		setFunc = setFunc.split('(');
		setFunc.splice(0,1);
		setFunc = setFunc.join('');
		isParamPre = true;
	}
	
	if (!isEtc && setFunc.indexOf(')') != -1) { 
		if (isParamPre) pre_param += "(" + setFunc.split(')')[0];
		else 			pre_param += setFunc.split(')')[0] + "(";
		pos_param = setFunc.split(')')[1];
		isParamPos = true;
		// setFunc = setFunc.split(')');
		// setFunc.splice(0,1);
	}

	if (!isEtc && !isParamPre && !isParamPos) { 
		pre_param = setFunc + "(";
		pos_param = ")";
	}

	if (pre_param.indexOf('(') == -1) pre_param += '(';
	if (pos_param.indexOf(')') == -1) pos_param = ')' + pos_param;

	if (pre_param[pre_param.length-1] != '(' && pre_param[pre_param.length-1] != ',') pre_param += ",";
	if (pos_param[0] != ')' && pos_param[0] != ',') pos_param = ","+ pos_param;

	val = val.replace(new RegExp('#'+indice, 'gi'), pre_param);
	val = val.replace(new RegExp(indice+'#', 'gi'), pos_param);

	return val;
}

function resolveParamDefault(data, options) { 
	var val = '';

	if ((options.default || '') != '') { 
		switch(typeof(options.default)) { 
			case 'string': 
				val = (data[options.attr] || options.default);
				break;
			case 'object': 
				val = (data[options.attr] || resolveParamDefault(data, options.default));
				break;
		}
	} else {
		val = data[options.attr]
	}
	return val;
}

function invertPadination(defaultPag, length) { 
	var pag = [length];
	for (var i = defaultPag.length-1; i >= 0; i--) { 
		if (length <= defaultPag[i]) return (pag.push(length), pag);
		else pag.push(defaultPag[i]);
	}
	return pag;
}









/**************************************************************************************************************
 * Resolve Foot
 * ************************************************************************************************************/
function resolveFoot(data,option,defaultOption={}) { 
	/*
		option: 
		{
			op: 'SUM|MEDIA|expression|personalizado|literal' 	// expression = (ex: "%0% + n") | default: SUM

			val: { attr: 'PARAM', op: 'SUM|MEDIA' }				// OR
			val: [
				{
					attr: 'PARAM',								// attr a ser usado
					op: 'SUM|MEDIA' 							// em caso de expression pode resolver os valor de forma personalizada, default: SUM
				}
			]

			ignoreNull: (0|1) 									// para media vai ignorar os valores undfined na hora de divir, default: false
			mask: '%0%' 										// substiui o %0% pelo valor correspondentes e coloca o restante do texto, ex: (R$ %0% || %0% %)
		}
	*/
	let valPrint = '';

	if (['pesonalizado','personalizado'].indexOf(option.op || '') >= 0) 
		valPrint = resolveFootPersonalizado(data, option, defaultOption);
	else if ((option.op || '') == 'literal') 
		valPrint = (typeof(option.val) == 'string' ? option.val : '');
	else 
		valPrint = resolveFormatVal( resolveFootAction(data, option), option, defaultOption );

	return valPrint;
}

function resolveFormatVal(val, option, defaultOption={}) { 
	// let 	mask = (option.mask || (defaultOption.mask || '%0%'))
	let 	mask = (option.mask || '%0%')

	return formatMask( 
		number_format( val
			, (option.format?.casas || defaultOption.format?.casas 	||  0 )
			, (option.format?.dec 	|| defaultOption.format?.dec 	|| ',')
			, (option.format?.mili 	|| defaultOption.format?.mili 	|| '.')
		), mask
	)
}

function resolveFootAction(data, option, defaultOption={}) { 
	let val = [], newOption;

	if (['SUM',''].indexOf((option.op || '').toUpperCase()) != -1) 	return resolveSumNull(data, option);
	if (option.op.toUpperCase() == 'MEDIA') 						return resolveFootMedia(data, option);
 
	if ((option.val || '') == '') option.val = [{ attr: defaultOption.param }];
	if ((option.val.attr || '') != '') option.val = [option.val];

	for (var i = 0; i < option.val.length; i++) { 
		newOption = $.extend({}, option, { val: { attr: option.val[i].attr }, op: (option.val[i].op || '') })
		val.push( resolveFootAction(data, newOption, defaultOption) );
	}
	return resolveExpression(val, option.op);
}

function resolveFootPersonalizado(data, option, defaultOption={}) { 
	/*
		Quando a op do obj foot for igual a personalizado
		option: {
			mask: '%0%',
			val: [
				{ option foot convencional }
			]
		}
	*/
	var val = (option.mask || '%0%');

	for (var i = 0; i < option.val.length; i++) 
		val = val.replace(
			new RegExp('%'+i+'%', 'gi'),
			resolveFoot( data, option.val[i], defaultOption )
		);

	return val;
}

function formatMask(val, mask) { 
	return mask.replace(/%0%/g, val);
}

function resolveExpression(vals, ex) { 
	vals.forEach((val, i) => { 
		ex = ex.replace( new RegExp('%'+String(i)+'%', 'gi'), String(val) );
	});
	return eval(ex);
}

function resolveSumNull(data, option, type='val') { 
	var val = 0, nulls = 0, attrs = resolvAttrArray(option);
	data.forEach((dt) => { 
		attrs.forEach((attr) => { 
			val += parseFloat((dt[attr] || 0));
			if (dt[attr] != 0 && (dt[attr] || '') == '') nulls++;
		});
	});
	return type == 'val' ? val : { val, nulls };
}

function resolveFootMedia(data, option) { 
	let { val , nulls } = resolveSumNull(data, option, 'obj')
	, 	numRows = data.length;
	if ((option.ignoreNull || false)) numRows -= nulls;
	return numRows == 0 ? 0 : val / numRows;
}

function resolvAttrArray(option) { 
	var attr = [];
	if ((option.val.attr || '') != '') 				attr.push(option.val.attr);
	else {
		for (var i = 0; i < option.val.length; i++) attr.push(option.val[i].attr);
	}
	return attr;
}
/*
Testes: 

// output: 17.5 § 2.875
resolveFoot([{v1:1,v2:6},{v1:2,v2:7},{v1:3,v2:8},{v1:4,v2:9},{v1:5,v2:10}],
	{ op: '100 / %1% + %0%', val: [{attr:'v1'},{attr:'v2'}] }
	// op: '%0% + 100 / %1%',
)

// output: 37.5
resolveFoot([{v1:1,v2:6},{v1:2,v2:7},{v1:3,v2:8},{v1:4,v2:9},{v1:5,v2:10}],
	{ op: '%0% * 100 / %1%', val: [ { attr: 'v1' } , { attr: 'v2' } ] }
)

// output: 15
resolveFoot([{v1:1,v2:6},{v1:2,v2:7},{v1:3,v2:8},{v1:4,v2:9},{v1:5,v2:10}],
	{ val: { attr: 'v1' } }
)

// output: 3
resolveFoot([{v:1},{v:2},{v:3},{v:4},{v:5}],{ op: 'MEDIA', val: { attr: 'v' } })

// output: 15
resolveFoot([{v:1},{v:2},{v:3},{v:4},{v:5}],{ op: 'SUM', val: { attr: 'v' } })
*/
/**************************************************************************************************************
 * Resolve Foot
 * ************************************************************************************************************/
