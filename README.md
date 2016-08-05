# Spotippos Code Challenge

Implementação do desafio [VivaReal Code Challenge](https://github.com/VivaReal/code-challenge)

## Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Execução local

Para executar localmente a aplicação, basta clonar o repositório e executar, na raíz do projeto: `npm start`

## API

A API foi implementada de acordo com a especificação do [desafio de back-end](https://github.com/VivaReal/code-challenge/blob/master/backend.md). Como solução simples para uma futura necessidade de versionamento foi decidido adicionar o prefixo `/v1` em todos os end-points. Desta forma, as operações suportadas respondem nos seguintes end-points:

* Criar imóvel em Spotippos: `POST /v1/properties`
* Mostrar imóvel específico: `GET /v1/properties/{id}`
* Buscar imóveis por área: `GET /v1/properties?ax={integer}&ay={integer}&bx={integer}&by={integer}`

## Tecnologias

* Node.js
* Restify
* Mongoose
* Mongo DB
* Swagger