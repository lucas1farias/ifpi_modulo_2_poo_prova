

import { Postagem } from "../cls/cls"
import {lucas, gabriel, antonio} from "./perfis"

// Regular posts
export const lucasPostA: Postagem = new Postagem(1, "Postagem A do Lucas", 0, 0, "30/10/23", lucas)
export const monitoria: Postagem = new Postagem(5, "Eu consegui uma monitoria no IFPI", 0, 0, "31/10/23", gabriel)
export const lanche: Postagem = new Postagem(6, "Eu sempre levo lanche quando saio", 0, 0, "31/10/23", gabriel)
export const brasil: Postagem = new Postagem(7, "Brasil é quase um continente", 0, 0, "31/10/2023", antonio)
