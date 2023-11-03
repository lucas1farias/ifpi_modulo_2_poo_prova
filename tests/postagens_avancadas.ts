

import { PostagemAvancada } from "../cls/cls"
import {lucas} from "./perfis"

// Essas são as postagens avançadas inseridas no meu exemplo, onde o último parâmetro é o atributo "visualizacoesRestantes"
// Advanced posts
export const animals: PostagemAvancada = new PostagemAvancada(
    2, "Eu gosto de cachorros, mas acho seu latido irritante", 
    0, 0, "30/10/23", lucas, ["#animais", "#canídeos"], 0
)
export const badger: PostagemAvancada = new PostagemAvancada(
    4, "Se existe algum bicho que consegue comer um Texugo, ele zerou a vida!", 
    0, 0, "30/10/23", lucas, ["#animais", "#pele_de_ferro"], 2
)
export const tiktok: PostagemAvancada = new PostagemAvancada(
    3, "É uma rede social que pode ser produtiva, mas as pessoas não querem saber disso", 
    0, 0, "30/10/23", lucas, ["#rede_social", "#tiktok", "#entretenimento"], 2
)
export const manha: PostagemAvancada = new PostagemAvancada(
    4, "Não sou uma pessoa da manhã", 
    0, 0, "30/10/23", lucas, ["#hábitos"], 1
)

// Incorret formatted post
export const wrongPost: PostagemAvancada = new PostagemAvancada(5, "...", 0, 0, "", lucas, [], 1000)
