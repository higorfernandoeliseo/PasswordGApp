

/*

    Copyright (c) Igor F Eliseo.

    01000011 01101111 01110000 01111001 01110010 01101001 01100111 01101000 01110100 00100000 00101000 01100011 00101001 00100000 01001001 01100111 01101111 01110010 00100000 01000110 00100000 01000101 01101100 01101001 01110011 01100101 01101111 00101110

*/

const dateNow = new Date();
const aboutappText = document.querySelector('#aboutapp');
const checkBoxesRd = document.getElementsByName('chkSelections');

const SenhaOutput = document.querySelector('#passwordSaida');
const btnCopiar = document.querySelector('#btnCopiar');

const btnRdnPassword = document.querySelector('#btnAleatorio');
const btnPhasePassword = document.querySelector('#btnPassPhase');
const btnPinPassword = document.querySelector('#btnPin');

const divRdnControl = document.querySelector('.mode-random');
const divPinControl = document.querySelector('.mode-pin');
const divPhaseControl = document.querySelector('.mode-phasepass');

const btnGerar = document.querySelector('#btnGerar');

let config = obterDados_ModoRandom();
let dicionario = [];
let idiomaAtualcache = 'en';
let modo = "random";
let intervalPasswd = 0

function onWindowClose() {
    Neutralino.app.exit();
}

// Initialize Neutralino
Neutralino.init();

Neutralino.window.setIcon('resources/icons/appIcon.png');

// Register event listeners
Neutralino.events.on("windowClose", onWindowClose);

function sortearIndice(max) {

    if(max <=0 || max > 0x100000000) {
        return 0;
    }

    const limite = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    let num;

    do {
        crypto.getRandomValues(buffer);
        num = buffer[0];
    } while(num >= limite);

    return num % max;

}

function embaralhar(arr) {

    for(let i = arr.length - 1; i > 0; i--) {
        const j = sortearIndice(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;

}


function UpperCaseWord(word) {

    let capitalize = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    return capitalize

}

async function lerDicionario(idioma) {
    
    if (dicionario.length > 0 && idiomaAtualcache == idioma) {
        return dicionario;
    }
    
    dicionario = [];

    const caminho = idioma === 'pt-br' ? './assets/db/dicionario_ptbr.json' : './assets/db/dicionario.json';

    try{
        const lerDict = await fetch(caminho);
        if(!lerDict.ok) throw new Error("Arquivo não encontrado!");
        dicionario = await lerDict.json();
        idiomaAtualcache = idioma;
        return dicionario;
    }catch(erro){
        console.error(erro);
    }

}


function obterDados_ModoRandom() {
    return {
        Comprimento: parseInt(document.querySelector('#tamanhoSenha').value),
        IncluirNums: document.querySelector('#includeNumbers').checked,
        IncluirSymb: document.querySelector('#includeSymbols').checked,
        IncluirUpper: document.querySelector('#includeUppercase').checked,
        IncluirLower: document.querySelector('#includeLowerCase').checked,
        evitarAmbiguos: document.querySelector('#evitarAmbiguos').checked
    }
}

function obterDados_ModoPin() {
    return {
        ComprimentoPin: parseInt(document.querySelector('#tamPínPass').value)
    }
}

function obterDados_ModoPhase() {
    return {
        ComprimentoPhase: parseInt(document.querySelector('#tamPhasePass').value),
        getPhasePortugues: document.querySelector('#getPhasePortugues').checked,
        captalizeWords: document.querySelector('#captalizeWords').checked,
        incsNumbs: document.querySelector('#incNumbs').checked
    }
}

//Função responsável por remover caracteres ambiguos da senha antes gerar a senha de fato.
const removeAmbiguos = (chars) => {
    return chars.replace(/[0O1lI]/gi, "");
}

function entropyAlgorithm(lengthChars, r) {

    let entropy = Math.floor(lengthChars * Math.log2(r));

    if(entropy <= 0) {
        return `Força da senha: Invalida (${entropy} bits)`;
    }else if(entropy < 36) {
        return `Força da senha: Extremamente Fraca (${entropy} bits)`;
    }else if(entropy < 60){
        return `Força da senha: Fraca (${entropy} bits)`;
    }else if(entropy < 120){
        return `Força da senha: Forte (${entropy} bits)`;
    }else{
        return `Força da senha: Muito Forte (${entropy} bits)`;
    }

}

function gerarSenhaAleatoria() {

    let letras = "";

    let senha = [];

    // simbolos = 26
    // letras min = 26
    // letras maius = 26
    // numeros = 10

    const ListaCaracteres = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '!@#$%^&*()_+-=[]{};:,.<>/?'
    ];

	intervalPasswd = 0;

    if(config.Comprimento < ListaCaracteres.length) {
        console.log(`O tamanho minimo deve ser de ${ListaCaracteres.length} caracteres`);
    }

    for(const lista of ListaCaracteres) {
        senha.push(lista.charAt(sortearIndice(lista.length)));
    }

    if(config.IncluirNums === true)
        letras += ListaCaracteres[2];
        intervalPasswd += 10
	
    if(config.IncluirSymb === true)
        letras += ListaCaracteres[3];
        intervalPasswd += 32
		
    
    if(config.IncluirUpper === true)
        letras += ListaCaracteres[0];
        intervalPasswd += 26
   
	
    if(config.IncluirLower === true)
        letras += ListaCaracteres[1];
        intervalPasswd += 26

        
    if (config.evitarAmbiguos) 
        letras = removeAmbiguos(letras); 
    
    const faltam = config.Comprimento - senha.length;

    //const aleatorio = new Uint32Array(faltam);
    //window.crypto.getRandomValues(aleatorio);

    for(let i = 0; i < faltam; i++) {
        //const indice = aleatorio[i] % letras.length; 
        senha.push(letras.charAt(sortearIndice(letras.length)));
    }

    embaralhar(senha);

    return senha.join('');

}

function gerarPin(tamanho) {

    let pin = "";

    const aleatorio = new Uint8Array(1);

    while(pin.length < tamanho) {
        const valor = crypto.getRandomValues(aleatorio)[0];
        if(valor < 250) {
            pin += (valor % 10).toString();
        }
    }

    return pin;

}


//gerarPin();

 async function gerarPhasepass() {

    let phasepass = [];

    const aleatorio = new Uint32Array(config.ComprimentoPhase);

    window.crypto.getRandomValues(aleatorio);

    const idioma = config.getPhasePortugues === true ? 'pt-br' : 'en';

    dicionario = await lerDicionario(idioma);
    idiomaAtualcache = idioma;


    if(config.captalizeWords === true && config.incsNumbs === true){
       for(let i = 0; i < config.ComprimentoPhase; i++) {
            const indice = aleatorio[i] % dicionario.length;

            const j = aleatorio[i] % 10;

            phasepass.push(UpperCaseWord(dicionario[indice]+j));
        } 
    }else if(config.captalizeWords === true){
        for(let i = 0; i < config.ComprimentoPhase; i++) {
            const indice = aleatorio[i] % dicionario.length;
            phasepass.push(UpperCaseWord(dicionario[indice]));
        }
    }else if(config.incsNumbs === true){
        for(let i = 0; i < config.ComprimentoPhase; i++) {

            const indice = aleatorio[i] % dicionario.length;

            const j = aleatorio[i] % 10;

            phasepass.push(dicionario[indice]+j);
        }
    }else{
        for(let i = 0; i < config.ComprimentoPhase; i++) {
            const indice = aleatorio[i] % dicionario.length;
            phasepass.push(dicionario[indice]);
        }
    }

    embaralhar(phasepass);

    return phasepass.join('-');

}


async function gerarHandle() {
    let resultado = "";

    if(modo === 'random'){
        resultado = gerarSenhaAleatoria();
    }else if(modo === 'pin'){
        resultado = gerarPin(config.ComprimentoPin);
    }else{
        resultado = await gerarPhasepass();
    }

    return resultado;

}


function testarForca(senha) {

    let forca = 0;

    if(senha.length > 8) forca++;
    if(senha.length > 12) forca++;
    if(/[A-Z]/.test(senha)) forca++;
    if(/[0-9]/.test(senha)) forca++;
    if(/[^A-Za-z0-9]/.test(senha)) forca++;

    return Math.min(forca, 4);

}

function gerarBarra(senha) {
    const nivel = testarForca(senha);
    const barra = document.querySelector('#barraForca');
    const cores = ['#ff4d4d','#ff4d4d','#ffa500','#ffd700','#2ecc71'];
    const larguras = ['0%','25%','50%','75%','100%']

    barra.style.width = larguras[nivel];
    barra.style.backgroundColor = cores[nivel];
}

let nameappVer = document.createElement('p');



async function copiarAreaClipboard() {

    const senha = SenhaOutput.value;

    if(!senha) return;


    try {

        await Neutralino.clipboard.writeText(senha);

        const senhaOriginal = senha;
        SenhaOutput.value = 'Copiado!';

        setTimeout(async() => {
            SenhaOutput.value = senhaOriginal;
        }, 1500);

        setTimeout(async() => {
            const atual = await Neutralino.clipboard.readText();
            if(senha === atual){
                await Neutralino.clipboard.writeText("");
            }
        }, 30000);

    }catch(error){
        console.error('Falha ao copiar!', error);
        SenhaOutput.value = 'Falha ao copiar';
        setTimeout(()=> {
            SenhaOutput.value = senha;
        },2000)
    }

}

document.querySelectorAll('.config-options').forEach((item) => {
    item.addEventListener('change', () => {
        config = obterDados_ModoRandom();
        let output = gerarHandle();
        SenhaOutput.value = output
    })
});

document.querySelectorAll('.config-pin-options').forEach((item) => {
    item.addEventListener('change', async() => {
        config = obterDados_ModoPin();
        let output = await gerarHandle();
        SenhaOutput.value = output
    })
});

document.querySelectorAll('.config-phase-options').forEach((item) => {
    item.addEventListener('change', async() => {
        config = obterDados_ModoPhase();
        let output = await gerarHandle();
        SenhaOutput.value = output
    })
});

btnGerar.addEventListener('click', async() => {
    let output = await gerarHandle();
	
	
    const barra = document.querySelector('#barraForca');
    SenhaOutput.value = output
    gerarBarra(output)

    if(modo === 'random') {
        const entr = entropyAlgorithm(output.length, intervalPasswd)
        barra.setAttribute('title', entr);
    }else if(modo === 'pin'){
        barra.style.width = '0px';
    }else{
        const entr = entropyAlgorithm(config.ComprimentoPhase, dicionario.length)

        barra.setAttribute('title', entr);
    }

});

btnCopiar.addEventListener('click', () => {
    copiarAreaClipboard();
});

btnRdnPassword.addEventListener('click', () => {

    const barra = document.querySelector('#barraForca');
    barra.style.width = '0px';

    modo = 'random';
    config = obterDados_ModoRandom();
    SenhaOutput.value = '';

    btnRdnPassword.classList.add('active');
    btnPinPassword.classList.remove('active');
    btnPhasePassword.classList.remove('active');
    divRdnControl.style.display = 'block';
    divPhaseControl.style.display = 'none';
    divPinControl.style.display = 'none';
});

btnPinPassword.addEventListener('click', () => {

    const barra = document.querySelector('#barraForca');
    barra.style.width = '0px';

    modo = 'pin';
    config = obterDados_ModoPin();
    SenhaOutput.value = '';

    btnRdnPassword.classList.remove('active');
    btnPinPassword.classList.add('active');
    btnPhasePassword.classList.remove('active');
    divRdnControl.style.display = 'none';
    divPinControl.style.display = 'block';
    divPhaseControl.style.display = 'none';
});

btnPhasePassword.addEventListener('click', () => {

    const barra = document.querySelector('#barraForca');

    modo = 'phasepass';
    config = obterDados_ModoPhase();
    SenhaOutput.value = '';
    barra.style.width = '0px';

    btnRdnPassword.classList.remove('active');
    btnPinPassword.classList.remove('active');
    btnPhasePassword.classList.add('active');
    divRdnControl.style.display = 'none';
    divPinControl.style.display = 'none';
    divPhaseControl.style.display = 'block';
});

nameappVer.innerHTML = `&copy; ${dateNow.getFullYear()} FerlOps Tecnologia.`;

aboutappText.appendChild(nameappVer);

