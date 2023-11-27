

import prompt from "prompt-sync"
import * as manager from "fs-extra"

export class File {
    osPath: string
    private _content: string
    
    constructor(osPath: string, content: string) {
        this.osPath = osPath
        this._content = content
    }

    get content(): string {
        return this._content
    }

    set content(newValue: string) {
        this._content = newValue
    }
    write(): void {
        manager.writeFileSync(this.osPath, this.content, "utf8")
    }
    append(): void {
        manager.appendFileSync(this.osPath, this.content, "utf8")
    }
    read(): string {
        return manager.readFileSync(this.osPath, "utf8")
    }
}

export class Perfil {
    private _id: number 
    private _nome: string
    private _email: string
    
    constructor(id: number, nome: string, email: string) {
        this._id = id
        this._nome = nome
        this._email = email
    }

    get id(): number {
        return this._id
    }

    get nome(): string {
        return this._nome
    }

    get email(): string {
        return this._email
    }
}

export class Postagem {
    _id: number
    _texto: string
    _curtidas: number
    _descurtidas: number
    _data: string
    _perfil: Perfil

    constructor(id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil) {
        this._id = id
        this._texto = texto
        this._curtidas = curtidas
        this._descurtidas = descurtidas
        this._data = data
        this._perfil = perfil
    } 

    get id(): number {
        return this._id
    }

    get texto(): string {
        return this._texto
    }

    set texto(newContent) {
        this._texto = newContent
    }

    get curtidas(): number {
        return this._curtidas
    }

    set curtidas(newValue: number) {
        this._curtidas = newValue
    }

    get descurtidas(): number {
        return this._descurtidas
    }

    set descurtidas(newValue: number) {
        this._descurtidas = newValue
    }

    get data(): string {
        return this._data
    }

    get perfil(): Perfil {
        return this._perfil
    }

    curtir(): void {
        this.curtidas++
    }

    descurtir(): void {
        this.descurtidas++
    }

    ehPopular(): boolean {
        if (this.curtidas >= this.descurtidas) {
            const operation: number = ((this._curtidas - this.descurtidas) / this.descurtidas) * 100
            return operation >= 50 ? true : false
        }
        return false
    }

    // Support 
    ehPopularPorcentagem(): number {
        if (this.curtidas >= this.descurtidas) {
            const operation: number = ((this._curtidas - this.descurtidas) / this.descurtidas) * 100
            return operation
        }
        return 0
    }
}

export class PostagemAvancada extends Postagem {
    private _hashtags: string[]
    private _visualizacoesRestantes: number 
    
    constructor(
        id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil,
        hashtags: string[], visualizacoesRestantes: number
        ) {
        super(id, texto, curtidas, descurtidas, data, perfil)
        this._hashtags = hashtags
        this._visualizacoesRestantes = visualizacoesRestantes 
    }

    get hashtags(): string[] {
        return this._hashtags
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes
    }

    set visualizacoesRestantes(newValue: number) {
        this._visualizacoesRestantes = newValue
    }
    
    // Check if a certain advanced post has in its "hashtags" attrib. the hashtag passed
    adicionarHashtag(hashtag: string): void {
        if (this.existeHashtag(hashtag)) {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.hashtagExists)
            return
        } 
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.hashtagAdded)
        this.hashtags.push(hashtag)
    }

    existeHashtag(hashtag: string): boolean {
        return this.hashtags.includes(hashtag) ? true : false
    }
    
    // For when a post is viewed (but not on all cases) (the post is not chosen and its view removed)
    // Bug
    decrementarVisualizacoes(): void {
        this.visualizacoesRestantes = this.visualizacoesRestantes - 1 
    }
}

export class RepositorioDePerfis {
    private _perfis: Perfil[]
    lastId: number

    constructor(perfis: Perfil[]) {
        this._perfis = perfis
        // added later
        this.lastId = 0
    }

    get perfis(): Perfil[] {
        return this._perfis
    }
    
    incluir(perfil: Perfil): void {
        !this.consultar(perfil.id) ? this.perfis.push(perfil) : null
    }
    
    /*
        It is being asked to return "null", but I do not know how to do it in a way professor wants
        It will return undefined instead
    */
    consultar(id: number): Perfil {
        let searchedProfile!: Perfil
        for (let i = 0; i < this.perfis.length; i++) {
            if (id == this.perfis[i].id) {
                return this.perfis[i]
            }
        }
        return searchedProfile
    }

    tamanhoRepositorio(): number {
        return this.perfis.length
    }
    
    // Support
    verRepositorioPerfis(): void {
        console.log("\n[")
        for(let i = 0; i < this.tamanhoRepositorio(); i++) {
            const thisProfile = this.perfis[i]
            console.log(thisProfile)
        }
        console.log("]")
    }
    
    /* ===== SUPPORTS: "txt/last_id_profile.txt" =====
    After each new profile added, this value will track the history of indexes record  
    */
    atualizarUltimoIdPerfil(): void {
        this.lastId++
    }
}

export class RepositorioDePostagens {
    private _postagens: Postagem[]
    mockProfile: Perfil
    mockAdvancedPost: PostagemAvancada
    lastId: number

    constructor(postagem: Postagem[]) {
        this._postagens = postagem
        this.mockProfile = new Perfil(-1, "Void", "void@gmail.com")
        this.mockAdvancedPost = new PostagemAvancada(-1, "void", 0, 0, "01-01-01", this.mockProfile, ["#void"], 0)
        this.lastId = 0
    }

    get postagens(): Postagem[] {
        return this._postagens
    }
    
    // In here, there is no need to verify instance, it will add "Postagem" and "PostagemAvancada"
    // Why would you want to verify if a post is repeated or not? does not make sens at all
    incluir(postagem: Postagem): void {
        this.postagens.push(postagem)
    }
    
    consultar(id: number, hashtag: string): Postagem[] {
        const posts: Postagem[] = []
        
        for(let i = 0; i < this.postagens.length; i++) {
            // When post is regular, get posts based on a profile id
            // If profile id found == parameter id => append this post
            const currentPost: Postagem = this.postagens[i]
            id == currentPost.perfil.id ? posts.push(currentPost) : null 
            
            // When post is advanced: posts are got by a certain hashtag
            if (currentPost instanceof PostagemAvancada) {
                currentPost.hashtags.includes(hashtag) ? posts.push(currentPost) : null
            }
        }
        return posts
    }

    consultarUnico(postId: number): Postagem {
        // This will return an array with only one post instance expected
        const thePost: Postagem[] = this.postagens.filter((i: Postagem) => {
            if (i.id === postId) {
                return true
            }
            return false
        })
        // If the post id does not exist, insert the mock one inside this class
        thePost.length == 0 ? thePost.push(this.mockAdvancedPost) : null
        return thePost[0]
    }

    tamanhoRepositorio(): number {
        return this.postagens.length
    }

    // Support
    filtrarPostagensAvancadas(): PostagemAvancada[] {
        let postsFilter: Postagem[] = this.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                return true
            }
            return false
        })
        
        // This is done to avoid error ts(2322)
        const advancedPosts: PostagemAvancada[] = []
        postsFilter.forEach(i => {i instanceof PostagemAvancada ? advancedPosts.push(i) : null})
        postsFilter = []
        
        return advancedPosts
    }

    // Support
    obterHashtags(arrayPosts: PostagemAvancada[]): string[] {
        const arrayHashtags: string[] = []
        for (let i = 0; i < arrayPosts.length; i++) {
            // Add each hashtag [j] from each index of arrayPosts [i]
            for (let j = 0; j < arrayPosts[i].hashtags.length; j++) {
                arrayHashtags.push(arrayPosts[i].hashtags[j])
            }
        }
        return arrayHashtags
    }
    
    // Support
    exibirPostagens(arrayPosts: Postagem[]): void {
        console.log("\n[")
        for (let i = 0; i < arrayPosts.length; i++) {
            const thisPost: Postagem = arrayPosts[i]
            console.log(thisPost)
        }
        console.log("]")
    }
    
    // Support
    verRepositorioPostagens(): void {
        console.log("\n[")
        for(let i = 0; i < this.tamanhoRepositorio(); i++) {
            const thisPost: Postagem = this.postagens[i] 
            console.log(thisPost)
        }
        console.log("]")
    }

    // Support
    simularAtividadePostagem(): void {
        for (let i = 0; i < this.tamanhoRepositorio(); i++) {
            this.postagens[i].curtidas = new Valor().criarValor(1, 100001)
            this.postagens[i].descurtidas = new Valor().criarValor(1, 100001)
        }
    }

    /* ===== SUPPORTS: "txt/last_id_post.txt" =====
    After each new post added, this value will track the history of indexes record 
    */
    atualizarUltimoIdPostagem() {
        this.lastId++
    }
}

export class RedeSocial {
    private _repPerfis: RepositorioDePerfis
    private _repPosts: RepositorioDePostagens

    constructor(repPerfis: RepositorioDePerfis, repPosts: RepositorioDePostagens) {
        this._repPerfis = repPerfis
        this._repPosts = repPosts
    }

    get repPerfis(): RepositorioDePerfis {
        return this._repPerfis
    }

    get repPosts(): RepositorioDePostagens {
        return this._repPosts
    }
    
    // I think it would be better if this function had return "number" (but I am not allowed to change)
    incluirPerfil(perfil: Perfil): void {
        for (let i = 0; i < this.repPerfis.perfis.length; i++) {
            if (perfil.id == this.repPerfis.perfis[i].id) {
                return 
            }
        }
        if (
            perfil.nome != undefined && perfil.nome != "" &&
            perfil.email != undefined && perfil.email != ""
            ) {
            (<RepositorioDePerfis> this.repPerfis).incluir(perfil)
        }
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil {
        return (<RepositorioDePerfis> this.repPerfis).consultar(id)
    }
    
    // I think it would be better if this function had return "number" (but I am not allowed to change)
    incluirPostagem(postagem: Postagem): void {
        let p = postagem
        let postFields: number[] = []
        
        // Regular post
        if (p instanceof Postagem && !(postagem instanceof PostagemAvancada)) {
            postFields.push(p.data === undefined || p.data === "" ? 1 : 0)
            postFields.push(p.texto === undefined || p.texto === "" ? 1 : 0)
            postFields.push(p.id === undefined || p.id < 0 ? 1: 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
            postFields.push(p.descurtidas === undefined || p.descurtidas < 0 ? 1 : 0)
            postFields.push(p.perfil === undefined ? 1 : 0)    
        } 
        // Advanced post
        if (p instanceof PostagemAvancada) {
            postFields.push(p.data === undefined || p.data === "" ? 1 : 0)
            postFields.push(p.texto === undefined || p.texto === "" ? 1 : 0)
            postFields.push(p.id === undefined || p.id < 0 ? 1: 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
            postFields.push(p.descurtidas === undefined || p.descurtidas < 0 ? 1 : 0)
            postFields.push(p.perfil === undefined ? 1 : 0)
            postFields.push(p.hashtags.length === 0 ? 1 : 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
        }
        
        const undefinedCountage: number = postFields.reduce((current, next) => {return current + next})
            
        // If there is no invalid attribute
        if (undefinedCountage === 0) {
            for (let i = 0; i < this.repPosts.postagens.length; i++) {
                // Check for existence of repeated id. If there is, function breaks and nothing is added
                if (postagem.id === this.repPosts.postagens[i].id) {
                    return 
                }
            }
            // If post is ok, it is added to the posts repository
            (<RepositorioDePostagens> this.repPosts).incluir(postagem)
        }
    }

    consultarPostagens(id: number, texto: string, hashtag: string, perfil: Perfil): Postagem[] {
        return (<RepositorioDePostagens> this.repPosts).consultar(id, hashtag)
    }

    curtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                (<Postagem> this.repPosts.postagens[i]).curtir()
            }
        }
    }

    descurtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                if (this.repPosts.postagens[i].curtidas > 0) {
                    (<Postagem> this.repPosts.postagens[i]).descurtir()
                }
            }
        }
    }
    
    decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            (<PostagemAvancada> postagem).decrementarVisualizacoes()
        }
    }
    
    exibirPostagensPorPerfil(id: number): Postagem[] {
        // First: take all posts from a certain profile id
        // Others outside the "ifs" will be excluded (return false)
        let profilePosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i.perfil.id == id) {
                return true
            }
            return false
        })
        
        // Second: From the current array, remove views from advanced posts
        // profilePosts.forEach(i => {
        //     i instanceof PostagemAvancada ? this.decrementarVisualizacoes(i) : null
        // })
        
        // Third: include advanced posts with 1+ views left OR regular posts
        // Others outside the "ifs" will be excluded (return false)
        profilePosts = profilePosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 || 
                i instanceof Postagem && !(i instanceof PostagemAvancada)) {
                return true
            }
            return false
        })
        
        return profilePosts
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        // 2 operations at once were not working, so at first: get advanced posts and recude their views
        let advancedPosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                // this.decrementarVisualizacoes(i)
                return true
            }
            return false
        })
        
        // The second operation also requires asking instance in order for the 2 && work
        advancedPosts = advancedPosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 && i.hashtags.includes(hashtag)) {
                return true
            }
            return false
        })
        
        // This was done because I could not solve how to return "advancedPosts" without issues
        let advancedPostsFinal: PostagemAvancada[] = []
        advancedPosts.forEach(i => {
            i instanceof PostagemAvancada ? advancedPostsFinal.push(i) : null
        })
        return advancedPostsFinal
    }

    decrementarViewsAposExibir(array: Postagem[]) {
        array.forEach(i => {
            i instanceof PostagemAvancada ? this.decrementarVisualizacoes(i) : null
        })
    }

    // Treatment for date handling (not complete though)
    tratarDadosData(date: string, separator: string): boolean {
        let correct: number = 0
        const dateArray: string[] = date.split(separator)
        Number(dateArray[0]) <= new Date().getFullYear() ? correct++ : null
        Number(dateArray[1]) <= 12 ? correct++ : null
        Number(dateArray[2]) <= 31 ? correct++ : null
        Number(dateArray[0]) <= 9 ? dateArray[0] = `0${dateArray[0]}` : null
        Number(dateArray[1]) <= 9 ? dateArray[1] = `0${dateArray[1]}` : null
        Number(dateArray[2]) <= 9 ? dateArray[0] = `0${dateArray[2]}` : null
        return correct == 3 ? true : false
    }
}

export class App {
    private _redeSocial: RedeSocial
    
    // Content for algorithm handling
    auto: boolean
    operation: string
    input
    
    // Text files variables
    profilesTxt: File
    postsTxt: File
    profileLastId: File
    postLastId: File
    settingsOptionA: File

    // Content for empty parameters
    mockProfile: Perfil
    mockPost: Postagem
    mockAdvancedPost: PostagemAvancada

    // Support classes
    calendar: Calendario

    // Settings
    private _triggerOptionA: number
 
    constructor(redeSocial: RedeSocial, auto: boolean=false) {
        this._redeSocial = redeSocial
        this.auto = auto
        this.input = prompt()
        this.operation = ""
        
        // Text files
        this.profilesTxt = new File("../txt/profiles.txt", "")
        this.postsTxt = new File("../txt/posts.txt", "")
        this.profileLastId = new File("../txt/last_id_profile.txt", "")
        this.postLastId = new File("../txt/last_id_post.txt", "")
        this.settingsOptionA = new File("../txt/settingsOptionA.txt", "")

        this.calendar = new Calendario()
        
        this.mockProfile = new Perfil(-1, "Void", "void@gmail.com")
        this.mockPost = new Postagem(-1, "void", 0, 0, "01-01-01", this.mockProfile)
        this.mockAdvancedPost = new PostagemAvancada(-1, "void", 0, 0, "01-01-01", this.mockProfile, ["#void"], 0)
        
        // This is only apropriate to settings menu options, otherwise, it is better to create functions
        this._triggerOptionA = Number(this.settingsOptionA.read())
        
        this.auto ? this.iniciar() : null
    }

    get redeSocial(): RedeSocial {
        return this._redeSocial
    }

    get triggerOptionA(): number {
        return this._triggerOptionA
    }

    set triggerOptionA(newValue) {
        this._triggerOptionA = newValue
    }

    // Main
    iniciar(): void {

        // docs/app.txt/iniciar/copy_file_values
        this.recuperarUltimoIndiceDePerfil()
        this.recuperarUltimoIndiceDePostagem()

        // docs/app.txt/iniciar/translate_and_copy_from_file_content_to_virtual_array
        this.recuperarRepositorioPerfis()
        this.recuperarRepositorioPostagens()
        
        // Start
        console.log('\n\n\n\n\n')
        do {
            console.log(this.menu())
            this.operation = this.requisitarEntrada(new Messages().msg.inputs.askOperationValue)
            this.condicionais()
            console.clear()
        } while(this.operation != "0")
        
        // The wipe must happen before any change on
        this.removerPostagensAvancadasSemViews()
        
        /*
        ========== PROFILE MANAGEMENT ==========
        Record into documents the last index from each repository
        Before recording, wipe old content, and when leaving, record new content
        */
        this.gravarUltimoPerfilId()
        this.limparRepositorioPerfisDesatualizado()    
        this.anexarRepositorioPerfisAtualizado()

        /* ========== POSTS MANAGEMENT ==========
        Before recording, wipe old content, and when leaving, record new content
        */
        this.gravarUltimoPostId()
        this.limparRepositorioPostagensDesatualizado()
        this.triggerOptionA != 0 ? this.redeSocial.repPosts.simularAtividadePostagem() : null
        this.anexarRepositorioPostagensAtualizado()

        // End
        this.teclarEnter()
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.appClosed)
    }
    
    // Uses set method from "RepositorioDePerfis"
    recuperarUltimoIndiceDePerfil(): void {
        this.redeSocial.repPerfis.lastId = Number(this.profileLastId.read())
    }

    // Uses set method from "RepositorioDePostagens"
    recuperarUltimoIndiceDePostagem(): void {
        this.redeSocial.repPosts.lastId = Number(this.postLastId.read())
    }

    // To be used before algorithm start
    recuperarRepositorioPerfis(): void {
        const profilesData = this.profilesTxt.read().split("\n")
        for (let i = 0; i < profilesData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (profilesData[i] != "") {
                const p: string[] = profilesData[i].split(";")
                const retrievedProfile: Perfil = new Perfil(Number(p[0]), p[1], p[2])
                this.redeSocial.incluirPerfil(retrievedProfile)
            }
        }
    }

    // To be used before algorithm start
    recuperarRepositorioPostagens(): void {
        const postsData = this.postsTxt.read().split("\n")
        for (let i = 0; i < postsData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (postsData[i] != "") {
                const p: string[] = postsData[i].split(";")
                const profileId: number = Number(p[5])
                const profileExists: Perfil = this.redeSocial.consultarPerfil(profileId, "void", "void")
                
                // If the id collected in the row actually belongs to a user
                if (profileExists) {
                    // Regular post
                    if (p.length == 6) {
                        const retrievedPost: Postagem = new Postagem(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                    // Advanced post
                    if (p.length > 6) {
                        const hashtagFromRowToArray: string[] = p[6].split(",")
                        const retrievedPost: PostagemAvancada = new PostagemAvancada(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists,
                            hashtagFromRowToArray, Number(p[7])
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                }
            }
        }
    }

    menu(): string {
        return `
        ========== APLICAÇÃO: REDE SOCIAL ==========
        0. Sair
        1. incluir Perfil
        2. consultar Perfil
        3. incluir Postagem
        4. consultar Postagens
        5. curtir
        6. descurtir
        7. decrementar visualizações
        8. exibir postagens por perfil
        9. exibir postagens por hashtag
        
        ===== CONSULTAS =====
        10. Ver repositório de perfis
        11. Ver repositório de postagens
        12. Postagens mais populares
        13. Hashtags mais populares

        ===== FUNCIONALIDADES =====
        a. adicionar hashtag
        b. remover postagem
        c. editar postagem
        d. ver postagens (ano e mês)
        e. resetar repositório de postagens

        ===== CONFIGURAÇÕES =====
        01. Ativar simulação de atividade
        `
    }
    
    requisitarEntrada(sentence: string, empty: boolean=false): string {
        console.log(sentence)
        let data: string
        empty ? data = this.input("") : data = this.input(">>> ")
        return data
    }

    requisitarEntradaNumero(sentence: string, empty: boolean=false): number {
        console.log(sentence)
        let data: number
        empty ? data = Number(this.input("")) : data = Number(this.input(">>> "))
        return data
    }

    gravarUltimoValorConfigA(newValue: string): void {
        this.settingsOptionA.content = newValue 
        this.settingsOptionA.write()
    }
    
    gravarUltimoPerfilId(): void {
        this.profileLastId.content = `${this.redeSocial.repPerfis.lastId}`
        this.profileLastId.write()
    }

    gravarUltimoPostId(): void {
        this.postLastId.content = `${this.redeSocial.repPosts.lastId}`
        this.postLastId.write()
    }

    limparRepositorioPerfisDesatualizado(): void {
        this.profilesTxt.content = ""
        this.profilesTxt.write()
    }

    // Before algorithm ceases: update "new profile" content into its container file
    anexarRepositorioPerfisAtualizado(): void {
        let row: string = ""
        for (let i = 0; i < this.redeSocial.repPerfis.perfis.length; i++) {
            const profile: Perfil = this.redeSocial.repPerfis.perfis[i]
            row = `${profile.id};${profile.nome};${profile.email}`
            this.profilesTxt.content = row + '\n'
            this.profilesTxt.append()
        }
    }

    limparRepositorioPostagensDesatualizado(): void {
        this.postsTxt.content = ""
        this.postsTxt.write()
    }

    // Before algorithm ceases: update "new post" content into its container file
    anexarRepositorioPostagensAtualizado(): void {
        /*
            ===== FOR ALL KINDS OF POSTS =====
            Instead of putting the entire profile content, insert only its id: row = `...${p.perfil.id}`
            
            ===== FOR ADVANCED POSTS =====
            The array of hashtags is improper, so the array is turned into a string
            ["#gastronomia", "#estrognofe_com_farofa"] = ;#gastronomia,#estrogonofe_com_farofa;
        */
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            let row: string = ""
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            
            // Regular post
            if (p instanceof Postagem && !(p instanceof PostagemAvancada)) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id}`
            }
            
            // Advanced post
            if (p instanceof PostagemAvancada) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id};${p.hashtags.toString()};${p.visualizacoesRestantes}`
            }

            // Creating row content and inserting it into file
            this.postsTxt.content = row + '\n'
            this.postsTxt.append()
        }
    }

    teclarEnter(): void {
        this.requisitarEntrada(new Messages().msg.inputs.pressEnter, true)
    }
    
    // Cases
    condicionais(): void {
        switch(this.operation) {
            case "1":
                console.log(new Messages().msg.operations.includeProfile)
                this.incluirPerfil()
                break
            case "2":
                console.log(new Messages().msg.operations.searchProfile)
                this.consultarPerfil()
                break
            case "3":
                console.log(new Messages().msg.operations.includePost)
                this.incluirPostagem()
                break
            case "4":
                console.log(new Messages().msg.operations.queryPost)
                this.consultarPostagem()
                break
            case "5":
                console.log(new Messages().msg.operations.likePost)
                this.curtir()
                break
            case "6":
                console.log(new Messages().msg.operations.unlikePost)
                this.descurtir()
                break
            case "7":
                console.log(new Messages().msg.operations.lessView)
                this.decrementarVisualizacoes()
                break
            case "8":
                console.log(new Messages().msg.operations.showPostsByProfile)
                this.exibirPostagensPorPerfil()
                break
            case "9":
                console.log(new Messages().msg.operations.showPostsByHashtag)
                this.exibirPostagensPorHashtag()
                break
            case "10":
                console.log(new Messages().msg.operations.showProfileRepository)
                this.verPerfis()
                break
            case "11":
                console.log(new Messages().msg.operations.showPostsRepository)
                this.verPostagens()
                break
            case "12":
                console.log(new Messages().msg.operations.queryMostPopularPosts)
                // const popularPosts: Postagem[] = this.getMostPopularPosts()
                // console.log(popularPosts);
                // (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(popularPosts)
                this.getMostPopularPosts()
                this.teclarEnter()
                break
            case "13":
                console.log(new Messages().msg.operations.queryMostPopularHashtags)
                const mostPopularPosts: Postagem[][] = this.getMostPopularHashtags()
                mostPopularPosts.forEach((i:Postagem[], pos) => {
                    (<RepositorioDePostagens> this.redeSocial.repPosts).exibirPostagens(mostPopularPosts[pos]);
                    (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(mostPopularPosts[pos])
                })
                this.teclarEnter()
                break
            case "a":
                console.log(new Messages().msg.operations.postHashtagAppend)
                this.addHashtag()
                break
            case "b":
                console.log(new Messages().msg.operations.postRemoval)
                this.removerPostagem()
                break
            case "c":
                console.log(new Messages().msg.operations.postContentEdit)
                this.editarPostagem()
                break
            case "d":
                console.log(new Messages().msg.operations.postQueryComplete)
                this.exibirPostagensAnoEspecifico()
                break
            case "e":
                this.apagarConteudoRepositorio()
                break
            case "01": 
               this.habilitarPostagemInteracao()
        }
    }
    
    // Case 3: [RepositorioDePerfis.incluir] -> [RedeSocial.incluirPerfil] -> [App.incluirPerfil]
    incluirPerfil(): void {
        // Inputs 
        const inputName: string = this.requisitarEntrada(new Messages().msg.inputs.askPersonName)
        const inputEmail: string = this.requisitarEntrada(new Messages().msg.inputs.askPersonEmail)
        const newProfile: Perfil = new Perfil(this.redeSocial.repPerfis.lastId, inputName, inputEmail)
        
        const previousLength: number = this.redeSocial.repPerfis.tamanhoRepositorio()
        this.redeSocial.incluirPerfil(newProfile)
        const currentLength: number = this.redeSocial.repPerfis.tamanhoRepositorio()
        
        if (previousLength < currentLength) {
            this.redeSocial.repPerfis.atualizarUltimoIdPerfil()
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.success.profileCreated)
            this.teclarEnter()
            return 
        }
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.fail.profileNotCreated)
    }
    
    // Case 2
    consultarPerfil(): void {
        const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
        const query: Perfil = this.redeSocial.repPerfis.consultar(profileId)
        console.log(query ? `
        { 
            id: ${query.id} nome: ${query.nome} email: ${query.email} 
        }` 
        : "{ }")
        this.teclarEnter()
    }
    
    // Case 3 
    incluirPostagem(): void {
        let postType: string
        let today: string
        
        // Input control
        do {
            postType = this.requisitarEntrada(new Messages().msg.inputs.askPostType)
        } while (postType !== "1" && postType !== "2")

        do {
            today = this.requisitarEntrada(new Messages().msg.inputs.askDateAsTutorial)
        } while(!(this.redeSocial.tratarDadosData(today, "-")))
        
        const text: string = this.requisitarEntrada(new Messages().msg.inputs.askPostContent)
        const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
        
        /*
        On a real application, someone has an account to login
        So the post created is already linked to the post
        But there is no login creation system
        The way to garantee this post has an autor is by passing the author's id
        For security, the author's existence itself must be checked
        This will serve for both kinds of posts (regular and advanced)
        */
        const profileExists: Perfil = this.redeSocial.repPerfis.consultar(profileId)
        
        if (profileExists) {
            // Regular post
            if (postType === "1") {
                const newPost: Postagem = new Postagem(this.redeSocial.repPosts.lastId, text, 0, 0, today, profileExists);
                let previousLength: number = this.redeSocial.repPosts.tamanhoRepositorio()
                this.redeSocial.incluirPostagem(newPost)
                let currenLength: number = this.redeSocial.repPosts.tamanhoRepositorio()
                // It repository grew, this means the post was added, so the update on text file is authorized
                if (previousLength < currenLength) {
                    this.redeSocial.repPosts.atualizarUltimoIdPostagem()
                    console.log(new Messages().msg.warn)
                    console.log(new Messages().msg.success.postCreated)
                    this.teclarEnter()
                    return
                }
            }
            
            // Advanced Post
            else if (postType === "2") {
                const profileHashtags: string[] = []
                const views: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askPostViewsRange)
                const hashTagsAmount: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askHashtagsAmount)

                // Hashtags being added progressively on the loop (one input for each index)
                for (let i = 0; i < hashTagsAmount; i++) {
                    let hashtag: string = this.requisitarEntrada(`Nome da ${i + 1}a hashtag (não incluir #)`)
                    profileHashtags.push("#" + hashtag)
                }

                // Creating post instance
                const newPost: PostagemAvancada = new PostagemAvancada(
                    this.redeSocial.repPosts.lastId, 
                    text, 0, 0, today, profileExists, profileHashtags, views
                )
                
                let previousLength: number = this.redeSocial.repPosts.tamanhoRepositorio()
                this.redeSocial.incluirPostagem(newPost)
                let currentLength: number = this.redeSocial.repPosts.tamanhoRepositorio()
                
                if (previousLength < currentLength) {
                    this.redeSocial.repPosts.atualizarUltimoIdPostagem()
                    console.log(new Messages().msg.warn)
                    console.log(new Messages().msg.success.postCreated)
                    this.teclarEnter()
                    return
                }
            }
        }
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.fail.postNotCreated)
    }

    // Case 4: [App.consultarPostagens] -> [RedeSocial.consultarPostagens] -> [RepositorioPostagens.consultarPostagens]
    consultarPostagem(): void {
        // Type 1 (query by profile id)    ...    Type 2 (query by hashtag)
        let postType: string
        do {
            postType = this.requisitarEntrada(new Messages().msg.inputs.askPostType)
        } while (postType !== "1" && postType !== "2")
        
        // Regular post: receives posts if the "post.profile.id" === profile id input
        if (postType === "1") {
            const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
            const query: Postagem[] = (<RedeSocial> this.redeSocial).consultarPostagens(
                profileId, this.mockPost.texto, this.mockAdvancedPost.hashtags[0], this.mockProfile
            )
            query ? this.redeSocial.repPosts.exibirPostagens(query) : `{ }`
        }
        // Advanced post: receives posts if the "post.hashtags" has hashtag input included 
        else {
            const hashtag: string = this.requisitarEntrada(new Messages().msg.inputs.askHashtagContent)
            const query: Postagem[] = (<RedeSocial> this.redeSocial).consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
            query ? this.redeSocial.repPosts.exibirPostagens(query) : `{ }`
        }
        this.teclarEnter()
    }

    // Case 5
    curtir(): void {
        const postId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askPostId) 
        const thePost: Postagem = (<RepositorioDePostagens> this.redeSocial.repPosts).consultarUnico(postId)

        if (thePost.id != -1) {
            console.log(thePost)
            
            thePost instanceof PostagemAvancada 
            ? this.redeSocial.decrementarVisualizacoes(thePost)
            : null;

            this.redeSocial.curtir(postId)

            console.log(new Messages().msg.warn)
            this.requisitarEntrada(new Messages().msg.success.postLiked, true)
            console.log(thePost)
        } else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
            console.log("{  }")
        }
        
        this.teclarEnter()
    }

    // Case 6
    descurtir(): void {
        const postId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askPostId)  
        const thePost: Postagem = this.redeSocial.repPosts.consultarUnico(postId)

        if (thePost.id != -1) {
            // Show post first 
            console.log(thePost)
            
            // Its view is decremented
            thePost instanceof PostagemAvancada 
            ? this.redeSocial.decrementarVisualizacoes(thePost)
            : null;
            
            // For last, the post receives a dislike
            this.redeSocial.descurtir(postId)
            
            // Inform it was disliked and show it again as proof
            console.log(new Messages().msg.warn)
            this.requisitarEntrada(new Messages().msg.success.postDisliked, true)
            console.log(thePost)
        } 
        else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
            console.log("{  }")
        }
        this.teclarEnter()
    }
    
    /* ===== Case 7 =====
    According to the instructions given, this function calls another that decrements views from posts
    The instructions do not tell the proccess that leads to the ultimate procedure (views--)
    So I thought about 2 searching methods
    Method 1: Ask for profile id, it will get all posts from this profile, exhibit them, and decrease the advanced ones
    Method 2: Ask for hashtag, it will get all posts with a certain hashtah, exhibit them, and decrease the advanced ones
    */
    decrementarVisualizacoes(): void {
        let query: Postagem[]
        let searchType: string
        
        do {
            searchType = this.requisitarEntrada(new Messages().msg.inputs.askSearchingMethod)
        } while(searchType !== "1" && searchType !== "2")
        
        // Creating array from all regular posts based on a profile id
        if (searchType === "1") {
            const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
            query = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, this.mockAdvancedPost.hashtags[0], this.mockProfile
            )
        }
        
        // Creating array from all advanced posts with a certain hashtag
        else {
            const hashtag: string = this.requisitarEntrada(new Messages().msg.inputs.askHashtagContent)
            query = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
        }

        // If query has no indexes, show {}, else: show posts
        console.log(new Messages().msg.info.postsFound)
        query ? this.redeSocial.repPosts.exibirPostagens(query) : `{ }`;
        
        // If query has any index, decrease views from each post found
        if (query.length > 0) {
            query.forEach((i: Postagem) => {
                i instanceof PostagemAvancada ? (<PostagemAvancada> i).decrementarVisualizacoes() : null
            })
        }
        
        this.teclarEnter()
    }

    /*
    ===== ISSUE =====
    There were changes at "exibirPostagensPorHashtag" from "RedeSocial" class
    There were changes at "exibirPostagensPorPerfil" from "RedeSocial" class
    Decrementing views at inside these functions (as asked) seems inaccurate 
    The functions previous behavior decreased views before their exhibition
    What is the matter? Let us suppose that one advanced post has been found and has 1 view left
    This leads to a behavior that even though it has 1 view left, it'll turn into 0 before being shown
    Conclusion? It won't be shown
    Solution? shift the reducing behavior from the main function to their cases (8 and 9)
    */

    // Case 8
    exibirPostagensPorPerfil(): void {
        const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
        const profile: Perfil = this.redeSocial.repPerfis.consultar(profileId)
        this.requisitarEntrada(`Pessoa encontrada: ${profile.nome}. Aperte ENTER (ver postagens)`, true)
        this.teclarEnter()
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorPerfil(profileId)
        console.log(postsFound)
        
        // Decreasing views after results are displayed
        this.redeSocial.decrementarViewsAposExibir(postsFound)
        this.teclarEnter()
    }

    // Case 9: Ask for hashtag name with # and it will return all posts that have this hashtag within
    exibirPostagensPorHashtag(): void {
        const hashtag: string = this.requisitarEntrada(new Messages().msg.inputs.askHashtagContent)
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorHashtag(hashtag)
        console.log(postsFound)
        
        // Decreasing views after results are displayed
        this.redeSocial.decrementarViewsAposExibir(postsFound)
        this.teclarEnter()
    }

    // Case 10
    verPerfis(): void {
        console.log("Perfis registrados", this.redeSocial.repPerfis.tamanhoRepositorio())
        this.teclarEnter();
        this.redeSocial.repPerfis.verRepositorioPerfis()
        this.teclarEnter()
    }
    
    // Case 11
    verPostagens(): void {
        console.log("Postagens registradas", this.redeSocial.repPosts.tamanhoRepositorio())
        this.teclarEnter();
        this.redeSocial.repPosts.verRepositorioPostagens()
        this.teclarEnter()
    }
    
    // Case 12
    getMostPopularPosts(): void {

        // Filter the ones that fit to be popular
        let postRepository: Postagem[] = this.redeSocial.repPosts.postagens
        postRepository = postRepository.filter((i: Postagem) => {
            if (i instanceof Postagem && !(i instanceof PostagemAvancada)) {
                if (i.ehPopular()) {
                    return true
                }
            }
            if (i instanceof PostagemAvancada) {
                if (i.ehPopular() && i.visualizacoesRestantes > 0) {
                    return true
                }
            }
            return false
        })
        
        // Compare values and sort the most popular ones to the top
        postRepository = postRepository.sort((i: Postagem, i2: Postagem) => {
            if (i2.ehPopularPorcentagem() < i.ehPopularPorcentagem()) {
                return -1  
            } else if (i2.ehPopularPorcentagem() > i.ehPopularPorcentagem()) {
                return 1  
            } else {
                return 0   
            }
        })

        // Show in a form of rank
        postRepository.forEach((i: Postagem) => {
            console.log("\nÍndice de popularidade: ", Math.floor(i.ehPopularPorcentagem()), "%")
            console.log(i)
        })
    }

    // Case 13
    /* 
    Eu preciso de sua ajuda com uma dúvidas
    Essa dúvida se reflete em todo o meu algoritmo
    Agora vamos a minha dúvida
    Observe esta função que eu criei
    em "hashtagsBoxNonUnique" eu estou fazendo dois castings de duas funções vindas de "RepositorioDePostagens"
    A questão é que elas também funcionam se eu não fizer esse "casting"
    A aplicação desse "casting" é desnecessário?
    */
    getMostPopularHashtags(): PostagemAvancada[][] {
        const rankAmount: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askHashtagAmountForRank)
        const hashtagsBoxNonUnique: string[] = this.redeSocial.repPosts.obterHashtags(this.redeSocial.repPosts.filtrarPostagensAvancadas())
        const hashtagsBox: Hashtag = new Hashtag(hashtagsBoxNonUnique)
        const hashtagsBoxUnique: string[] = hashtagsBox.filtrarHashtagsUnicas()
        const hashtagsCountageRank: [string, number][] = hashtagsBox.ordenarCrescente()
        const rank: [string, number][] = []

        const overallPopularHashtagPosts: PostagemAvancada[][] = []
        // Put into "rank" the counting results based on the range the user provided
        // If "rankAmount" is 3 ... then ... rank = [["#saúde", 4], ["#animais", 3], ["#mundo", 2]]
        for (let i = 0; i < rankAmount; i++) {
            rank.push(hashtagsCountageRank[i])
        }
        // Based on index [0] of "rank" (the hashtag), get the posts that have it within each array of this post
        for (let i = 0; i < rank.length; i++) {
            const hashtag: string = rank[i][0]
            overallPopularHashtagPosts.push(this.redeSocial.exibirPostagensPorHashtag(hashtag))
        }
        return overallPopularHashtagPosts
    }

    // ========== EXTRA FUNCTIONALITIES ==========

    // a
    
    addHashtag(): void {
        const profileId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askProfileId)
        const postsFromThisProfile: Postagem[] = this.redeSocial.repPosts.consultar(profileId, this.mockAdvancedPost.hashtags[0])
        
        const idList: number[] = []
        postsFromThisProfile.forEach((i: Postagem) => {i instanceof PostagemAvancada ? idList.push(i.id) : null})
        
        console.log(postsFromThisProfile)
        console.log(new Messages().msg.tutorial.askWhichId, "\n", idList)
        const advancedPostId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.choosePostId)
        
        idList.forEach((i: number) => {
            if (advancedPostId === i) {
                const newPost = this.redeSocial.repPosts.consultarUnico(advancedPostId)
                console.log(new Messages().msg.tutorial.chooseAdvancedPost)
                this.teclarEnter()
                console.log(newPost)
                const newHashtag: string = this.requisitarEntrada(new Messages().msg.inputs.askHashtagContent)
                
                if (newPost instanceof PostagemAvancada) {
                    newPost.adicionarHashtag(newHashtag)
                    console.log(newPost)
                    this.teclarEnter()
                    return
                }
                console.log(new Messages().msg.warn)
                console.log(new Messages().msg.fail.postIsRegular)
            }
        })
        this.teclarEnter()
    }
    
    // b
    removerPostagem(): void {
        const postId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askPostId)

        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            
            if (p.id === postId) {
                this.redeSocial.repPosts.postagens.splice(i, 1)
                console.log(new Messages().msg.warn)
                console.log(new Messages().msg.success.postRemoved)
                this.teclarEnter()
                return
            }
        }
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.fail.postNotFound)
        this.teclarEnter()
    }

    // c
    editarPostagem(): void {
        const postId: number = this.requisitarEntradaNumero(new Messages().msg.inputs.askPostId)
        const thePost: Postagem = this.redeSocial.repPosts.consultarUnico(postId)
        
        if (thePost.id != -1) {
            const thePostInfo: string = `
            ${new Messages().msg.info.postHighlight}
            Texto:
                ${thePost.texto}
                < likes: ${thePost.curtidas} >    < dislikes: ${thePost.descurtidas} >
            `
            console.log(thePostInfo)
            const newPostText: string = this.requisitarEntrada(new Messages().msg.inputs.askNewPostText)
            thePost.texto = newPostText
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.success.postContentChanged)
        } else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
        }
        this.teclarEnter()
    }

    // d
    exibirPostagensAnoEspecifico(): void {

        const monthsMenu: string[] = [
            "===== ESCOLHER MÊS =====",
            "1. Janeiro", "2. Fevereiro", "3. Março", "4. Abril", "5. Maio", "6. Junho", 
            "7. Julho", "8. Agosto", "9. Setembro", "10. Outubro", "11. Novembro", "12. Dezembro",
            "Informe um dos meses pelo seu número"
        ]
        const monthsNumber: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

        // Get posts from the year passed as input
        const year: number = this.requisitarEntradaNumero("Informe o ano da postagem (formato: yyyy)")
        let postsFromThisYear: Postagem[] = this.redeSocial.repPosts.postagens.filter((i: Postagem) => {
            if (Number(i.data.split("-")[0]) === year) {
                return true
            }
            return false
        })
        
        // Order the posts from first month until last
        postsFromThisYear = postsFromThisYear.sort((i: Postagem, i2: Postagem) => {
            if (this.calendar.obterIdadeData(i.data) < this.calendar.obterIdadeData(i2.data)) {
                return 1
            } else if (this.calendar.obterIdadeData(i.data) > this.calendar.obterIdadeData(i2.data)) {
                return -1
            }
            return 0
        })
        
        // Pick a month to show only from it
        monthsMenu.forEach((i: string) => console.log(i))
        const month: string = this.requisitarEntrada("")

        monthsNumber.forEach((monthId: string) => {
            if (month === monthId) {
                // In here, the posts with all posts from the year are reduced to a specific month
                postsFromThisYear = postsFromThisYear.filter((i: Postagem) => {
                    if (i.data.split("-")[1] === `0${monthId}`) {
                        return true
                    }
                    return false
                })
            }
        })
        
        if (postsFromThisYear.length > 0) {
            const targetMonth: string = this.calendar.converterMesParaTexto(`00-${month}-00`).split(" ")[2]
            console.log(targetMonth)
            console.log(`====== POSTAGENS DO ANO DE ${year} EM ${targetMonth.toUpperCase()} =====`)
            postsFromThisYear.forEach((i: Postagem) => {
                const postShaped: string = `{ nome: ${i.perfil.nome}, data: ${this.calendar.converterMesParaTexto(i.data)}, texto: ${i.texto} }`
                console.log(postShaped)
            })
        } else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
        }

        this.teclarEnter()
    }

    // Support
    removerPostagensAvancadasSemViews(): void {
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            /*
                Access advanced posts and check if they have 0 views
                They are deleted from the virtual arrays first 
                The change will be reflexed on the text files after algorithm ends
            */
            p instanceof PostagemAvancada && p.visualizacoesRestantes == 0 
            ?  this.redeSocial.repPosts.postagens.splice(i, 1)
            : null
        }
    }

    habilitarPostagemInteracao(): void {
        console.log("===== CONFIGURAÇÕES =====")
        console.log(`1. Simular atividade nas postagens: ${this._triggerOptionA != 0 ? "ATIVADA" : "DESATIVADA"}`)
        
        let option: string
        do {
            option = this.requisitarEntrada("Deseja ativar está funcionalidade?\n0. desativar\n1. ativar\n2. sair")
            if (option === "2") {
                break
            }
        } while (option !== "0" && option !== "1" && option !== "2")
        
        if (option === "0") {
            this.gravarUltimoValorConfigA(option)
            this.triggerOptionA = 0
        }
        else if (option === "1") {
            this.gravarUltimoValorConfigA(option)
            this.triggerOptionA = 1
        } 
    }

    apagarConteudoRepositorio(): void {
        this.postsTxt.content = ""
        this.postsTxt.write()
        console.log(new Messages().msg.success.postsRepositoryErased)
        this.teclarEnter()
    }
}

export class Hashtag {
    private _hashBox: string[]
    private _uniqueHashBox: string[]
    private _countageReport: [string, number][] = []
    
    constructor(hashBox: string[]) {
        this._hashBox = hashBox
        this._uniqueHashBox = []
        this._countageReport = []
    }

    get hashBox(): string[] {
        return this._hashBox
    }

    set hashBox(newValue) {
        this._hashBox = newValue
    }

    get uniqueHashBox(): string[] {
        return this._uniqueHashBox
    }

    set uniqueHashBox(newValue) {
        this._uniqueHashBox = newValue
    }

    get countageReport(): [string, number][] {
        return this._countageReport
    }

    filtrarHashtagsUnicas(): string[] {
        this.uniqueHashBox = this.hashBox.filter((i: string, pos: number, array: string[]) => {
            if (array.indexOf(i) === pos) {
                return true
            }
        })
        return this.uniqueHashBox
    }

    contarCadaHashtag(): [string, number][] {
        const report: [string, number][] = [];
      
        this.uniqueHashBox.forEach((i, pos) => {
            report[pos] = [i, 0]
        })
    
        this.hashBox.forEach((i) => {
            if (this.uniqueHashBox.includes(i)) {
                report[this.uniqueHashBox.indexOf(i)][1]++
            }
        })
        
        return report
    }
    
    ordenarCrescente(): [string, number][] {
        const hashtagsSortedAscending: [string, number][] = this.contarCadaHashtag().sort((i: [string, number], i2: [string, number]) => {
            if (i2[1] < i[1]) {
                return -1  
            } else if (i2[1] > i[1]) {
                return 1  
            } else {
                return 0   
            }
        })
        return hashtagsSortedAscending
    }
}

export class Calendario {
    
    obterIdadeData(dateData: string): number {
        const today: Date = new Date()
        const anotherDate: Date = new Date(dateData)
        const difference: number = (today.getTime() - anotherDate.getTime())
        const days: number = difference / (1000 * 60 * 60 * 24)
        return Math.floor(days)
    }
    
    converterMesParaTexto(dateData: string): string {
        let dateAsArray: string[] = dateData.split("-")
        let month: string | number = dateAsArray[1]
        
        if (month[0] === "0") {
            month = Number(month).toString()
        }
        
        month === "1" ? month = "janeiro" : null
        month === "2" ? month = "fevereiro" : null
        month === "3" ? month = "março" : null
        month === "4" ? month = "abril" : null
        month === "5" ? month = "maio" : null
        month === "6" ? month = "junho" : null
        month === "7" ? month = "julho" : null
        month === "8" ? month = "agosto" : null
        month === "9" ? month = "setembro" : null
        month === "10" ? month = "outubro" : null
        month === "11" ? month = "novembro" : null
        month === "12" ? month = "dezembro" : null
        
        const dateShaped: string = `${dateAsArray[2]} de ${month} de ${dateAsArray[0]}`.toString()

        return dateShaped
    }
}

export class Valor {
    criarValor(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min)
    }
}

export class Messages {
    msg

    constructor() {
        this.msg = {
            warn: "\n===== AVISO =====",
            info: {
                postHighlight: "===== POSTAGEM  =====",
                postsFound: "===== POSTAGENS ENCONTRADAS ====="
            },
            operations: {
                includeProfile: "===== OPERAÇÃO 1: INCLUSÃO DE PERFIL =====",
                searchProfile: "===== OPERAÇÃO 2: PROCURAR PERFIL =====",
                includePost: "===== OPERAÇÃO 3: INCLUSÃO DE POSTAGEM =====",
                queryPost: "===== OPERAÇÃO 4: CONSULTA DE POSTAGEM =====",
                likePost: "===== OPERAÇÃO 5: CURTIR POSTAGEM =====",
                unlikePost: "===== OPERAÇÃO 6: DESCURTIR POSTAGEM =====",
                lessView: "===== OPERAÇÃO 7: DECREMENTAR VIEWS =====",
                showPostsByProfile: "===== OPERAÇÃO 8: EXIBIR POSTAGENS POR PERFIL =====",
                showPostsByHashtag: "===== OPERAÇÃO 9: EXIBIR POSTAGENS POR HASHTAG =====",
                showProfileRepository: "===== OPERAÇÃO 10: VER BANCO DE PERFIS =====",
                showPostsRepository: "===== OPERAÇÃO 11: VER BANCO DE POSTAGENS =====",
                queryMostPopularPosts: "===== OPERAÇÃO 12: CONSULTAR POSTS MAIS POPULARES ======",
                queryMostPopularHashtags: "===== OPERAÇÃO 13: CONSULTAR HASHTAGS MAIS POPULARES =====",
                postHashtagAppend: "===== OPERAÇÃO 14: ADIÇÃO DE HASHTAG EM POSTAGEM EXISTENTE =====",
                postRemoval: "===== OPERAÇÃO 15: REMOÇÃO DE POSTAGEM =====",
                postContentEdit: "===== OPERAÇÃO 16: ALTERAÇÃO DE CONTEÚDO DE POSTAGEM =====",
                postQueryComplete: "===== OPERAÇÃO 17: PESQUISAR POSTAGENS (MÊS E ANO) ====="
            },
            success: {
                appClosed: "Aplicação encerrada!\n",
                hashtagAdded: "Hashtag adicionada!\n",
                postLiked: "Postagem curtida! aperte ENTER e verifique.\n",
                postDisliked: "Postagem descurtida! aperte ENTER e verifique.\n",
                profileCreated: "Perfil criado!\n",
                postCreated: "Postagem criada!\n",
                postRemoved: "Postagem removida!\n",
                postContentChanged: "Conteúdo da postagem alterada!\n",
                postsRepositoryErased: "Conteúdo do repositório das postagens limpado!\n"
            },
            fail: {
                invalidOptionsMainSwitch: "Opções permitidas: 1 a 11!\n",
                invalidOptionSwitchPostInclusion: "Opções válidas: 1 ou 2\n",
                hashtagExists: "Hashtag repetida detectada!\n",
                postNotCreated: "Postagem não criada!\n",
                postNotFound: "Postagem não encontrada!\n",
                postIsRegular: "Postagens comuns não recebem hashtag\n",
                profileNotCreated: "Perfil não criado!\n"
            },
            inputs: {
                pressEnter: "\n>>> Pressione ENTER <<<",
                askOperationValue: "Digite o valor da operação",
                askPersonName: "Nome da pessoa:",
                askPersonEmail: "Email da pessoa:",
                askProfileId: "Informe o id do perfil",
                askPostType: "Informe o tipo de postagem:\n1. regular\n2. avançada",
                askPostContent: "Texto da postagem",
                askDateAsTutorial: "Informe ano, mês e o dia da postagem (ex: 2023-02-20)",
                askPostViewsRange: "Defina uma qtd. limite de views p/ a postagem",
                askHashtagsAmount: "Informe a qtd. de hashtags",
                askHashtagContent: "Informe a hashtag dessa postagem (incluir #)",
                askHashtagContentNoHash: "Informe a hashtag dessa postagem (não incluir #)",
                askPostId: "Informe o id da postagem dessa postagem",
                askSearchingMethod: "Informe sua forma de procura:\n1. id de perfil\n2. hashtag",
                askHashtagAmountForRank: "Informe a qtd. de hashtags para fazer o rank",
                askNewPostText: "Informe o novo texto desta postagem",
                choosePostId: "Escolha e informe o id da postagem a receber nova hashtag",
            },
            tutorial: {
                askWhichId: "\nEscolha entre os id aquele que deseja add uma hashtag: ",
                chooseAdvancedPost: "OBS: Observe as postagens e escolha a que for avançada"
            }
        }
    }
}
