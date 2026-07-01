

/*

    Copyright (c) Igor F Eliseo.

    01000011 01101111 01110000 01111001 01110010 01101001 01100111 01101000 01110100 00100000 00101000 01100011 00101001 00100000 01001001 01100111 01101111 01110010 00100000 01000110 00100000 01000101 01101100 01101001 01110011 01100101 01101111 00101110

*/


const dateNow = new Date();
const aboutappText = document.querySelector('#aboutapp');
const checkBoxesRd = document.getElementsByName('chkSelections');
const btnGerar = document.querySelector('#btnGerar');
const SenhaOutput = document.querySelector('#passwordSaida');
const btnCopiar = document.querySelector('#btnCopiar');
const btnRdnPassword = document.querySelector('#btnAleatorio');
const btnPhasePassword = document.querySelector('#btnPassPhase');
const divRdnControl = document.querySelector('.mode-random');
const divPhaseControl = document.querySelector('.mode-phasepass');

let config = obterDados_ModoRandom();
let dicionario = [];
let modo = "random";

function onWindowClose() {
    Neutralino.app.exit();
}

// Initialize Neutralino
Neutralino.init();

Neutralino.window.setIcon('resources/icons/appIcon.png');

// Register event listeners
Neutralino.events.on("windowClose", onWindowClose);

function UpperCaseWord(word) {

    let capitalize = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    return capitalize

}

async function lerDicionario() {

    const caminho = `./assets/db/dicionario.json`;

    try{
        const lerDict = await fetch(caminho);
        //const lerDict = await Neutralino.filesystem.readFile('assets/db/dicionario.json');
        if(!lerDict.ok) throw new Error("Arquivo não encontrado!");
        dicionario = await lerDict.json();
    }catch(erro){
        console.error(erro);
    }

}

lerDicionario()

function obterDados_ModoRandom() {
    return {
        Comprimento: parseInt(document.querySelector('#tamanhoSenha').value),
        IncluirNums: document.querySelector('#includeNumbers').checked,
        IncluirSymb: document.querySelector('#includeSymbols').checked,
        IncluirUpper: document.querySelector('#includeUppercase').checked,
        IncluirLower: document.querySelector('#includeLowerCase').checked
    }
}

function obterDados_ModoPhase() {
    return {
        ComprimentoPhase: parseInt(document.querySelector('#tamPhasePass').value),
        captalizeWords: document.querySelector('#captalizeWords').checked,
        incsNumbs: document.querySelector('#incNumbs').checked
    }
}

function gerarSenhaAleatoria() {

    let letras = "";
    let password = "";

    const ListaCaracteres = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '!@#$%^&*()_+-=[]{};:,.<>/?'
    ];

    if(config.IncluirNums === true)
        letras += ListaCaracteres[2];
    
    if(config.IncluirSymb === true)
        letras += ListaCaracteres[3];
    
    if(config.IncluirUpper === true)
        letras += ListaCaracteres[0];
    
    if(config.IncluirLower === true)
        letras += ListaCaracteres[1];

    const aleatorio = new Uint32Array(config.Comprimento);

    window.crypto.getRandomValues(aleatorio);

    for(let i = 0; i < config.Comprimento; i++) {
        const indice = aleatorio[i] % letras.length; 
        password += letras.charAt(indice);
    }

    return password;

}

function gerarPhasepass() {

    let phasepass = [];
    let password = "";

    const aleatorio = new Uint32Array(config.ComprimentoPhase);

    window.crypto.getRandomValues(aleatorio);

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

    return phasepass.join('-');

}

function gerarHandle() {
    let resultado = "";



    if(modo === 'random'){
        resultado = gerarSenhaAleatoria();
    }else{
        resultado = gerarPhasepass();
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
        gerarBarra(output)
    })
});

document.querySelectorAll('.config-phase-options').forEach((item) => {
    item.addEventListener('change', () => {
        config = obterDados_ModoPhase();
        let output = gerarHandle();
        SenhaOutput.value = output
        gerarBarra(output)
    })
});

btnGerar.addEventListener('click', () => {
    let output = gerarHandle();
    SenhaOutput.value = output
    gerarBarra(output)
});

btnCopiar.addEventListener('click', () => {
    copiarAreaClipboard();
});

btnRdnPassword.addEventListener('click', () => {

    modo = 'random';
    config = obterDados_ModoRandom();

    btnRdnPassword.classList.add('active');
    btnPhasePassword.classList.remove('active');
    divRdnControl.style.display = 'block';
    divPhaseControl.style.display = 'none';
});

btnPhasePassword.addEventListener('click', () => {

    modo = 'phasepass';
    config = obterDados_ModoPhase();

    btnRdnPassword.classList.remove('active');
    btnPhasePassword.classList.add('active');
    divRdnControl.style.display = 'none';
    divPhaseControl.style.display = 'block';
});

nameappVer.innerHTML = `&copy; ${dateNow.getFullYear()} FerlOps Tecnologia.`;

aboutappText.appendChild(nameappVer);


// async function gerarDicionario() {

//     try {
//         const rawdata = await Neutralino.filesystem.readFile('./eff_large_wordlist.txt');

//         //const linhas = rawdata.split('\n');

//         const linhas = rawdata.split('\n')
        
//         // const mapa = linhas.filter((linha) => {
//         //     if(linha.trim() !== ''){
//         //         linha.split('\t')[1]
//         //     }
//         // }

//         const palavras = linhas.map((linha) => {
//             const colunas = linha.split('\t');
//             return colunas[1] ? colunas[1].trim() : '';
//         }).filter(palavra => palavra !== '');

//         await Neutralino.filesystem.writeFile('dicionario.json', JSON.stringify(palavras, null, 2));

//     } catch (error) {
//         console.error('codigo de erro: ', error.code);
//         console.error('mensagem de erro: ', error.message);
//     }

// }
