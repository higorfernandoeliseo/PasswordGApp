# ferlOps PasswordG

Gerador de senhas e passphrases seguro, leve e 100% client-side construído com **Neutralino.js**.

## Funcionalidades

- **Geração customizável:** ajuste de comprimento e inclusão/exclusão de maiúsculas, minúsculas, números, símbolos.
- **Modo Passphrase:** geração de frases-senha baseadas em lista de palavras (`dicionario.json`).
- **100% offline e client-side:**  nenhuma senha é salva, registrada em log ou enviada pela rede.
- **Cópia rápida com limpeza automática:** copia para a área de transferência e limpa automaticamente após alguns segundos.

## Como Usar

### Pré-requisitos
- [Node.js](https://nodejs.org/)
- **Neutralino.js CLI** (`@neutralinojs/neu`)

### Rodar em desenvolvimento
1. Clone o repositório e acesse a pasta do aplicativo:
```bash
git clone https://github.com/higorfernandoeliseo/passwordGApp.git
cd passwordGApp/app

# baixar o Neutralino.js CLI antes de executar ou construir

npm install -g @neutralinojs/neu

# baixe os binários e o cliente

neu update

# para iniciar o aplicativo

neu run

# para construir (Build) Dentro da pasta `app/`, execute:

neu build

```

Os arquivos de distribuição serão gerados na pasta `app/dist/`.

## Estrutura do Projeto

```
passwordGApp
         ├── LICENSE                                                    # Licença do projeto
         ├── README.md                                                  # Documentação
         └── app
               ├── neutralino.config.json
               └── resources
                       ├── index.html                                   # Estrutura principal da interface
                       ├── assets/                       
                       ├── css/
                       │    ├── lucide.css
                       │    ├── styles.css                              # Estilização e responsividade
                       │    └── fonts/
                       │           ├── Inter-Bold.woff2
                       │           ├── Inter-Medium.woff2
                       │           ├── Inter-Regular.woff2
                       │           ├── lineicons-free-solid.ttf
                       │           ├── lineicons-free-solid.woff
                       │           ├── lineicons-free-solid.woff2
                       │           ├── lucide.svg
                       │           ├── lucide.ttf
                       │           ├── lucide.woff
                       │           └── lucide.woff2
                       │     
                       ├── db/
                       │    └── dicionario.json                         # Lista de palavras para geração de passphrases
                       ├── images/
                       │     └── logo-top-banner.webp
                       ├── js/ 
                       │    ├── main.js                                 # Motor de geração criptográfica (Web Crypto API, Diceware, entropia em bits e a Classificação de força).
                       │
                       │    ├── neutralino.d.ts
                       │    └── neutralino.js
                       └── icons
                             ├── appIcon.ico                             # Ícone principal do aplicativo
                             ├── appIcon.png
                             ├── logo.gif
                             └── trayIcon.png



```

## Licença e Créditos

Distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Desenvolvido por Igor Eliseo - ferlOps Tecnologia.


Consulte [SECURITY.md](SECURITY.md) para detalhes sobre a arquitetura criptográfica e politica de segurança.