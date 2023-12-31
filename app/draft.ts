

import {
    App, Perfil, Postagem, PostagemAvancada, RedeSocial, RepositorioDePerfis, RepositorioDePostagens
} from "../cls/cls"

import {lucas, gabriel, antonio} from "../tests/perfis"


const profiles: Perfil[] = []
let posts: Postagem[] = [
    new Postagem(0, 'Eu retirei minha vesicula', 80, 20, "2023-10-10", lucas),
    new PostagemAvancada(1, "Eu sou old fashion", 60, 45, "2023-02-10", gabriel,  [ '#old_school', '#good_vibes', '#live' ], 42),
    new Postagem(2, "Eu sinto fome o tempo todo", 90, 20, "2023-05-05", antonio),
    new Postagem(3, "Eu gosto de cuscuz", 100, 20, "2023/07/07", lucas),
    new PostagemAvancada(4, "Eu retirei meus pontos", 60, 40, "2023/11/01", gabriel,  [ '#alivio', '#recuperacao', '#ubs' ], 0)
]
const repProfiles: RepositorioDePerfis = new RepositorioDePerfis(profiles)
const repPosts: RepositorioDePostagens = new RepositorioDePostagens(posts)
const socialMedia: RedeSocial = new RedeSocial(repProfiles, repPosts)
const app: App = new App(socialMedia, true)

/* ===== TESTE PARA FUNÇÃO "App.getMostPopularPosts ===== (deve retornar [0, 2, 3])"
0;Eu retirei minha vesicula;80;20;2023-10-10;1
1;Eu sou old fashion;60;45;2023-02-10;2;#old_school,#good_vibes,#live;42
2;Eu sinto fome o tempo todo;90;20;2023-05-05;4
3;Eu gosto de cuscuz;100;20;2023/07/07;1
4;Eu retirei meus pontos;60;40;2023-11-01;0;#alivio,#recuperacao,#ubs;0
*/

/* ===== MEU REPOSITÓRIO ATUAL =====
0;Eu gosto de cuscuz;0;0;2023-07-07;1
1;Eu sinto fome o tempo todo;8;0;2023-05-05;1
2;Eu retirei minha vescula;0;0;2023-10-18;0
3;Eu retirei meus pontos;60;40;2023-11-01;0;#alivio,#recuperacao,#ubs;37
4;Eu sou old fashion;0;0;2023-02-10;5;#old_school,#good_vibes,#live;42
5;Eu gosto de andar;0;0;2023-01-25;3;#saude;31
6;Eu gosto de viajar;0;0;2023-06-17;2;#mundo,#conhecer;38
8;Eu sou tarado, não consigo me aguentar!;0;0;2023-01-10;1;#saude,#tratamento;25
9;Eu preciso tomar vitaminas;0;0;2023-04-04;3;#saude,#bem_estar;22
10;Pare de assistir tv aberta;0;0;2023-10-01;1;#saude,#sanidade;46
11;Cachorros são engraçados por natureza;0;0;2023-07-04;5;#animais,#humor;19
12;Camaleão é um arco-íris ambulante;0;0;2023-11-03;6;#animais,#prisma;21
13;A Antártida é o fim do mundo?;0;0;2023-11-03;6;#mundo,#gelo;41
14;Eu quero um pc gamer;0;0;2023-04-30;0
15;Eu quero voltar a andar de bicicleta;0;0;2023-10-11;0;#exercicio,#ciclismo;40
16;Esta fazendo muito calor;0;0;2023-02-13;5
*/
