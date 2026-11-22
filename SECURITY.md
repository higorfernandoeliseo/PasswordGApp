# Política de Segurança - ferlOps PasswordG

## 1. Aleatoriedade e Geração

- **Fonte de entropia:** Todas as senhas e passphrases são geradas exclusivamente através da **Web Crypto API** (`window.crypto.getRandomValues()`) utilizando um CSPRNG fornecido pelo sistema operacional subjacente.
- **Ausência de `Math.random()`:** Nenhuma função matemática padrão não criptográfica (`Math.random()`) é utilizada no sorteio de caracteres ou palavras.


## 2. Cálculo de Entropia e Força

A força estimada da senha é calculada em bits com base no espaço de busca efetivo:

$$E = L \times \log_2(N)$$

**Senhas aleatórias:** $L$ representa o comprimento da senha e $N$ o tamanho total do alfabeto ativo (soma dos conjuntos selecionados: maiúsculas, minúsculas, números e símbolos).

**Passphrases (Diceware):** $L$ representa a quantidade de palavras sorteadas e $N$ o número total de entradas únicas disponíveis em `app/resources/db/dicionario.json`.

## 3. Privacidade e Área de Transferência

- **Execução 100% local:** Todo o processamento ocorre em memória na máquina do usuário.

- **Sem armazenamento persistente:** O aplicativo não grava senhas geradas em disco, banco de dados local ou arquivos de log.

- **Sem tráfego de rede:** Nenhuma senha, métrica de uso ou telemetria é transmitida para servidores externos.

- **Limpeza da área de transferência:** Ao copiar uma senha, o conteúdo é automaticamente sobrescrito/limpo após um intervalo curto de tempo para reduzir a exposição no histórico do sistema operacional.

## 4. Ambiente Desktop (Neutralino.js)

### 4.1 Permissões Nativas (Neutralino.js)

O aplicativo segue o princípio de menor privilégio no `app/neutralino.config.json`:
- Apenas as APIs nativas estritamente necessárias para a operação da interface e interação com a área de transferência (`clipboard`) são habilitadas na `nativeAllowList`.

- APIs de sistema de arquivos (`filesystem`), execução de processos (`os.execCommand`) ou rede externa não são utilizadas para manipular credenciais.

## 5. Escopo e Limitações (Threat Model)

O **ferlOps PasswordG** protege contra previsibilidade de senhas e vazamento de dados em trânsito ou em repouso pelo próprio aplicativo. Estão **fora do escopo** de proteção da aplicação:
- Sistemas operacionais previamente comprometidos por *keyloggers*, *malwares* ou acesso remoto não autorizado.
- Gerenciadores de históricos da área de transferência de terceiros ou sincronização em nuvem do clipboard ativada no sistema operacional do usuário.

## 6. Como Reportar Vulnerabilidade

Caso identifique qualquer falha de implementação criptográfica, viés na geração, vazamento de memória ou brecha nas permissões do aplicativo:

1. **Não abra uma issue pública** contendo detalhes exploráveis da falha.
2. Envie um relato privado diretamente para o mantenedor através da aba **Security > Advisories** deste repositório no GitHub.
3. Inclua, sempre que possível, os passos para reproduzir o comportamento, o trecho de código afetado (`app/resources/js/main.js`, `app/neutralino.config.json`, etc) e o impacto estimado.

As notificações serão analisadas com prioridade e corrigidas antes da divulgação pública.