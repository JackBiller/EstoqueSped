
var isMobile_Global = false, userAgent = String(navigator.userAgent).toUpperCase(), plataformasMobile = ['ANDROID','IOS'];
for (var i = 0; i < plataformasMobile.length; i++) if (userAgent.indexOf(plataformasMobile[i]) != -1) isMobile_Global = true;

var objParamGrade_Global = {
	tamanhoFont: 12,
	fontFamily: 'NomeDaFont',

	// Config Table
	classTable: 		'table table-bordered stripe table-hover table-condensed table-responsive backTeste', // table-striped
	titleTableBgColor: 	'#D5DEE3', 	// '#981818',
	titleTableColor: 	'black',
	titleTableWeight: 	'bold',		// 'bold',
	headTableBgColor: 	'#D5DEE3', 	// '#c52e32',
	headTableColor: 	'black',
	headTableWeight: 	'bold',		// 'normal',
	footTableBgColor: 	'#D5DEE3', 	// '#e74f54',
	footTableColor: 	'black',
	footTableWeight: 	'bold',		// 'normal',
	// stripTableColors: 	[{bgcolor:'#E8E8E8'},{bgcolor:'#c0c0c0'}],
	stripTableColors: 	[{bgcolor:'white'}],
	hoverTrTableColor: 	'lightblue',
	// stripTableColors: 	[{bgcolor:'lightgreen'},{bgcolor:'cadetblue'}],
	padination: 		[15,25],

	// Cofig plataforma
	isMobile_Global: 	isMobile_Global,
	// stripTableColors: [{bgcolor:'tomato'},{bgcolor:'mediumseagreen'}],
	no_scrollX: 		true,
	languageJson: 		'./js/Portuguese.json'
}

function number_format(num, numDec, decimal=',', milhar='.') { 
	if (num != 0 && ((num || '') == '' || isNaN(num))) 	return num;
	try { num = parseFloat(num); } catch(erro){ 		return num; }
	num = num.toFixed(numDec);
	var formNum = num.split('.'), cont = 0;
	num = String(formNum[0]);
	var negativo = num[0] == '-' ? (num = num.substring(1, num.length), true) : false;
	decimal = ((formNum[1] || '') != '' ? decimal + String(formNum[1]) : '');
	formNum = '';
	for (var i = num.length-1; i >= 0; i--) {
		formNum = num[i] + formNum;
		if((cont++, cont) % 3 == 0 && i > 0) formNum = milhar + formNum;
	}
	return (negativo ? '-' : '') + formNum + decimal;
}