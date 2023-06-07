var MAX_AUGMENT = 50;

var bp = 0;
var goal = 0;
var chances = 5;
var baseXp = 0;
var expForLevel = 0;

//Probability of augmenting from (level-1) to level
p = function p(level) { 
	var res = Math.pow(bp,Math.pow(level,1.25)) + chances/100;
	if(res>1) res=1;
	return(res);
}

//Probability of augmenting from startLevel to endLevel
cp = function cp(endLevel, startLevel) {
	if(startLevel>0) return cp(endLevel)/cp(startLevel);

	var res=1;
	for (var i = 1; i <= endLevel; i++) {
		res*= p(i);
	}
	return(res);
} 

//Xp gained by agumenting to a given level
function xpGain(level){
	return Math.pow(level,1.25) * baseXp;
}

//Xp gained by augmenting from startLevel to endLevel (if successful)
function cXpGain(endLevel, startLevel){
	if(startLevel === undefined) startLevel = 0;

	var res = 0;
	for (var i = startLevel+1; i < endLevel; i++) {
		res += xpGain(i);
	}
	res += xpGain(endLevel)/2; //Assuming the final augment fails, i.e. gives half xp
	return res;
}

function output(number, value){
	document.getElementById("o"+number).innerHTML = value;
}

function input(name) {
	try{
		var res = document.getElementById(name).value;
		res = res.toLowerCase();
		res = res.replace(/k/g,"000");
		res = res.replace(/m/g,"000000");
		res = res.replace(/b/g,"000000000");
		console.log(res);
		var value = eval(res);
		if(isNaN(value)) {
			value=0;
			document.getElementById(name).style="color:#8be9fd";
		}
		else document.getElementById(name).style="color:#8be9fd";
		return(value);	
	} catch(err){
		document.getElementById(name).style="color:#8be9fd";
		return 0;
	}	
}

function updateFields() {
	enchantingLevel = input("enchantingLevel");
	masteryLevel = input("masteryLevel");
	bookLevel = input("bookLevel");
	effectiveLevel = enchantingLevel + masteryLevel + bookLevel;
	bp = 0.9 + (Math.sqrt(effectiveLevel * 1.5) / 203);
	goal = input("goal");
	baseXp = input("xp");
	expForLevel = input("expForLevel");
	amount1 = input("amount1");
	amount2 = input("amount2");
	amount3 = input("amount3");
	amount4 = input("amount4");
	amount5 = input("amount5");
	amount6 = input("amount6");
	amount7 = input("amount7");
	amount8 = input("amount8");
	material1 = input("material1");
	material2 = input("material2");
	material3 = input("material3");
	material4 = input("material4");
	material5 = input("material5");
	material6 = input("material6");
	material7 = input("material7");
	material8 = input("material8");
	t1o = input("t1o");
	t2o = input("t2o");
	t3o = input("t3o");
	t4o = input("t4o");
	t5o = input("t5o");
	t6o = input("t6o");
	t7o = input("t7o");
	t8o = input("t8o");
	

	//Deal with weird inputs
	if(bp>1) bp/=100;
	if(goal>1000){
		if(goal>Math.pow(10,10)) alert("Nope.")
		else if(goal>1000000) alert("I'm not running any of this.")
		else alert("For the sake of your computer, please stop.");
		return;
	}

	averageWaste = 0;
	for (var i = 1; i <= goal; i++) {
		averageWaste+= i*(cp(i-1)*(1-p(i)));
	}
	successChance = cp(goal);

	document.getElementById("o1").innerHTML = ""+Math.round((goal+averageWaste/successChance)*100)/100;  //output(1, goal+averageWaste/successChance);
	document.getElementById("o2").innerHTML = ""+Math.round((1/successChance)*100)/100;  //output(2, 1/successChance);
	document.getElementById("o3").innerHTML = ""+Math.round((successChance*100)*100)/100+"%";  //output(3, (successChance*100)+"%");

	avrAugs = 0;
	avrXp = 0;
	for (var i = 1; i <= MAX_AUGMENT; i++) {
		avrAugs+= i*(cp(i-1))*(1-p(i));
		avrXp+= cp(i-1)*(1-p(i)) * cXpGain(i);
	}
	
	document.getElementById("effectiveLevel").innerHTML = "Effective Level: "+effectiveLevel;
	document.getElementById("o4").innerHTML = ""+Math.round(avrAugs*100)/100;
	document.getElementById("o5").innerHTML = ""+numberWithSpaces(Math.round(avrXp*100)/100);
	document.getElementById("o6").innerHTML = ""+numberWithSpaces(Math.round((avrXp/avrAugs)*100)/100);
	document.getElementById("o7").innerHTML = ""+Math.round((expForLevel/avrXp)*100)/100+".";
	document.getElementById("o8").innerHTML = ""+numberWithSpaces(Math.round(avrAugs*(expForLevel/avrXp)*100)/100);
	document.getElementById("t1o").innerHTML = " "+numberWithSpaces(amount1*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material1").value;
	document.getElementById("t2o").innerHTML = " "+numberWithSpaces(amount2*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material2").value;
	document.getElementById("t3o").innerHTML = " "+numberWithSpaces(amount3*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material3").value;
	document.getElementById("t4o").innerHTML = " "+numberWithSpaces(amount4*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material4").value;
	document.getElementById("t5o").innerHTML = " "+numberWithSpaces(amount5*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material5").value;
	document.getElementById("t6o").innerHTML = " "+numberWithSpaces(amount6*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material6").value;
	document.getElementById("t7o").innerHTML = " "+numberWithSpaces(amount7*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material7").value;
	document.getElementById("t8o").innerHTML = " "+numberWithSpaces(amount8*(Math.ceil(avrAugs*(expForLevel/avrXp))))+" "+document.getElementById("material8").value;
}

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function alphaOnly(event) {
  var key = event.keyCode;
  return ((key >= 65 && key <= 90) || key == 8 || key == 32);
};
//Update everything on any keypress or clicking a combobox.
window.addEventListener("keyup", function (event) {
  updateFields();
});
window.addEventListener("click", function (event) {
  updateFields();
});

//Finally run an update after everything has loaded.
updateFields();
