

import {
    App, Perfil, Postagem, PostagemAvancada, RedeSocial, RepositorioDePerfis, RepositorioDePostagens
} from "../cls/cls"
import {Algorithm} from "../tests/app"
import prompt from "prompt-sync"
import {lucas, gabriel, antonio} from "../tests/perfis"


// Então porque o filter aqui não está me mostrando somente a postagem de id "1"?
const profiles: Perfil[] = []
let posts: Postagem[] = [
    new Postagem(1, "Postagem A do Lucas", 2, 0, "30/10/23", lucas),
    new Postagem(5, "Eu consegui uma monitoria no IFPI", 0, 0, "31/10/23", gabriel),
    new Postagem(6, "Eu sempre levo lanche quando saio", 0, 0, "31/10/23", gabriel),
    new Postagem(7, "Brasil é quase um continente", 0, 0, "31/10/2023", antonio)
]
const repProfiles: RepositorioDePerfis = new RepositorioDePerfis(profiles)
const repPosts: RepositorioDePostagens = new RepositorioDePostagens(posts)
