# ecoleta-nlw
Projeto desenvolvido seguindo os cursos gratuitos da RocketSeat na primeira versão da #NextLevelWeek. O projeto tem como objetivo auxiliar empresas fictícias a se "divulgarem" para que pessoas possam  ir até elas depositar materiais que poderão ser utilizados posteriormente

O repositório segue a idéia de [Monorepo](https://www.atlassian.com/git/tutorials/monorepos) integrando [backend](https://github.com/hitk1/ecoleta-nlw/tree/master/backend), [frontend](https://github.com/hitk1/ecoleta-nlw/tree/master/frontend) e [mobile](https://github.com/hitk1/ecoleta-nlw/tree/master/backend) para facilitar a visualização dos projetos.

##Instalação
A instalação e configuração de cada projeto deverá ser feita individualmente (os projetos foram desenvolvido utilizando o [yarn](https://classic.yarnpkg.com/pt-BR/) certifique-se de ter instalado antes):

# Usabilidade

## Backend

Criando o banco de dados:

```bash
yarn knex:migrate
yarn knex:seed
```
Usando node para testes locais:
```bash
yarn dev
```

## Frontend (Web)
Depois de ter instalado todas as dependências do projeto basta executar:

```bash
yarn start
```

## Mobile
Depois de ter instalado as dependências do projeto basta executar:

```bash
yarn start
```

Como o mobile foi desenvolvido utilizando o [Expo](https://expo.io/), certifique-se de tê-lo instalado no seu dispositivo para poder ter acesso ao aplicativo.
Caso esteja utilizando um emulador, esperar até que a pagina do Expo esteja aberto no navegador e utilizar as opções  no menu lateral esquerdo
