

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
let intervalPasswd = 0;

const versionNum = { MAJOR: 1, MINOR: 1, PATCH: 6};

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
        ComprimentoPin: parseInt(document.querySelector('#tamPinPass').value)
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

    // simbolos = 32
    // letras min = 26
    // letras maius = 26
    // numeros = 10


    const conjuntos = [
        { ativo: config.IncluirUpper, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
        { ativo: config.IncluirLower, chars: 'abcdefghijklmnopqrstuvwxyz' },
        { ativo: config.IncluirNums, chars: '0123456789' },
        { ativo: config.IncluirSymb, chars: '!@#$%^&*()_+-=[]{};:,.<>/?~`|\\"\'' }
    ];

	intervalPasswd = 0;

    for(const item of conjuntos) {
        if(item.ativo) {
            let charsFiltrados = config.evitarAmbiguos ? removeAmbiguos(item.chars) : item.chars;

            if(charsFiltrados.length > 0) {
                letras += charsFiltrados;
                intervalPasswd += charsFiltrados.length;
                senha.push(charsFiltrados.charAt(sortearIndice(charsFiltrados.length)));
            }
        }
    }

    if(letras.length === 0) {
        console.log(`O tamanho minimo deve ser de ${ListaCaracteres.length} caracteres`);
        return "";
    }

   
    
    const faltam = config.Comprimento - senha.length;

    for(let i = 0; i < faltam; i++) {
        senha.push(letras.charAt(sortearIndice(letras.length)));
    }

    return embaralhar(senha).join('');

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

    config = obterDados_ModoPhase();


    const idioma = config.getPhasePortugues === true ? 'pt-br' : 'en';

    dicionario = await lerDicionario(idioma);
    idiomaAtualcache = idioma;

    for(let i = 0; i < config.ComprimentoPhase; i++) {
        let palavra = dicionario[sortearIndice(dicionario.length)];

        if (config.captalizeWords) {
            palavra = UpperCaseWord(palavra);
        }

        if (config.incsNumbs) {
            palavra += sortearIndice(10);
        }

        phasepass.push(palavra);

    }


    return embaralhar(phasepass).join('-');

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


document.querySelectorAll('.config-options, .config-pin-options, .config-phase-options').forEach((item) => {
    item.addEventListener('change', atualizarSenha);
});

btnCopiar.addEventListener('click', () => {
    copiarAreaClipboard();
});


async function atualizarSenha() {

    if (modo === "random") config = obterDados_ModoRandom();
    else if (modo === "pin") config = obterDados_ModoPin();
    else config = obterDados_ModoPhase();

    let output = await gerarHandle();
    const divStatusForca = document.querySelector('.statusForca');
    divStatusForca.innerHTML = '';
    let textoForca = document.createElement('p');
    SenhaOutput.value = output;

    const barra = document.querySelector('#barraForca');
    
    if (modo === "pin") {
        barra.style.width = "0px";
        barra.setAttribute('title', entropyAlgorithm(output.length, 10));
        return;
    }
    
    gerarBarra(output);
    

    const r = (modo === "random") ? intervalPasswd : dicionario.length;
    const tamanho = (modo === "random") ? config.Comprimento : config.ComprimentoPhase;

    barra.setAttribute('title', entropyAlgorithm(tamanho, r));

    textoForca.textContent = entropyAlgorithm(tamanho, r);
    divStatusForca.appendChild(textoForca);


}

function alternarModo(modoAtivo, btnAtivo, abaAtiva) {

    modo = modoAtivo;

    const barra = document.querySelector('#barraForca');
    barra.style.width = "0px";

    [btnRdnPassword, btnPinPassword, btnPhasePassword].forEach(btn => btn.classList.remove('active'));
    [divRdnControl, divPinControl, divPhaseControl].forEach(div => div.style.display = 'none');

    btnAtivo.classList.add('active');
    abaAtiva.style.display = 'block';


    atualizarSenha();

}

btnGerar.addEventListener('click', async() => {
    atualizarSenha();
});

btnRdnPassword.addEventListener('click', () => alternarModo('random', btnRdnPassword, divRdnControl));
btnPinPassword.addEventListener('click', () => alternarModo('pin', btnPinPassword, divPinControl));
btnPhasePassword.addEventListener('click', () => alternarModo('phasepass', btnPhasePassword, divPhaseControl));

nameappVer.innerHTML = `Versão ${versionNum.MAJOR}.${versionNum.MINOR}.${versionNum.PATCH} - &copy; ${dateNow.getFullYear()} ferlOps Tecnologia.`;

aboutappText.appendChild(nameappVer);

